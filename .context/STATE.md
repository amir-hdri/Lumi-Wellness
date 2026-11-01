<!--schema:2.0.0-->
<!--agent:opencode-->
<!--timestamp:2026-11-01T16:45:00+03:30-->

# 🎯 هدف جاری
توسعه و نگهداری سامانه مدیریت باشگاه و ورزشکاران (Lumi Gym App) — معماری یکپارچه Monorepo (وب Next.js 16 + بک‌اند FastAPI + بسته‌های اشتراکی Turbo)

## ✅ کارهای انجام‌شده
- یکپارچه‌سازی کدبیس‌های همگرا در ساختار منوریپو تحت برنچ `main`
- استقرار فریمورک هماهنگی چند-ایجنت (Multi-Agent Sync v2.0)
- ایجاد فایل‌های قرارداد `AGENTS.md`، `CLAUDE.md` و گیت‌هوک‌های محافظتی
- ممیزی و رفع شکاف‌های استقرار Vercel/Next.js (ادامهٔ سشن `ses_e6927e490ffetWL3X8TD5FLsTo`):
  - گارد بیلد دیپلوی: `apps/web/config/deploy-env.mjs` بیلدی را که `NEXT_PUBLIC_USE_MOCKS=true` دارد یا `NEXT_PUBLIC_API_URL` آن خالی/لوکال‌هاست رد می‌کند (`VERCEL` یا `NEXT_DOCKER_BUILD`)
  - هدرهای امنیتی و CSP در `next.config.mjs` (فقط در production) + `poweredByHeader: false` + `outputFileTracingRoot` صریح ریپو‌روت
  - سیاست کش برای `sw.js` (بدون کش) و آیکون/مانیفست (کش کوتاه با revalidate) بدون دست‌زدن به کش immutable خود Next برای `/_next/static`
  - `apps/web/vercel.json` (framework + buildCommand) و `.dockerignore` ریپو‌روت برای جلوگیری از ورود `.env.local` به build context
  - `apps/web/Dockerfile`: پارامترهای `NEXT_PUBLIC_*` به‌عنوان build-arg و فعال‌سازی گارد (`NEXT_DOCKER_BUILD=1`)
  - CORS بک‌اند: `CORS_ALLOW_ORIGIN_REGEX` برای originهای متغیر preview در Vercel
  - مستندات: بخش «Deployment» و جدول متغیرهای محیطی در `README.md`
- تست‌های جدید (TDD): `apps/web/src/test/deploy-env.test.ts` (۶ تست) و `backend/tests/test_cors.py` (۳ تست)

## 📁 فایل‌های تغییریافته
- `apps/web/next.config.mjs`
- `apps/web/config/deploy-env.mjs` (جدید)
- `apps/web/src/test/deploy-env.test.ts` (جدید)
- `apps/web/vercel.json` (جدید)
- `apps/web/eslint.config.js`
- `apps/web/Dockerfile`
- `.dockerignore` (جدید)
- `backend/app/config.py`
- `backend/app/main.py`
- `backend/tests/test_cors.py` (جدید)
- `README.md`
- `.context/STATE.md`
- `.context/SESSION_LOG.md`

## 🎯 تسک دقیق بعدی
اتصال ریپو به یک پروژهٔ Vercel و پیکربندی محیط: ساخت پروژه با Root Directory = `apps/web`، ست‌کردن `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_USE_MOCKS=false` برای Production و Preview، و ست‌کردن `CORS_ORIGINS` + `CORS_ALLOW_ORIGIN_REGEX` روی بک‌اند.
پیشنیاز: دیپلوی شدن بک‌اند روی یک دامنهٔ مشخص (تا origin واقعی معلوم شود)؛ بدون آن `regions` و allow-list دقیق CORS قابل تعیین نیست.

## 🧠 تصمیمات فنی و چرایی
- گارد بیلد به‌جای اصلاح دستی `.env.local`: `NEXT_PUBLIC_*` در زمان build داخل باندل inline می‌شود، پس یک بیلد با mock یا localhost بدون خطای بصری تولید می‌شد و فقط در production لو می‌رفت. حالا بیلد دیپلوی با پیام واضح fail می‌شود.
- `output: "standalone"` فقط برای Docker/خودمیزبانی: روی Vercel خروجی runtime را خود پلتفرم می‌سازد و این خروجی فقط زمان build را اضافه می‌کند (و در 16.3.0 باعث خطای adapter می‌شد).
- CSP فقط در production: dev server برای fast-refresh به `unsafe-eval` نیاز دارد. `connect-src` فقط origin واقعی API را می‌پذیرد (به‌جای `https:` باز) تا توکن نشست به دامنهٔ ثالث نشت نکند.
- `Permissions-Policy: camera=(self)`: دوربین در QR check-in استفاده می‌شود، پس بستن کامل آن امکان‌پذیر نبود.
- همهٔ هدرها فقط در `next.config.mjs` (تک‌منبع) تا رفتار Vercel و Docker یکسان بماند؛ `vercel.json` فقط پیکربندی بیلد را نگه می‌دارد.
- `buildCommand` در `vercel.json` برابر `cd ../.. && npm run build --workspace=apps/web` و Root Directory = `apps/web`: مطابق مستندات Vercel برای مونوریپو؛ از `turbo` استفاده نشد چون در این ریپو اسکریپت‌ها روی npm workspaces هستند و turbo به فیلد `packageManager` در `package.json` ریشه نیاز دارد که هنوز اضافه نشده است.
- CORS به‌جای لیست‌کردن originهای preview، از regex استفاده می‌کند چون هر پیش‌نمایش Vercel هاستنام جدید می‌گیرد.

## ⚠️ نکات حساس و موانع
- پروژه هنوز به Vercel لینک نشده است؛ سنجه‌های production در دسترس نیست و این تغییرات فقط code-level قابل‌راستی‌آزمایی بودند.
- `.dockerignore` به‌دلیل در حال اجرا نبودن Docker Desktop روی این ماشین تست نشد (الگوها مطابق مستندات Docker هستند).
- `regions` در `vercel.json` تنظیم نشد چون محل استقرار بک‌اند/دیتابیس مشخص نیست.
- ۱۵ مسیر dynamic همچنان `"use client"` + `useParams` هستند؛ تغییر rendering mode در این سشن انجام نشد (ریسک hydration mismatch) و follow-up است.
- ۱۳۹ از ۲۰۹ فایل فرانت `"use client"` هستند؛ مهاجرت گسترده به RSC خارج از scope این سشن است.
- `cacheComponents` فعال نشد (ریسک شکست build).
