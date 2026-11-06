import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import PaymentsPage from "./page";
import PaymentDetails from "./[id]/page";
import { EditPaymentSheet } from "../_components/PaymentSheets";

const mocks = vi.hoisted(() => ({ update: vi.fn(), payment: {
  id: "payment", userId: "member", amount: 1000, currency: "IRR", status: "cancelled",
  method: "cash", createdAt: "2026-11-01T10:00:00Z", description: "یادداشت",
} }));
vi.mock("next/navigation", () => ({ useParams: () => ({ id: "payment" }) }));
vi.mock("@/hooks/use-api", () => ({
  usePayment: () => ({ data: { data: mocks.payment } }),
  usePayments: () => ({ data: { data: [mocks.payment] } }),
  useUpdatePayment: () => ({ mutateAsync: mocks.update }),
  useUpdatePaymentStatus: () => ({ mutate: vi.fn() }),
  useCreatePayment: () => ({ mutateAsync: vi.fn() }),
  useUsers: () => ({ data: { data: [] } }), useMemberships: () => ({ data: { data: [] } }),
}));
vi.mock("@/components/analytics/Charts", () => ({ RevenueChart: () => null }));

it.each(["cancelled", "refunded"])("renders a %s payment in its list and detail", (status) => {
  mocks.payment.status = status;
  render(<PaymentsPage />);
  expect(screen.getByRole("heading", { name: "پرداخت‌ها" })).toBeInTheDocument();
  render(<PaymentDetails />);
  expect(screen.getByRole("heading", { name: "جزئیات تراکنش" })).toBeInTheDocument();
});

it("editing a cancelled payment preserves its status", async () => {
  mocks.payment.status = "cancelled";
  mocks.update.mockResolvedValue({ success: true, data: mocks.payment });
  render(<EditPaymentSheet open onOpenChange={vi.fn()} payment={mocks.payment as never} />);
  await userEvent.click(screen.getByRole("button", { name: /ذخیره/ }));
  expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "cancelled" }) }));
});
