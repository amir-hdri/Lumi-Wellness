import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { formatPersianNumber } from "@/lib/utils";
import type { PaginationView } from "@/hooks/use-pagination";

export interface PaginationProps { view: PaginationView; total: number; unit: string; }
export function Pagination({ view, total, unit }: PaginationProps) {
  if (total === 0) return null;
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
    <p className="text-xs leading-6 text-muted-foreground" aria-live="polite">نمایش {formatPersianNumber(view.from + 1)}–{formatPersianNumber(view.to)} از {formatPersianNumber(total)} {unit}</p>
    <nav aria-label="صفحه‌بندی" className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="صفحه قبل" disabled={view.page <= 1} onClick={() => view.setPage(view.page - 1)}><ChevronRight aria-hidden className="h-4 w-4" /></Button>
      <span className="px-2 text-xs tabular-nums text-muted-foreground">{formatPersianNumber(view.page)} از {formatPersianNumber(view.totalPages)}</span>
      <Button variant="outline" size="icon" aria-label="صفحه بعد" disabled={view.page >= view.totalPages} onClick={() => view.setPage(view.page + 1)}><ChevronLeft aria-hidden className="h-4 w-4" /></Button>
    </nav>
  </div>;
}
