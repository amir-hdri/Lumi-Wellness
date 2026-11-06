import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import InvoiceDetailPage from "./[id]/page";

vi.mock("next/navigation", () => ({ useParams: () => ({ id: "p1" }) }));
vi.mock("@/hooks/use-api", () => ({ usePayment: () => ({ data: { data: { id: "p1", userId: "a1", amount: 5000, status: "refunded", method: "cash", createdAt: "2026-11-06T08:00:00Z", description: "رسید آزمون" } } }) }));
afterEach(() => vi.restoreAllMocks());
it("prints the invoice and downloads an accurately named text receipt", async () => {
  const print = vi.spyOn(window, "print").mockImplementation(() => {});
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) { expect(this.download).toBe("lumi-receipt-p1.txt"); });
  URL.createObjectURL = vi.fn(() => "blob:receipt");
  URL.revokeObjectURL = vi.fn();
  render(<InvoiceDetailPage />);
  await userEvent.click(screen.getByRole("button", { name: /چاپ/ }));
  expect(print).toHaveBeenCalledOnce();
  await userEvent.click(screen.getByRole("button", { name: "دریافت رسید متنی" }));
  expect(click).toHaveBeenCalledOnce();
  expect(screen.getAllByText("بازگشت‌خورده").length).toBeGreaterThan(0);
});
