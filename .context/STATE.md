<!--schema:2.0.0-->
<!--agent:opencode-->
<!--timestamp:2026-11-01T22:15:00+03:30-->

# 🎯 هدف جاری
توسعه و نگهداری سامانه مدیریت باشگاه و ورزشکاران (Lumi Wellness) — معماری یکپارچه Monorepo (وب Next.js 16 + بک‌اند FastAPI + بسته‌های اشتراکی Turbo). نام پروژه/ریپو در این سشن به **Lumi-Wellness** تغییر کرد (پوشهٔ محلی، ریپوی گیت‌هاب، نام packageها و نام loggerهای بک‌اند).

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
- بازطراحی و رفع باگ «نمودار کپسولی فعالیت» (`CapsuleChart`):
  - **رفع باگ پنجره (root cause):** پنجره روی «۷ روز اخیر تا امروز» قفل بود و دادهٔ mock (۲۷–۲۹ تیر ۱۴۰۴) بیرون آن می‌افتاد ⇒ هر ۷ کپسول «۰ دقیقه» درحالی‌که جدول ۳ جلسهٔ ۱:۴۵/۱:۳۰ نشان می‌داد. حالا پنجره **data-driven** است: ۷ روزِ دارای جلسهٔ تکمیل‌شده، جدیدترین آخر
  - ماژول pure جدید `capsule-chart-data.ts` (`buildCapsuleDays`, `capsulePercent`) با bucket روز محلی، duration از `durationMinutes` یا `checkIn/checkOut`، برچسب فارسی با `Intl fa-IR`، و `isToday`
  - ۱۸ تست جدید (۱۲ واحد + ۶ کامپوننت با RTL و fake timers) — همه سبز
  - کامپوننت بازنویسی‌شده: کپسول SVG (stroke گرد روی track `--muted`)، گرادیان blush با انیمیشن paint-only `stroke-dashoffset`، bead «امروز» فقط وقتی امروز جلسه دارد، readout با اعداد فارسی، empty state، `aria-label`/`aria-pressed`، focus دیدنی (`ring-focus`)، `aria-hidden` برای تزئینی‌ها
  - حذف رنگ `primary` از این سطح (همه‌جا `blush`) و حذف کارت/عنوان تکراری داخل کامپوننت (کارت را `TwilightCard` صفحه می‌دهد)؛ کپی زیرعنوان صفحه به «مدت ۷ روز فعالیت اخیر — هر کپسول یک روزِ دارای جلسه» تغییر کرد
  - الگوی کپسول در `docs/DESIGN_SYSTEM.md` §6 مستند شد
  - بررسی بصری با Playwright (light/hover/dark) انجام شد: ۳ کپسول، بدون خطای کنسول، `strokeDashoffset` = 0/18.2/0 ⇒ ۱۰۰٪/۸۶٪/۱۰۰٪
- تغییر نام پروژه به `Lumi-Wellness`:
  - ریپوی گیت‌هاب `amir-hdri/gym-app` → `amir-hdri/Lumi-Wellness` (لینک قدیمی redirect می‌شود) و `origin` به‌روزرسانی شد
  - نام packageها: `gym-app` → `lumi-wellness` و `@gym-app/web` → `@lumi-wellness/web`؛ `package-lock.json` با `npm install --package-lock-only --offline` بازتولید و جای entries مرتب شد
  - نام loggerهای بک‌اند: `gym-app` → `lumi-wellness` (`main.py`, `responses.py`, `routers/auth.py`)
  - رفرنس‌های متنی: `README.md`، `FINAL_REPORT.md`، `apps/web/public/apple-fitness-direction.html`، کامنت `app/coach/athletes/new/page.tsx`
  - fixture تست CORS به پیشوند `lumi-wellness` تغییر کرد و README الگوی transitional regex را توضیح می‌دهد

## 📁 فایل‌های تغییریافته
- `apps/web/src/components/twilight/CapsuleChart.tsx`
- `apps/web/src/components/twilight/capsule-chart-data.ts` (جدید)
- `apps/web/src/components/twilight/capsule-chart-data.test.ts` (جدید)
- `apps/web/src/components/twilight/CapsuleChart.test.tsx` (جدید)
- `apps/web/src/app/athlete/history/page.tsx`
- `apps/web/src/app/coach/athletes/new/page.tsx`
- `apps/web/public/apple-fitness-direction.html`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `backend/app/main.py`
- `backend/app/responses.py`
- `backend/app/routers/auth.py`
- `backend/tests/test_cors.py`
- `README.md`
- `FINAL_REPORT.md`
- `docs/DESIGN_SYSTEM.md`
- `.context/STATE.md`
- `.context/SESSION_LOG.md`

## 🎯 تسک دقیق بعدی
۱) نام پروژهٔ Vercel را به `lumi-wellness` تغییر دهید (داشبورد → Project → Settings → General) و روی بک‌اند `CORS_ALLOW_ORIGIN_REGEX=^https://(lumi-wellness|gym-app)-.*\.vercel\.app$` ست کنید تا هاستنام‌های preview قدیمی هم تا زمان مرگ بمانند.
۲) اتصال ریپو به پروژهٔ Vercel و پیکربندی محیط: Root Directory = `apps/web`، ست‌کردن `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_USE_MOCKS=false` برای Production و Preview، و ست‌کردن `CORS_ORIGINS` روی بک‌اند.
پیشنیاز: دیپلوی شدن بک‌اند روی یک دامنهٔ مشخص (تا origin واقعی معلوم شود)؛ بدون آن `regions` و allow-list دقیق CORS قابل تعیین نیست.

