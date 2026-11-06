import { expect, test } from "@playwright/test";

test("landing CTA has readable contrast in both themes and artwork fills its section", async ({ page }) => {
  for (const theme of ["dark", "light"]) {
    await page.addInitScript(t => localStorage.setItem("theme", t), theme);
    await page.goto("/");
    const cta = page.getByRole("link", { name: "ثبت‌نام ورزشکار", exact: true });
    await expect(cta).toBeVisible();
    const ratio = await cta.evaluate(e => {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      const luminance = (color: string) => { ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data; const linear = [r, g, b].map(v => v / 255 <= .04045 ? v / 255 / 12.92 : ((v / 255 + .055) / 1.055) ** 2.4); return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]; };
      const s = getComputedStyle(e); const fg = luminance(s.color), bg = luminance(s.backgroundColor);
      return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    const art = page.locator("#top > div").first();
    expect(await art.evaluate(e => getComputedStyle(e).position)).toBe("absolute");
    expect((await art.boundingBox())!.height).toBeGreaterThan(400);
    expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
});

test("program filters survive reload and browser back", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("auth_user", JSON.stringify({ id: "u2", role: "coach", firstName: "مربی", lastName: "آزمون", email: "coach@gymapp.ir", status: "active" }));
    localStorage.setItem("auth_tokens", JSON.stringify({ accessToken: "e2e-access-token", refreshToken: "e2e-refresh-token", accessTokenExpiry: new Date(Date.now() + 3600000).toISOString(), refreshTokenExpiry: new Date(Date.now() + 86400000).toISOString() }));
  });
  await page.goto("/coach/programs?status=draft");
  await expect(page.getByRole("button", { name: "پیش‌نویس", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "فعال", exact: true }).click();
  await expect(page).toHaveURL(/status=active/);
  await page.reload();
  await expect(page.getByRole("button", { name: "فعال", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(page.getByRole("button", { name: "پیش‌نویس", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("a goal draft survives SPA Back, Forward and reload", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("auth_user", JSON.stringify({ id: "u5", role: "athlete", firstName: "ورزشکار", lastName: "آزمون", email: "athlete@gymapp.ir", status: "active" }));
    localStorage.setItem("auth_tokens", JSON.stringify({ accessToken: "e2e-access-token", refreshToken: "e2e-refresh-token", accessTokenExpiry: new Date(Date.now() + 3600000).toISOString(), refreshTokenExpiry: new Date(Date.now() + 86400000).toISOString() }));
  });
  await page.goto("/athlete/goals");
  await page.locator('a[href="/athlete/goals/g1"]').click();
  await page.getByRole("textbox", { name: "عنوان هدف", exact: true }).fill("پیش‌نویس بازگشت");
  await page.goBack();
  await expect(page).toHaveURL(/\/athlete\/goals$/);
  await page.goForward();
  await expect(page.getByRole("textbox", { name: "عنوان هدف", exact: true })).toHaveValue("پیش‌نویس بازگشت");
  page.once("dialog", dialog => dialog.accept());
  await page.reload();
  await expect(page.getByRole("textbox", { name: "عنوان هدف", exact: true })).toHaveValue("پیش‌نویس بازگشت");
});

test("active admin directories restore their filters from the URL", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("auth_user", JSON.stringify({ id: "u1", role: "admin", firstName: "مدیر", lastName: "آزمون", email: "admin@gymapp.ir", status: "active" }));
    localStorage.setItem("auth_tokens", JSON.stringify({ accessToken: "e2e-access-token", refreshToken: "e2e-refresh-token", accessTokenExpiry: new Date(Date.now() + 3600000).toISOString(), refreshTokenExpiry: new Date(Date.now() + 86400000).toISOString() }));
  });
  await page.goto("/admin/members?status=suspended");
  await expect(page.getByRole("button", { name: "تعلیق شده", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/admin/coaches?q=%D8%A7%D8%AD%D9%85%D8%AF%DB%8C");
  await expect(page.getByRole("searchbox")).toHaveValue("احمدی");
});
