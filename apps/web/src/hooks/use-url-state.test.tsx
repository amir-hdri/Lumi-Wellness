import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { useUrlState } from "./use-url-state";

function Choice() {
  const [value, setValue] = useUrlState("status", "all", ["all", "active"]);
  return <><output>{value}</output><button onClick={() => setValue("active")}>active</button></>;
}
beforeEach(() => window.history.replaceState({}, "", "/coach/programs?keep=1&page=3&status=invalid"));
it("rejects unknown values, keeps unrelated parameters and resets pagination on filtering", async () => {
  render(<Choice />);
  expect(screen.getByRole("status")).toHaveTextContent("all");
  await userEvent.click(screen.getByRole("button"));
  expect(new URLSearchParams(location.search).get("status")).toBe("active");
  expect(new URLSearchParams(location.search).get("keep")).toBe("1");
  expect(new URLSearchParams(location.search).has("page")).toBe(false);
  act(() => { history.replaceState({}, "", "/coach/programs?status=all"); window.dispatchEvent(new PopStateEvent("popstate")); });
  expect(screen.getByRole("status")).toHaveTextContent("all");
});