## 🧠 تصمیمات فنی و چرایی
- گارد بیلد به‌جای اصلاح دستی `.env.local`: `NEXT_PUBLIC_*` در زمان build داخل باندل inline می‌شود، پس یک بیلد با mock یا localhost بدون خطای بصری تولید می‌شد و فقط در production لو می‌رفت. حالا بیلد دیپلوی با پیام واضح fail می‌شود.
- `output: "standalone"` فقط برای Docker/خودمیزبانی: روی Vercel خروجی runtime را خود پلتفرم می‌سازد و این خروجی فقط زمان build را اضافه می‌کند (و در 16.3.0 باعث خطای adapter می‌شد).
- CSP فقط در production: dev server برای fast-refresh به `unsafe-eval` نیاز دارد. `connect-src` فقط origin واقعی API را می‌پذیرد (به‌جای `https:` باز) تا توکن نشست به دامنهٔ ثالث نشت نکند.
- `Permissions-Policy: camera=(self)`: دوربین در QR check-in استفاده می‌شود، پس بستن کامل آن امکان‌پذیر نبود.
- همهٔ هدرها فقط در `next.config.mjs` (تک‌منبع) تا رفتار Vercel و Docker یکسان بماند؛ `vercel.json` فقط پیکربندی بیلد را نگه می‌دارد.
- `buildCommand` در `vercel.json` برابر `cd ../.. && npm run build --workspace=apps/web` و Root Directory = `apps/web`: مطابق مستندات Vercel برای مونوریپو؛ از `turbo` استفاده نشد چون در این ریپو اسکریپت‌ها روی npm workspaces هستند و turbo به فیلد `packageManager` در `package.json` ریشه نیاز دارد که هنوز اضافه نشده است.
- CORS به‌جای لیست‌کردن originهای preview، از regex استفاده می‌کند چون هر پیش‌نمایش Vercel هاستنام جدید می‌گیرد.
- **پنجرهٔ چارت داده‌محور است، نه تقویمی:** «۷ روز اخیر» با دادهٔ sparse نتیجهٔ بی‌معنا (همهٔ صفر) می‌داد؛ «۷ روزِ دارای فعالیت» هم با انتظار کاربر (حجم فعالیت اخیر) سازگار است و هم با داده‌های واقعی. روزهای بدون جلسه حذف می‌شوند، نه صفر-پر.
- **انیمیشن با `stroke-dashoffset` و نه `height`:** `docs/DESIGN_SYSTEM.md` §4 انیمیشن `width/height` روی موارد تکرارشونده را ممنوع کرده (layout thrash). SVG با dashoffset فقط paint می‌شود و کپسول/سرِ گرد بی‌نقص می‌ماند؛ به همین دلیل گرادیان `userSpaceOnUse` است (bbox خطِ عرض‌صفر objectBoundingBox ندارد).
- **رنگ:** `primary` نقش «مبلمانِ رابط» دارد و `blush` نقش «دادهٔ خودِ ورزشکار»؛ نمودار فعالیت دادهٔ شخصی است ⇒ blush (توکن‌های `globals.css`)، و `primary` از این سطح حذف شد.
- **دامنه و ایمیل دست‌نخورده:** `gymapp.ir` / `@gymapp.ir` / `gymapp.db` زیرساخت‌اند (DNS، SPF/DKIM، آدرس‌های seedشده). تغییرشان یک مهاجرت زیرساختی جداگانه است و در rename پروژه نیامد.
- **نام package ≠ مسیر workspace:** اسکریپت‌ها (`--workspace=apps/web`) مسیر-محور هستند، پس rename نام packageها فقط metadata را عوض می‌کند و turbo/npm scripts را نمی‌شکند.

## ⚠️ نکات حساس و موانع
- پروژه هنوز به Vercel لینک نشده است؛ سنجه‌های production در دسترس نیست و این تغییرات فقط code-level قابل‌راستی‌آزمایی بودند. نام پروژهٔ Vercel همچنان باید دستی به `lumi-wellness` تغییر کند.
- rename ریپو در گیت‌هاب لینک‌های قدیمی را redirect می‌کند، ولی integration‌هایی که نام ریپو را ذخیره کرده‌اند (Vercel پروژهٔ موجود، Actionهای CI، تنظیمات Webhook) نام جدید را نمی‌گیرند و باید دستی به‌روزرسانی شوند.
- `.dockerignore` به‌دلیل در حال اجرا نبودن Docker Desktop روی این ماشین تست نشد (الگوها مطابق مستندات Docker هستند).
- `regions` در `vercel.json` تنظیم نشد چون محل استقرار بک‌اند/دیتابیس مشخص نیست.
- ۱۵ مسیر dynamic همچنان `"use client"` + `useParams` هستند؛ تغییر rendering mode در این سشن انجام نشد (ریسک hydration mismatch) و follow-up است.
- ۱۳۹ از ۲۰۹ فایل فرانت `"use client"` هستند؛ مهاجرت گسترده به RSC خارج از scope این سشن است.
- `cacheComponents` فعال نشد (ریسک شکست build).
- حذف فایل‌های `.serena/` در working tree مربوط به این سشن نیست و عمداً commit نشد.
