"use client";

import { useUrlState } from "@/hooks/use-url-state";

export interface PaginationView {
  page: number;
  pageSize: number;
  totalPages: number;
  /** Index of the first row on the current page. */
  from: number;
  /** Exclusive index of the last row on the current page. */
  to: number;
  setPage: (page: number) => void;
}

/**
 * Client-side pagination.
 *
 * The requested page is clamped on read instead of being corrected in an
 * effect, so filtering a list down to fewer pages shows the last valid page
 * immediately rather than one empty render followed by a state update.
 */
export function usePagination(total: number, pageSize = 10): PaginationView {
  const [pageParam, setRequested] = useUrlState<string>("page", "1");
  const requested = /^\d+$/.test(pageParam) && Number.isSafeInteger(Number(pageParam)) ? Number(pageParam) : 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requested), totalPages);
  const from = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    totalPages,
    from,
    to: Math.min(from + pageSize, total),
    setPage: next => setRequested(String(Math.max(1, Math.min(next, totalPages)))),
  };
}
