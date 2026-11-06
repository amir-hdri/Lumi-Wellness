"use client";

import { useSyncExternalStore } from "react";

const changeEvent = "lumi:url-state";
function subscribe(notify: () => void) {
  window.addEventListener("popstate", notify);
  window.addEventListener(changeEvent, notify);
  return () => { window.removeEventListener("popstate", notify); window.removeEventListener(changeEvent, notify); };
}
const snapshot = () => window.location.search;
const serverSnapshot = () => "";

/** URL-backed filters, tabs and pagination without a new runtime dependency. */
export function useUrlState<T extends string>(key: string, fallback: T, allowed?: readonly T[]): [T, (next: T) => void] {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const candidate = new URLSearchParams(search).get(key);
  const value = candidate !== null && (!allowed || allowed.includes(candidate as T)) ? candidate as T : fallback;
  const setValue = (next: T) => {
    if (allowed && !allowed.includes(next)) return;
    const url = new URL(window.location.href);
    if (next === fallback) url.searchParams.delete(key); else url.searchParams.set(key, next);
    if (key !== "page") url.searchParams.delete("page");
    const href = `${url.pathname}${url.search}${url.hash}`;
    if (href === `${location.pathname}${location.search}${location.hash}`) return;
    if (key === "q") window.history.replaceState(window.history.state, "", href);
    else window.history.pushState(window.history.state, "", href);
    window.dispatchEvent(new Event(changeEvent));
  };
  return [value, setValue];
}
