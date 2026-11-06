"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  glass?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, glass: _glass, id, rows = 3, "aria-describedby": describedBy, "aria-invalid": invalid, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? `textarea-${generatedId}`;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(
            "flex min-h-[104px] w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-base leading-7 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors md:text-sm",
            error && "border-destructive focus-visible:border-destructive/60",
            className
          )}
          aria-invalid={error ? true : invalid}
          aria-describedby={[describedBy, error ? errorId : hint ? hintId : null].filter(Boolean).join(" ") || undefined}
          ref={ref}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {hint && !error && <p id={hintId} className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
