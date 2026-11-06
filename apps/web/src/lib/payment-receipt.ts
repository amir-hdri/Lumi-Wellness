import type { Payment } from "./types";
import { formatCurrency, formatDateTime } from "./utils";

export const paymentStatusLabels: Record<Payment["status"], string> = {
  completed: "موفق", pending: "در انتظار", failed: "ناموفق", refunded: "بازگشت‌خورده", cancelled: "لغوشده",
};
const methods: Record<Payment["method"], string> = { cash: "نقدی", card: "کارت بانکی", wallet: "کیف پول", bank_transfer: "انتقال بانکی" };

/** Shared receipt for both portals; the filename reflects the actual format. */
export function downloadPaymentReceipt(payment: Payment) {
  const text = ["رسید Lumi Wellness", `شناسه: ${payment.id}`, `کد پیگیری: ${payment.referenceId ?? "—"}`,
    `مبلغ: ${formatCurrency(payment.amount)}`, `وضعیت: ${paymentStatusLabels[payment.status] ?? payment.status}`,
    `پرداخت‌کننده: ${payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : payment.userId}`,
    `روش پرداخت: ${methods[payment.method] ?? payment.method}`,
    `تاریخ: ${formatDateTime(payment.paidAt || payment.createdAt)}`, `توضیحات: ${payment.description ?? "—"}`].join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = `lumi-receipt-${payment.id}.txt`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
