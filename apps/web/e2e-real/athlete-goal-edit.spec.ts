import { expect, test } from "@playwright/test";
import { api, signIn } from "./helpers";

test("athlete edits every goal field, reloads persisted data and confirms deletion", async ({ page, request }, info) => {
  const auth = await signIn(page, request, "athlete");
  const title = `هدف رابط ${info.project.name} ${Date.now()}`;
  const created = await request.post(`${api}/goals`, { headers: auth.headers, data: {
    athleteId: auth.user.id, title, category: "strength", targetValue: 20, currentValue: 5,
    unit: "kg", targetDate: "2026-12-01T00:00:00Z", description: "یادداشت اولیه",
  } });
  expect(created.ok()).toBeTruthy();
  const goal = (await created.json()).data;
  await page.goto(`/athlete/goals/${goal.id}`);
  await page.getByRole("textbox", { name: "عنوان هدف", exact: true }).fill(`${title} ویرایش`);
  await page.getByRole("spinbutton", { name: "مقدار فعلی", exact: true }).fill("7");
  await page.getByRole("spinbutton", { name: "مقدار هدف", exact: true }).fill("25");
  await page.getByRole("textbox", { name: "واحد", exact: true }).fill("کیلوگرم");
  await page.getByRole("textbox", { name: "یادداشت", exact: true }).fill("یادداشت جدید");
  await page.getByRole("button", { name: "ذخیره تغییرات", exact: true }).click();
  await expect(page).toHaveURL(/\/athlete\/goals$/);
  await page.goto(`/athlete/goals/${goal.id}`);
  await expect(page.getByRole("textbox", { name: "عنوان هدف", exact: true })).toHaveValue(`${title} ویرایش`);
  const stored = (await (await request.get(`${api}/goals/${goal.id}`, { headers: auth.headers })).json()).data;
  expect(stored).toMatchObject({ title: `${title} ویرایش`, currentValue: 7, targetValue: 25, unit: "کیلوگرم", description: "یادداشت جدید", status: "in_progress" });
  await page.getByRole("spinbutton", { name: "مقدار فعلی", exact: true }).fill("25");
  await page.getByRole("button", { name: "ذخیره تغییرات", exact: true }).click();
  await expect(page).toHaveURL(/\/athlete\/goals$/);
  expect((await (await request.get(`${api}/goals/${goal.id}`, { headers: auth.headers })).json()).data.status).toBe("achieved");
  await page.goto(`/athlete/goals/${goal.id}`);
  await page.getByRole("button", { name: "حذف هدف", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await request.get(`${api}/goals/${goal.id}`, { headers: auth.headers })).ok()).toBeTruthy();
  await page.getByRole("button", { name: "تأیید حذف هدف", exact: true }).click();
  await expect(page).toHaveURL(/\/athlete\/goals$/);
  expect((await request.get(`${api}/goals/${goal.id}`, { headers: auth.headers })).status()).toBe(404);
});
