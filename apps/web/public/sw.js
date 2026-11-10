/* Lumi Wellness service worker — offline shell, network-first navigation */
const VERSION = "v4";
const CACHE = `lumi-shell-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE = [
  "/",
  "/offline",
  "/site.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

/* Portal routes render per-account data. Never cache them: on a shared device
   the cached shell would be served to the next person, and offline they should
   get the offline page rather than a stale dashboard. */
const PRIVATE_PREFIXES = ["/athlete", "/coach", "/admin", "/auth"];

function isPrivate(url) {
  return PRIVATE_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Per-entry rather than addAll(): one missing icon must not abort the
      // whole install and leave the app with no worker at all.
      Promise.allSettled(PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" }))))
    )
  );
  // Deliberately NO skipWaiting() here. Taking over a live page mid-session
  // purges the chunks it is still fetching (ChunkLoadError after deploy). The
  // new worker waits; PwaRegister offers the user an explicit update.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("lumi-shell-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "OFFLINE_READY", version: VERSION }));
      })
  );
});

function isApiRequest(url) {
  return url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname === "/v1" || url.pathname.startsWith("/v1/");
}

function isNavigate(request) {
  return request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
}

/** Only store real, same-origin success responses. */
function isCacheable(response) {
  const policy = response?.headers.get("cache-control") || "";
  return Boolean(response) && response.ok && response.type === "basic" &&
    !/\b(no-store|private)\b/i.test(policy) &&
    !response.headers.get("content-type")?.includes("text/x-component");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET. Cross-origin (including the API on its own
  // host) falls through to the network untouched.
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // Next's client navigation/prefetch uses ordinary GETs, not navigations.
  // Keep account pages, reset links and RSC payloads out of every cache branch.
  if (request.headers.has("authorization") || request.headers.get("RSC") === "1" ||
      url.searchParams.has("_rsc") || (isPrivate(url) && !isNavigate(request))) return;

  // Same-origin API (reverse-proxied deployments): network-only.
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ detail: "offline" }), {
            status: 503,
            headers: { "content-type": "application/json" },
          })
      )
    );
    return;
  }

  // Navigation: network-first → cache → offline page.
  if (isNavigate(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheable(response) && !isPrivate(url)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          if (!isPrivate(url)) {
            const cached = await caches.match(request);
            if (cached) return cached;
          }
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          return (await caches.match("/")) ?? Response.error();
        })
    );
    return;
  }

  // Cache only public static assets, never arbitrary same-origin data reads.
  if (!url.pathname.startsWith("/_next/static/") &&
      !url.pathname.startsWith("/_next/image") &&
      !PRECACHE.includes(url.pathname) &&
      !/\.(png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf)$/i.test(url.pathname)) return;

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (isCacheable(response)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  // Accept the bare string too, so a page still controlled by the v1 worker's
  // client code can hand control over instead of getting stuck.
  if (data === "SKIP_WAITING" || data?.type === "SKIP_WAITING") self.skipWaiting();
});
