import { expect, test } from "@playwright/test";
import { api, signIn } from "./helpers";

for (const [role, routes] of Object.entries({
  athlete: [
    "/athlete",
    "/athlete/programs",
    "/athlete/checkin",
    "/athlete/history",
    "/athlete/profile",
    "/athlete/membership",
    "/athlete/goals",
    "/athlete/calendar",
    "/athlete/messages",
    "/athlete/notifications",
  ],
  coach: [
    "/coach",
    "/coach/athletes",
    "/coach/programs",
    "/coach/exercises",
    "/coach/templates",
    "/coach/messages",
    "/coach/profile",
  ],
  admin: [
    "/admin",
    "/admin/members",
    "/admin/coaches",
    "/admin/plans",
    "/admin/payments",
    "/admin/settings",
    "/admin/profile",
    "/admin/notifications",
  ],
  receptionist: [
    "/admin",
    "/admin/members",
    "/admin/plans",
    "/admin/payments",
    "/admin/profile",
  ],
})) {
  test(`${role}: every portal section renders without overflow`, async ({
    page,
    request,
  }, testInfo) => {
    await signIn(page, request, role);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      if (testInfo.project.name === "mobile") {
        await expect(page.getByRole("navigation", { name: "ناوبری اصلی موبایل" })).toBeVisible();
      } else {
        await expect(page.getByRole("complementary")).toBeVisible();
      }
      await page.waitForLoadState("networkidle");
      const widths = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        screen: innerWidth,
        canvas: document
          .querySelector("main")!
          .getBoundingClientRect().width,
      }));
      expect(widths.content, route).toBeLessThanOrEqual(widths.screen);
      expect(widths.canvas).toBeLessThanOrEqual(widths.screen);
      expect(widths.canvas).toBeGreaterThan(0);
      await page.screenshot({
        path: `test-results/screens/${testInfo.project.name}-${role}-${route.slice(1).replaceAll("/", "-")}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}

test("plan creation and status changes survive reload", async ({
  page,
  request,
}, info) => {
  await signIn(page, request, "admin");
  await page.goto("/admin/plans");
  await page.getByRole("button", { name: "افزودن پلن جدید" }).click();
  const name = `طرح آزمون ${info.project.name}`;
  await page.getByRole("textbox", { name: "نام پلن", exact: true }).fill(name);
  await page.getByLabel("قیمت (ریال)").fill("750000");
  await page.getByRole("button", { name: "ذخیره پلن", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const card = page.getByRole("heading", { name, exact: true }).locator("xpath=../..");
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "غیرفعال کردن", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "غیرفعال کن", exact: true }).click();
  await expect(
    card.getByRole("button", { name: "فعال کردن", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    card.getByRole("button", { name: "فعال کردن", exact: true }),
  ).toBeVisible();
});

test("exercise completion, readiness and attendance persist against real API", async ({
  page,
  request,
}) => {
  const auth = await signIn(page, request, "athlete");
  const programs = (
    await (
      await request.get(`${api}/training-programs`, { headers: auth.headers })
    ).json()
  ).data;
  const p = programs.find((p: { exercises: unknown[] }) => p.exercises.length);
  await page.goto(`/athlete/programs/${p.id}`);
  const checkbox = page.getByRole("checkbox").first();
  const label = await checkbox.getAttribute("aria-label");
  if (!(await checkbox.isChecked())) {
    const saved = page.waitForResponse(
      (r) => r.url().endsWith("/complete") && r.request().method() === "POST",
    );
    await checkbox.press("Space");
    expect((await saved).ok()).toBeTruthy();
  }
  await expect(checkbox).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: label!, exact: true }),
  ).toBeChecked();
  const undone = page.waitForResponse(
    (r) => r.url().endsWith("/complete") && r.request().method() === "POST",
  );
  await page
    .getByRole("checkbox", { name: label!, exact: true })
    .press("Space");
  expect((await undone).ok()).toBeTruthy();
  await expect(
    page.getByRole("checkbox", { name: label!, exact: true }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: label!, exact: true }),
  ).not.toBeChecked();
  await page.goto("/athlete/history");
  await page.getByRole("button", { name: "پرانرژی", exact: true }).click();
  await expect(page.getByText("وضعیت امروز شما ذخیره شده است.")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "پرانرژی", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/athlete/checkin");
  const end = page.getByRole("button", { name: "پایان جلسه" });
  if (await end.isVisible()) await end.click();
  await page
    .getByRole("button", { name: "ثبت ورود", exact: true })
    .click();
  await expect(end).toBeVisible();
  await page.reload();
  await expect(end).toBeVisible();
  await end.click();
  await expect(
    page.getByRole("button", { name: "ثبت ورود", exact: true }),
  ).toBeVisible();
});

test("workout player resumes saved sets and completes the exercise", async ({
  page,
  request,
}, info) => {
  const auth = await signIn(page, request, "athlete");
  const p = (
    await (
      await request.get(`${api}/training-programs`, { headers: auth.headers })
    ).json()
  ).data[0];
  const day = Math.min(
    ...p.exercises.map((e: { dayOfWeek: number }) => e.dayOfWeek),
  );
  const exercises = p.exercises
    .filter((e: { dayOfWeek: number }) => e.dayOfWeek === day)
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order);
  const ex = exercises[0];
  await request.post(
    `${api}/training-programs/${p.id}/exercises/${ex.id}/complete`,
    { headers: auth.headers, data: { completed: false, actualSets: 0 } },
  );
  await page.goto(`/athlete/programs/${p.id}`);
  await page.getByRole("button", { name: "شروع جلسه تمرین" }).click();
  const record = page.getByRole("button", {
    name: "ثبت ست انجام‌شده",
    exact: true,
  });
  await record.click();
  await expect(page.getByText("زمان استراحت و تنفس عمیق")).toBeVisible();
  await page.getByRole("button", { name: "توقف تایمر", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "ادامه تایمر", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "بستن", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "شروع جلسه تمرین" }).click();
  await expect(
    page.getByText(`ست ۲ از ${new Intl.NumberFormat("fa-IR").format(ex.sets)}`),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/screens/${info.project.name}-workout-player.png`,
  });
  for (let set = 1; set < ex.sets; set++) {
    const skip = page.getByRole("button", {
      name: "رد کردن استراحت",
      exact: true,
    });
    if (await skip.isVisible()) await skip.click();
    await record.click();
    await expect(record).not.toHaveText("در حال پردازش");
    if (set < ex.sets - 1) await expect(skip).toBeVisible();
  }
  await expect
    .poll(async () => {
      const latest = (
        await (
          await request.get(`${api}/training-programs/${p.id}`, {
            headers: auth.headers,
          })
        ).json()
      ).data;
      return latest.exercises.find((e: { id: string }) => e.id === ex.id)
        .isCompleted;
    })
    .toBe(true);
});

