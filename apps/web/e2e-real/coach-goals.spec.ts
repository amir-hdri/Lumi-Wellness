import { expect, test } from "@playwright/test";
import { api, signIn } from "./helpers";

test("coach reaches a pupil program and saves goal edits from the pupil panel", async ({ page, request }, info) => {
  const coach = await signIn(page, request, "coach");
  const dashboard = (await (await request.get(`${api}/dashboard/coach/${coach.user.id}`, { headers: coach.headers })).json()).data;
  const pupil = dashboard.athletes.find((a: { currentProgram?: unknown }) => a.currentProgram);
  expect(pupil).toBeTruthy();
  const title = `هدف ${info.project.name} ${Date.now()}`;
  const created = await request.post(`${api}/goals`, { headers: coach.headers, data: {
    athleteId: pupil.id, coachId: coach.user.id, title, category: "strength", targetValue: 20,
    currentValue: 5, unit: "kg", targetDate: new Date(Date.now() + 30 * 86400000).toISOString(),
  } });
  expect(created.ok()).toBeTruthy();
  const goal = (await created.json()).data;
  await page.goto("/coach/athletes");
  const row = page.getByRole("row").filter({ has: page.locator(`a[href="/coach/athletes/${pupil.id}"]`) });
  await row.getByRole("link", { name: "برنامه تمرینی", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/coach/programs/${pupil.currentProgram.id}$`));
  await page.goto(`/coach/athletes/${pupil.id}`);
  await page.getByRole("tab", { name: "پیشرفت", exact: true }).click();
  await page.getByRole("button", { name: `ویرایش هدف ${title}`, exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/^عنوان هدف/).fill(`${title} ویرایش`);
  await dialog.getByLabel(/^مقدار فعلی/).fill("7");
  await dialog.getByLabel(/^مقدار هدف/).fill("25");
  await dialog.getByRole("button", { name: "ذخیره هدف", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "پیشرفت", exact: true }).click();
  await expect(page.getByText(`${title} ویرایش`, { exact: true })).toBeVisible();
  const stored = (await (await request.get(`${api}/goals/${goal.id}`, { headers: coach.headers })).json()).data;
  expect(stored).toMatchObject({ title: `${title} ویرایش`, currentValue: 7, targetValue: 25 });
});
