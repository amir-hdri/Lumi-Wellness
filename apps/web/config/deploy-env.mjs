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
const LOCAL_API_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i;

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

  const apiUrl = (env.NEXT_PUBLIC_API_URL || "").trim();
  if (!apiUrl || LOCAL_API_HOST.test(apiUrl)) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must point at the deployed API (set it in the Vercel project environment, or pass --build-arg NEXT_PUBLIC_API_URL=... to the Docker build).",
    );
  }
}
