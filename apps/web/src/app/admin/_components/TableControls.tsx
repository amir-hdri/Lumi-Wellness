"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TableHead } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import type { SortState } from "./admin-data";

export interface SortableHeadProps<K extends string> {
  column: K;
  label: string;
  sort: SortState<K>;
  onSort: (column: K) => void;
  className?: string;
}

/** Column header that sorts on click and reports the state via `aria-sort`. */
export function SortableHead<K extends string>({
  column,
  label,
  sort,
  onSort,
  className,
}: SortableHeadProps<K>) {
  const activeSort = sort.key === column;
  const Icon = sort.dir === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead
      className={cn("p-0", className)}
      aria-sort={activeSort ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      scope="col"
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "ring-focus flex h-12 w-full items-center gap-1.5 px-4 text-start text-xs font-bold leading-5 transition-colors hover:text-foreground",
          activeSort ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
        <Icon aria-hidden className={cn("h-3.5 w-3.5 shrink-0", activeSort ? "opacity-100" : "opacity-0")} />
      </button>
    </TableHead>
  );
}

export interface SearchFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

export function SearchField({ value, onValueChange, placeholder, label, className }: SearchFieldProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className={className}
      startAdornment={<Search aria-hidden className="h-4 w-4" />}
    />
  );
}

export { Pagination as PaginationBar, type PaginationProps as PaginationBarProps } from "@/components/ui/Pagination";
