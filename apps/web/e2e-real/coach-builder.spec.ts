import { expect, test } from "@playwright/test";
import { api, signIn } from "./helpers";

test("coach builds an empty draft, edits prescriptions and activates the saved program", async ({ page, request }, info) => {
  const coach = await signIn(page, request, "coach");
  const athletes = (await (await request.get(`${api}/users?role=athlete`, { headers: coach.headers })).json()).data;
  const library = (await (await request.get(`${api}/exercises`, { headers: coach.headers })).json()).data;
  const exercise = library[0];
  const created = await request.post(`${api}/training-programs`, { headers: coach.headers, data: {
    athleteId: athletes[0].id, coachId: coach.user.id, name: `سازنده ${info.project.name} ${Date.now()}`,
    startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30 * 86400000).toISOString(), frequencyPerWeek: 3,
  } });
  expect(created.ok()).toBeTruthy();
  const program = (await created.json()).data;
  await page.goto(`/coach/programs/${program.id}`);
  await expect(page.getByRole("tab")).toHaveCount(7);
  await page.getByRole("tab", { name: "دوشنبه", exact: true }).click();
  await page.getByRole("button", { name: "افزودن حرکت", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: /^حرکت/ }).click();
  await page.getByRole("option", { name: `${exercise.name} — ${exercise.muscleGroup}`, exact: true }).click();
  await dialog.getByLabel(/^تکرار/).fill("8-10");
  await dialog.getByLabel(/^وزن/).fill("20");
  await dialog.getByRole("button", { name: "افزودن حرکت", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "دوشنبه", exact: true }).click();
  await expect(page.getByText(/8-10 تکرار/)).toBeVisible();
  await page.getByRole("button", { name: `ویرایش ${exercise.name}`, exact: true }).click();
  await expect(dialog.getByRole("combobox", { name: /^حرکت/ })).toBeDisabled();
  await dialog.getByRole("combobox", { name: /^روز تمرین/ }).click();
  await page.getByRole("option", { name: "جمعه", exact: true }).click();
  await dialog.getByLabel(/^تکرار/).fill("12-15");
  await dialog.getByLabel(/^وزن/).fill("");
  await dialog.getByRole("button", { name: "ذخیره حرکت", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "جمعه", exact: true }).click();
  await expect(page.getByText(/12-15 تکرار/)).toBeVisible();
  const stored = (await (await request.get(`${api}/training-programs/${program.id}`, { headers: coach.headers })).json()).data;
  expect(stored.exercises).toHaveLength(1);
  expect(stored.exercises[0]).toMatchObject({ dayOfWeek: 6, reps: "12-15", weight: null, isCompleted: false });
  await page.getByRole("button", { name: "فعال‌سازی", exact: true }).click();
  await expect(page.getByText("فعال", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("فعال", { exact: true })).toBeVisible();
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  await page.getByRole("button", { name: "حذف برنامه", exact: true }).click();
  await dialog.getByRole("button", { name: "تأیید حذف برنامه", exact: true }).click();
  await expect(page).toHaveURL(/\/coach\/programs$/);
});
