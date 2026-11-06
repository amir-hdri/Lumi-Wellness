"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Client data can supply a heading after navigation; keep the document name current. */
export function RouteTitle() {
  const pathname = usePathname();
  useEffect(() => {
    const sync = () => {
      const heading = document.querySelector("main h1");
      const name = heading?.textContent?.trim();
      if (name) {
        const title = `${name} | Lumi Wellness`;
        if (document.title !== title) document.title = title;
      }
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.getElementById("main") ?? document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
