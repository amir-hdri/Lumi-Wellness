import { describe, expect, it } from "vitest";
import { assertDeployEnv } from "../../config/deploy-env.mjs";

const deployBuild = {
  VERCEL: "1",
  NEXT_PUBLIC_API_URL: "https://api.gymapp.ir",
  NEXT_PUBLIC_USE_MOCKS: "false",
  NEXT_PUBLIC_APP_URL: "https://lumi.example.com",
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

  it("requires the real frontend origin in a deployment build", () => {
    expect(() => assertDeployEnv({ ...deployBuild, NEXT_PUBLIC_APP_URL: undefined }))
      .toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it.each(["http://localhost:3000", "https://example.com/path", " https://example.com "])(
    "rejects invalid deployment metadata origins: %s", (url) => {
      expect(() => assertDeployEnv({ ...deployBuild, NEXT_PUBLIC_APP_URL: url }))
        .toThrow(/NEXT_PUBLIC_APP_URL/);
    },
  );

  it.each([
    "not-a-url", "ftp://api.example.com", "http://api.example.com",
    "https://localhost.:8000", "https://127.1:8000", "https://[::1]:8000",
    "https://user:secret@api.example.com", "https://api.example.com/api/v1",
    "https://api.example.com?token=value", "https://api.example.com#fragment",
    " https://api.example.com ",
  ])("rejects an unusable deployed API origin: %s", (url) => {
    expect(() => assertDeployEnv({ ...deployBuild, NEXT_PUBLIC_API_URL: url }))
      .toThrow(/NEXT_PUBLIC_API_URL/);
  });
});
