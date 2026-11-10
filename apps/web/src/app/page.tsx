"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { CtaButton } from "@/components/twilight/CtaButton";
import { GymBackdrop } from "@/components/twilight/GymBackdrop";
import { LumiWordmark } from "@/components/auth/AuthLayout";
import { CheckCircle2 } from "lucide-react";

function LandingNavigation() {
  return (
    <header className="sticky inset-x-0 top-0 z-30 px-4 py-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border bg-background/90 px-4 py-3 backdrop-blur-xl" aria-label="ناوبری صفحه اصلی">
        <a href="#top" className="ring-focus flex min-h-11 items-center" aria-label="Lumi Wellness">
          <LumiWordmark />
        </a>
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#experience" className="ring-focus inline-flex min-h-11 items-center transition-colors hover:text-foreground">تجربه تمرین</a>
          <a href="#schedule" className="ring-focus inline-flex min-h-11 items-center transition-colors hover:text-foreground">برنامه هفتگی</a>
          <a href="#coaches" className="ring-focus inline-flex min-h-11 items-center transition-colors hover:text-foreground">مربیان</a>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="ring-focus inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide text-foreground transition-colors hover:bg-secondary"
          >
            ورود
          </Link>
          <CtaButton asChild className="w-auto px-5"><Link href="/auth/register">عضویت</Link></CtaButton>
        </div>
      </nav>
    </header>
  );
}