test("profile and branch forms save real data", async ({
  page,
  request,
}, info) => {
  const auth = await signIn(page, request, "admin");
  await page.goto("/admin/profile");
  const newName = `مدیر ${info.project.name}`;
  await page.getByRole("textbox", { name: "نام", exact: true }).fill(newName);
  const savedProfile = page.waitForResponse((r) => r.url().endsWith("/auth/profile") && r.request().method() === "PUT");
  await page.getByRole("button", { name: "ذخیره تغییرات", exact: true }).click();
  expect((await savedProfile).ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByRole("textbox", { name: "نام", exact: true })).toHaveValue(newName);
  expect(
    (
      await (
        await request.get(`${api}/auth/profile`, { headers: auth.headers })
      ).json()
    ).data.firstName,
  ).toBe(newName);
  await page.goto("/admin/settings");
  await page.getByRole("button", { name: "افزودن شعبه", exact: true }).click();
  const branchName = `شعبه آزمون ${info.project.name}`;
  await page
    .getByRole("textbox", { name: "نام شعبه", exact: true })
    .fill(branchName);
  await page
    .getByRole("textbox", { name: "نشانی", exact: true })
    .fill("تهران، خیابان نمونه");
  await page.getByRole("button", { name: "ذخیره شعبه", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await expect(
    page.getByText(branchName, { exact: true }),
  ).toBeVisible();
});

test("messages survive reload and reach the other participant", async ({ page, request }, info) => {
  const auth = await signIn(page, request, "athlete");
  const conversations = (await (await request.get(`${api}/messages/conversations`, { headers: auth.headers })).json()).data;
  const conversation = conversations[0];
  expect(conversation).toBeTruthy();
  await page.goto(`/athlete/messages?c=${conversation.id}`);
  const body = `پیام آزمون ${info.project.name} ${Date.now()}`;
  await page.getByRole("textbox", { name: "متن پیام" }).fill(body);
  const sent = page.waitForResponse((r) => r.url().endsWith(`/conversations/${conversation.id}/messages`) && r.request().method() === "POST");
  await page.getByRole("button", { name: "ارسال پیام", exact: true }).click();
  expect((await sent).ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByText(body, { exact: true })).toBeVisible();
  const coach = await page.context().browser()!.newContext({ viewport: info.project.use.viewport });
  try {
    const other = await coach.newPage();
    await signIn(other, request, "coach");
    await other.goto(`${info.project.use.baseURL || "http://127.0.0.1:3300"}/coach/messages?c=${conversation.id}`);
    await expect(other.getByText(body, { exact: true })).toBeVisible();
    const reply = `پاسخ ${body}`;
    await other.getByRole("textbox", { name: "متن پیام" }).fill(reply);
    const replied = other.waitForResponse((r) => r.url().endsWith(`/conversations/${conversation.id}/messages`) && r.request().method() === "POST");
    await other.getByRole("button", { name: "ارسال پیام", exact: true }).click();
    expect((await replied).ok()).toBeTruthy();
    await page.reload();
    await expect(page.getByText(reply, { exact: true })).toBeVisible();
  } finally {
    await coach.close();
  }
});

test("general branch settings survive reload", async ({ page, request }, info) => {
  const auth = await signIn(page, request, "admin");
  await page.goto("/admin/settings");
  const name = `باشگاه آزمون ${info.project.name}`;
  await page.getByRole("textbox", { name: "نام باشگاه", exact: true }).fill(name);
  const saved = page.waitForResponse((r) => /\/branches\/[^/]+$/.test(r.url()) && r.request().method() === "PUT");
  await page.getByRole("button", { name: "ذخیره تنظیمات", exact: true }).click();
  expect((await saved).ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByRole("textbox", { name: "نام باشگاه", exact: true })).toHaveValue(name);
  const branches = (await (await request.get(`${api}/branches`, { headers: auth.headers })).json()).data;
  expect(branches.some((branch: { name: string }) => branch.name === name)).toBe(true);
});

test("renewal waits for management approval", async ({ page, request }) => {
  const athlete = await signIn(page, request, "athlete");
  const membership = (await (await request.get(`${api}/memberships`, { headers: athlete.headers })).json()).data[0];
  await page.goto("/athlete/membership");
  await page.getByRole("button", { name: "درخواست تمدید اشتراک", exact: true }).click();
  const requested = page.waitForResponse((r) => r.url().endsWith("/renewal-request") && r.request().method() === "POST");
  await page.getByRole("button", { name: "ارسال درخواست تمدید", exact: true }).click();
  expect((await requested).ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByText("درخواست تمدید ثبت شده و منتظر تأیید مدیریت است")).toBeVisible();
  const pending = (await (await request.get(`${api}/memberships`, { headers: athlete.headers })).json()).data[0];
  expect(pending.endDate).toBe(membership.endDate);
  expect(pending.sessionsTotal).toBe(membership.sessionsTotal);
  const context = await page.context().browser()!.newContext();
  try {
    const manager = await context.newPage();
    await signIn(manager, request, "admin");
    await manager.goto("http://127.0.0.1:3300/admin/notifications");
    await expect(manager.getByText("درخواست تمدید عضویت", { exact: true }).first()).toBeVisible();
    await manager.goto(`http://127.0.0.1:3300/admin/members/${athlete.user.id}`);
    await manager.getByRole("button", { name: "تأیید تمدید", exact: true }).click();
    const end = new Date(membership.endDate);
    end.setUTCDate(end.getUTCDate() + 30);
    await manager.getByLabel("تاریخ پایان جدید").fill(end.toISOString().slice(0, 10));
    await manager.getByLabel("تعداد جلسات دوره جدید").fill("20");
    const approved = manager.waitForResponse((r) => r.url().endsWith("/renew") && r.request().method() === "POST");
    await manager.getByRole("button", { name: "ثبت تأیید مدیریت", exact: true }).click();
    expect((await approved).ok()).toBeTruthy();
    await page.reload();
    await expect(page.getByText("درخواست تمدید ثبت شده و منتظر تأیید مدیریت است")).not.toBeVisible();
    const saved = (await (await request.get(`${api}/memberships`, { headers: athlete.headers })).json()).data[0];
    expect(saved.sessionsTotal).toBe(20);
    expect(saved.renewalApprovedBy).toBeTruthy();
  } finally {
    await context.close();
  }
});
