import { render, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { RouteTitle } from "./RouteTitle";
vi.mock("next/navigation", () => ({ usePathname: () => "/athlete/goals/g1" }));
it("names a route after its heading arrives asynchronously", async () => {
  const view = render(<><RouteTitle /><main id="main">در حال بارگذاری…</main></>);
  view.rerender(<><RouteTitle /><main id="main"><h1>هدف قدرت</h1></main></>);
  await waitFor(() => expect(document.title).toBe("هدف قدرت | Lumi Wellness"));
});