function FeaturesSection() {
  const features = [
    { title: "برنامه تمرینی شخصی", desc: "تمرین‌های هر روز و هدف‌های قابل پیگیری، در یک برنامه روشن." },
    { title: "ارتباط با مربی", desc: "برنامه‌ات را با مربی مرور کن و بازخورد تمرین را همان‌جا دریافت کن." },
    { title: "مدیریت عضویت", desc: "وضعیت عضویت، حضور و پرداخت‌ها را ببین و درخواست تمدید ثبت کن." },
  ];

  return (
    <section id="experience" className="cv-below-fold scroll-mt-28 border-t border-border px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-2xl font-normal text-foreground sm:text-3xl">از برنامه تا پیشرفت</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {features.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeeklyExperienceSection() {
  const sessions = [
    { day: "شنبه", title: "قدرت پایین‌تنه", duration: "۴۵ دقیقه" },
    { day: "دوشنبه", title: "پیلاتس و تعادل", duration: "۳۵ دقیقه" },
    { day: "چهارشنبه", title: "هوازی", duration: "۴۰ دقیقه" },
  ];
  return (
    <section id="schedule" className="cv-below-fold scroll-mt-28 px-5 pb-16 sm:pb-24">
      <div className="mx-auto grid max-w-5xl gap-8 border-t border-border pt-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-medium text-muted-foreground">نمونهٔ برنامه هفتگی</p>
          <h2 className="mt-3 font-serif text-2xl font-normal text-foreground">هر روز، یک قدم مشخص</h2>
          <div className="mt-6 divide-y divide-border">
            {sessions.map((session) => (
              <div key={session.day} className="flex items-center gap-3 py-4 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">{session.day}</span>
                <span className="flex-1 font-medium text-foreground">{session.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{session.duration}</span>
              </div>
            ))}
          </div>
        </div>
        <div id="coaches" className="scroll-mt-28 lg:pt-7">
          <h2 className="font-serif text-2xl font-normal text-foreground">مربی همراه مسیر تو</h2>
          <p className="mt-4 max-w-md text-sm leading-8 text-muted-foreground">برنامهٔ واقعی تو را مربی بر اساس هدف و توانت تنظیم می‌کند. تمرین‌ها، پیام‌ها و پیشرفتت در حساب شخصی‌ات کنار هم قرار می‌گیرند.</p>
          <Link href="/auth/register" className="ring-focus mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">ساخت حساب ورزشکار</Link>
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-[68svh] items-center px-5 py-16 sm:py-20">
      <GymBackdrop className="absolute inset-0" />
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <h1 className="font-serif text-[2.25rem] font-medium leading-[1.5] tracking-tight text-logo-ink-inverse sm:text-5xl lg:text-6xl">
          <span className="block">حرکت، قدرت،</span>
          <span className="block text-blush-fixed">نسخه بهتر تو</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-logo-ink-inverse/85 sm:text-base">برنامه تمرینی شخصی، ارتباط با مربی و پیگیری پیشرفت؛ همه در <span dir="ltr" className="inline-block whitespace-nowrap">Lumi Wellness</span>.</p>
        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <CtaButton asChild className="sm:w-auto sm:min-w-40"><Link href="/auth/register">ثبت‌نام ورزشکار</Link></CtaButton>
          <CtaButton asChild variant="outline" className="border-logo-ink-inverse/30 bg-transparent text-logo-ink-inverse shadow-none hover:bg-logo-ink-inverse/10 sm:w-auto sm:min-w-40"><Link href="/auth/login">ورود اعضا</Link></CtaButton>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case "admin":
        case "receptionist":
          router.replace("/admin");
          break;
        case "coach":
          router.replace("/coach");
          break;
        case "athlete":
          router.replace("/athlete");
          break;
        default:
          router.replace("/auth/login");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isAuthenticated && user) {
    const panelHref = (user.role === "admin" || user.role === "receptionist") ? "/admin" : user.role === "coach" ? "/coach" : user.role === "athlete" ? "/athlete" : "/auth/login";
    const roleLabel = (user.role === "admin" || user.role === "receptionist") ? "پنل ادمین" : user.role === "coach" ? "پنل مربی" : "پنل ورزشکار";
    return (
      <main id="main" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
        <GymBackdrop className="absolute inset-0" />
        <div className="relative z-10 w-full max-w-md rounded-[32px] border border-border bg-popover p-8 text-center shadow-2xl shadow-scrim/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-secondary text-primary"><CheckCircle2 className="h-6 w-6" strokeWidth={1.75} /></div>
          <h1 className="mt-4 font-serif text-2xl font-medium text-foreground">خوش آمدی، {user.firstName || user.email}!</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">حساب شما فعال است. می‌توانی مستقیم به پنل بروی یا با حساب دیگری وارد شوی.</p>
          <div className="mt-6 flex flex-col gap-3">
            <CtaButton asChild className="text-sm"><Link href={panelHref}>ورود به {roleLabel}</Link></CtaButton>
            <CtaButton variant="ghost" onClick={() => { logout(); router.push("/auth/login"); }} className="text-sm">خروج و ورود با حساب دیگر</CtaButton>
            <Link href="/auth/login" className="text-xs text-muted-foreground hover:text-foreground">رفتن به صفحه ورود</Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">اگر این حساب شما نیست، گزینه خروج را بزن.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <LandingNavigation />
      <HeroSection />
      <FeaturesSection />
      <WeeklyExperienceSection />

      {/* Footer */}
      <footer className="relative border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <LumiWordmark />
              </div>
              <p className="mt-3 max-w-[28ch] text-sm leading-7 text-muted-foreground">
                پلتفرم مدیریت هوشمند باشگاه بانوان — برنامه تمرینی، حضور و پیشرفت در یک وب‌اپ سریع.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <a href="https://instagram.com/gymapp.ir" target="_blank" rel="noopener noreferrer" className="ring-focus inline-flex min-h-11 items-center hover:text-foreground">اینستاگرام</a>
                <a href="https://t.me/gymapp_ir" target="_blank" rel="noopener noreferrer" className="ring-focus inline-flex min-h-11 items-center hover:text-foreground">تلگرام</a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">محصول</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#experience" className="hover:text-foreground">تجربه تمرین</a></li>
                <li><a href="#schedule" className="hover:text-foreground">برنامه هفتگی</a></li>
                <li><a href="#coaches" className="hover:text-foreground">مربیان</a></li>
                <li><Link href="/auth/register" className="hover:text-foreground">عضویت</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">پشتیبانی</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">قوانین و حریم‌خصوصی</Link></li>
                <li><Link href="/auth/forgot-password" className="hover:text-foreground">بازیابی رمز</Link></li>
                <li><a href="mailto:support@gymapp.ir" dir="ltr" className="hover:text-foreground">support@gymapp.ir</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">دسترسی سریع</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/login" className="hover:text-foreground">ورود اعضا</Link></li>
                <li><span className="text-xs">وب‌اپ نصب‌پذیر</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© Lumi Wellness — تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
