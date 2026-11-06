import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { MessagesPage } from "./MessagesPage";

const mocks = vi.hoisted(() => ({ replace: vi.fn(), create: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace }), useSearchParams: () => new URLSearchParams() }));
vi.mock("@/components/auth/AuthProvider", () => ({ useAuth: () => ({ user: { id: "coach", role: "coach" } }) }));
vi.mock("@/hooks/use-api", () => ({ useUsers: () => ({ data: { data: [{ id: "athlete", firstName: "ورزشکار", lastName: "واقعی" }] } }) }));
vi.mock("@/hooks/use-messages", () => ({
  useConversations: () => ({ data: { data: [] } }), useMessages: () => ({ data: { data: [] } }),
  useSendMessage: () => ({ mutateAsync: vi.fn() }), useMarkConversationRead: () => ({ mutate: vi.fn() }),
  useCreateConversation: () => ({ mutateAsync: mocks.create }),
}));
vi.mock("@/app/coach/_components/NewConversationSheet", () => ({
  NewConversationSheet: ({ open, onSubmit }: { open: boolean; onSubmit: (id: string) => void }) => open
    ? <button onClick={() => onSubmit("athlete")}>شروع گفت‌وگو</button> : null,
}));

it("lets a coach with no threads start a saved conversation", async () => {
  mocks.create.mockResolvedValue({ success: true, data: { id: "saved-thread" } });
  render(<MessagesPage role="coach" />);
  await userEvent.click(screen.getByRole("button", { name: "گفت‌وگوی تازه" }));
  await userEvent.click(screen.getByRole("button", { name: "شروع گفت‌وگو" }));
  expect(mocks.replace).toHaveBeenCalledWith("/coach/messages?c=saved-thread", { scroll: false });
});
