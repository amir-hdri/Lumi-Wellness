import { describe, expect, it } from "vitest";
import { assertDeployEnv } from "../../config/deploy-env.mjs";

const deployBuild = {
  VERCEL: "1",
  NEXT_PUBLIC_API_URL: "https://api.gymapp.ir",
  NEXT_PUBLIC_USE_MOCKS: "false",
};

describe("assertDeployEnv", () => {
  it("accepts a deploy build that points at a real API", () => {
    expect(() => assertDeployEnv(deployBuild)).not.toThrow();
  });

  it("rejects a deploy build with the mock layer enabled", () => {
    expect(() =>
      assertDeployEnv({ ...deployBuild, NEXT_PUBLIC_USE_MOCKS: "true" })
    ).toThrow(/mock/i);
  });

  it("rejects a deploy build without an API URL", () => {
    expect(() =>
      assertDeployEnv({ VERCEL: "1", NEXT_PUBLIC_USE_MOCKS: "false" })
    ).toThrow(/NEXT_PUBLIC_API_URL/);
  });

  it("rejects a deploy build that points at localhost", () => {
    expect(() =>
      assertDeployEnv({ ...deployBuild, NEXT_PUBLIC_API_URL: "http://localhost:8000" })
    ).toThrow(/NEXT_PUBLIC_API_URL/);
  });

  it("rejects a Docker deploy build that points at localhost", () => {
    expect(() =>
      assertDeployEnv({
        NEXT_DOCKER_BUILD: "1",
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:8000",
        NEXT_PUBLIC_USE_MOCKS: "false",
      })
    ).toThrow(/NEXT_PUBLIC_API_URL/);
  });

  it("allows the mock layer in a local build", () => {
    expect(() =>
      assertDeployEnv({
        NEXT_PUBLIC_USE_MOCKS: "true",
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
      })
    ).not.toThrow();
  });
});
