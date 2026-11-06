/**
 * Deploy-time environment guard.
 *
 * `NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so a
 * production build that still carries the dev-only mock switch ships fake data
 * to every visitor, and one without an API URL silently talks to
 * `http://localhost:8000`. Both failures are invisible until real users hit
 * them, so the deploy build refuses to start instead.
 *
 * Local builds stay untouched: `next dev` and `npm run build` on a laptop are
 * allowed to run against the mock layer and a local API.
 */
export function assertDeployEnv(
  /** @type {Record<string, string | undefined>} */
  env = process.env,
) {
  const isDeployBuild = Boolean(env.VERCEL || env.NEXT_DOCKER_BUILD);
  if (!isDeployBuild) return;

  if (env.NEXT_PUBLIC_USE_MOCKS === "true") {
    throw new Error(
      "NEXT_PUBLIC_USE_MOCKS=true is a development-only switch — a deploy build must talk to the real API.",
    );
  }

  const apiUrl = env.NEXT_PUBLIC_API_URL || "";
  let parsed;
  try {
    parsed = new URL(apiUrl);
  } catch {
    // An invalid URL must fail the build, before it reaches Axios or CSP.
  }
  const host = parsed?.hostname.replace(/\.$/, "").toLowerCase();
  if (!parsed || apiUrl !== apiUrl.trim() || parsed.protocol !== "https:" ||
      host === "localhost" || host?.endsWith(".localhost") ||
      host === "[::1]" || host?.startsWith("127.") ||
      parsed.username || parsed.password || parsed.search || parsed.hash ||
      parsed.pathname !== "/") {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be the deployed HTTPS API origin, without credentials, a path, query, fragment, or surrounding whitespace (set it in Vercel or pass --build-arg NEXT_PUBLIC_API_URL=... to Docker).",
    );
  }
}
