import { expect, test } from "@playwright/test";

/**
 * Portal navigation consistency.
 *
 * The dock and the drawer used to be two hand-maintained tables per role that
 * had drifted: different labels for the same route, and routes reachable from
 * only one of them. These specs read the rendered app, because the drift was
 * never visible in either file alone.
 */

const PORTALS = [
  { root: "/athlete", role: "athlete" as const,
    dock: ["/athlete", "/athlete/programs", "/athlete/checkin", "/athlete/history", "/athlete/profile"],
    drawerOnly: ["/athlete/calendar", "/athlete/goals", "/athlete/membership", "/athlete/messages", "/athlete/notifications"],
    deep: "/athlete/programs/some-program-id" },
  { root: "/coach", role: "coach" as const,
    dock: ["/coach", "/coach/athletes", "/coach/programs", "/coach/messages", "/coach/profile"],
    drawerOnly: ["/coach/exercises", "/coach/templates"], deep: "/coach/programs/some-program-id" },
  { root: "/admin", role: "admin" as const,
    dock: ["/admin", "/admin/members", "/admin/payments", "/admin/notifications", "/admin/profile"],
    drawerOnly: ["/admin/coaches", "/admin/plans", "/admin/desk", "/admin/checkins", "/admin/settings"],
    deep: "/admin/members/some-member-id" },
];

/** Labels in the dock, taken from each link's accessible name. */
async function dockLabels(page: import("@playwright/test").Page) {
  return page.locator('nav[aria-label="ناوبری اصلی موبایل"] a').evaluateAll((nodes) =>
    nodes.map((node) => ({ href: node.getAttribute("href"), label: node.getAttribute("aria-label") ?? "" }))
  );
}

/**
 * Portal routes sit behind `RequireAuth`, so a session has to exist before the
 * shell renders — without this the page is the loading state and the dock is
 * empty, which reads as "no navigation" rather than "not signed in".
 *
 * Seeded the same way the real suite does it, so the specs read the same DOM
 * in both modes.
 */
async function signIn(
  page: import("@playwright/test").Page,
  role: "athlete" | "coach" | "admin"
) {
  await page.addInitScript(
    ([userRole, theme]) => {
      localStorage.setItem(
        "auth_tokens",
        JSON.stringify({
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          // AuthProvider only restores a stored session whose access token is
          // still valid — omit these and it clears the session as expired.
          accessTokenExpiry: new Date(Date.now() + 3_600_000).toISOString(),
          refreshTokenExpiry: new Date(Date.now() + 86_400_000).toISOString(),
        })
      );
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: `e2e-${userRole}`,
          email: `${userRole}@gymapp.ir`,
          firstName: "کاربر",
          lastName: "آزمون",
          role: userRole,
          status: "active",
          avatarUrl: "",
        })
      );
      localStorage.setItem("theme", theme);
    },
    [role, "dark"] as [string, string]
  );
}

for (const portal of PORTALS) {
  test(`${portal.root} dock holds its sections`, async ({ page }) => {
    await signIn(page, portal.role);
    await page.goto(portal.root);
    await expect(page.locator('nav[aria-label="ناوبری اصلی موبایل"] a')).toHaveCount(5);
    const dock = await dockLabels(page);
    expect(dock.map((link) => link.href)).toEqual(portal.dock);
    expect(dock.every((link) => link.label.trim())).toBe(true);
  });

  test(`${portal.root} drawer lists every section, including dock-only ones`, async ({ page }) => {
    await signIn(page, portal.role);
    await page.goto(portal.root);

    if ((page.viewportSize()?.width ?? 0) < 1024) await page.getByRole("button", { name: "باز کردن منو" }).click();
    const drawer = page.getByRole("complementary");
    await expect(drawer).toBeVisible();

    const labels = await drawer.getByRole("link").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href"))
    );

    for (const expected of [...portal.dock, ...portal.drawerOnly]) {
      expect(labels, `sidebar is missing "${expected}"`).toContain(expected);
    }
  });

  test(`${portal.root} marks exactly one current dock entry`, async ({ page }) => {
    await signIn(page, portal.role);
    await page.goto(portal.root);

    const current = page.locator('nav[aria-label="ناوبری اصلی موبایل"] a[aria-current="page"]');
    await expect(current).toHaveCount(1);
  });

  test(`${portal.root} keeps the parent section current on a detail route`, async ({ page }) => {
    // A detail page must keep its section highlighted — this is what the dock
    // lost when it was a separate hand-written table.
    await signIn(page, portal.role);
    await page.goto(portal.deep);

    const current = page.locator('nav[aria-label="ناوبری اصلی موبایل"] a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("href", new RegExp(`^${portal.deep.split("/").slice(0, 3).join("/")}`));
  });
}

test("no portal route is orphaned from both nav surfaces", async ({ page }) => {
  await signIn(page, "athlete");
  await page.goto("/athlete");
  await expect(page.locator('nav[aria-label="ناوبری اصلی موبایل"] a')).toHaveCount(5);
  if ((page.viewportSize()?.width ?? 0) < 1024) await page.getByRole("button", { name: "باز کردن منو" }).click();
  const sidebar = page.getByRole("complementary").getByRole("navigation");
  const links = await sidebar.getByRole("link").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  const dock = await dockLabels(page);
  const combined = new Set([...dock.map((link) => link.href), ...links]);
  expect(combined).toEqual(new Set([...PORTALS[0].dock, ...PORTALS[0].drawerOnly]));
});
