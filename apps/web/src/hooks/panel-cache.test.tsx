import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { useUpdatePaymentStatus, useFreezeMembership } from "./use-api";
import { Q } from "./api-source";

vi.mock("./api-source", async (original) => ({ ...await original<object>(), USE_MOCK: false }));
vi.mock("@/lib/api", () => ({ api: {
  updatePaymentStatus: vi.fn().mockResolvedValue({ success: true }),
  freezeMembership: vi.fn().mockResolvedValue({ success: true }),
} }));

function wrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

it("refreshes visible revenue analytics after payment reconciliation", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  const load = vi.fn().mockResolvedValueOnce(100).mockResolvedValue(225);
  const { result } = renderHook(() => ({
    revenue: useQuery({ queryKey: ["analytics", "revenue"], queryFn: load }),
    update: useUpdatePaymentStatus(),
  }), { wrapper: wrapper(client) });
  await waitFor(() => expect(result.current.revenue.data).toBe(100));
  await act(() => result.current.update.mutateAsync({ id: "payment", status: "completed" }));
  await waitFor(() => expect(result.current.revenue.data).toBe(225));
  client.clear();
});

it("refreshes visible athlete entitlement after management freezes membership", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  const load = vi.fn().mockResolvedValueOnce("active").mockResolvedValue("frozen");
  const { result } = renderHook(() => ({
    membership: useQuery({ queryKey: Q.athleteDashboard("member"), queryFn: load }),
    freeze: useFreezeMembership(),
  }), { wrapper: wrapper(client) });
  await waitFor(() => expect(result.current.membership.data).toBe("active"));
  await act(() => result.current.freeze.mutateAsync({ id: "membership", reason: "rest" }));
  await waitFor(() => expect(result.current.membership.data).toBe("frozen"));
  client.clear();
});
