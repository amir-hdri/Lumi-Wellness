import { expect, type Page, type APIRequestContext } from "@playwright/test";
export const api = "http://127.0.0.1:8100/api/v1";

export async function signIn(page: Page, request: APIRequestContext, role: string) {
  const username =
    role === "receptionist"
      ? "reception"
      : ["athlete", "coach"].includes(role)
        ? `${role}1`
        : role;
  const password = role === "receptionist" ? "reception123" : `${role}123`;
  const result = await request.post(`${api}/auth/login`, {
    data: { email: `${username}@gymapp.ir`, password },
  });
  expect(result.ok()).toBeTruthy();
  const auth = (await result.json()).data;
  await page.addInitScript((data) => {
    localStorage.setItem("auth_tokens", JSON.stringify(data.tokens));
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("theme", "dark");
  }, auth);
  return {
    ...auth,
    headers: { Authorization: `Bearer ${auth.tokens.accessToken}` },
  };
}
