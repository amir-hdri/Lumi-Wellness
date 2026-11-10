import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(resolve(process.cwd(), "public/sw.js"), "utf8");

function worker() {
  const handlers: Record<string, (event: any) => void> = {};
  const put = vi.fn().mockResolvedValue(undefined);
  const cache = { put, add: vi.fn().mockResolvedValue(undefined) };
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    match: vi.fn().mockResolvedValue(undefined),
    keys: vi.fn().mockResolvedValue(["lumi-shell-v3", "another-app-cache"]),
    delete: vi.fn().mockResolvedValue(true),
  };
  const response = {
    ok: true, type: "basic", headers: new Headers({ "content-type": "text/html" }),
    clone() { return this; },
  };
  const fetch = vi.fn().mockResolvedValue(response);
  runInNewContext(source, {
    self: {
      addEventListener: (name: string, fn: (event: any) => void) => { handlers[name] = fn; },
      clients: { claim: vi.fn(), matchAll: vi.fn().mockResolvedValue([]) },
    },
    location: { origin: "https://lumi.example.com" }, URL, fetch, caches,
  });
  async function request(path: string, headers: Record<string, string> = {}, mode = "cors") {
    let promise: Promise<unknown> | undefined;
    handlers.fetch({
      request: { url: `https://lumi.example.com${path}`, method: "GET", mode, headers: new Headers(headers) },
      respondWith: (value: Promise<unknown>) => { promise = value; },
    });
    await promise;
    await Promise.resolve();
    return promise;
  }
  return { request, caches, fetch, response, put, handlers };
}

describe("offline cache privacy", () => {
  it.each(["/athlete?_rsc=abc", "/coach/programs/1", "/admin/members", "/auth/reset-password?token=secret"])(
    "does not cache private page fetches: %s", async (path) => {
      const w = worker();
      await w.request(path);
      expect(w.caches.open).not.toHaveBeenCalled();
      expect(w.caches.match).not.toHaveBeenCalled();
    },
  );
  it("does not cache public RSC prefetches", async () => {
    const w = worker();
    await w.request("/?_rsc=abc", { RSC: "1" });
    expect(w.put).not.toHaveBeenCalled();
  });
  it.each(["private, max-age=0", "no-store"])("respects %s responses", async (policy) => {
    const w = worker();
    w.response.headers.set("cache-control", policy);
    await w.request("/", { accept: "text/html" }, "navigate");
    expect(w.put).not.toHaveBeenCalled();
  });
  it("still caches public navigation and hashed assets", async () => {
    const w = worker();
    await w.request("/", { accept: "text/html" }, "navigate");
    await w.request("/_next/static/chunks/abc.js");
    expect(w.put).toHaveBeenCalledTimes(2);
  });
  it("keeps unrelated application caches during activation", async () => {
    const w = worker();
    let pending: Promise<unknown> | undefined;
    w.handlers.activate({ waitUntil: (value: Promise<unknown>) => { pending = value; } });
    await pending;
    expect(w.caches.delete).toHaveBeenCalledWith("lumi-shell-v3");
    expect(w.caches.delete).not.toHaveBeenCalledWith("another-app-cache");
  });
});
