'use client';

import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

export type FactProvenance =
  | 'measured'
  | 'estimated'
  | 'derived'
  | 'argued'
  | 'stated'
  | 'research';

export interface FactData {
  id: string;
  label: string;
  value: string;
  unit?: string;
  provenance: FactProvenance;
  source: string;
  note?: string;
  negative?: boolean;
}

const PROVENANCE_COPY: Record<FactProvenance, string> = {
  measured: 'Measured',
  estimated: 'Estimated',
  derived: 'Derived',
  argued: 'True by construction',
  stated: 'Stated, not independently verified',
  research: 'External research, not his result',
};

/**
 * A number with its receipt.
 *
 * Every figure on the site renders through this component, and the tag comes
 * from the résumé corpus rather than from whoever wrote the sentence. Hovering
 * or focusing shows how the number is known and where it came from, which is
 * the difference between a portfolio claim and a citable one. Values that
 * reflect badly (`negative`) are rendered the same way on purpose.
 */
export function Fact({ fact, className }: { fact: FactData; className?: string }) {
  const [open, setOpen] = useState(false);
  const receiptId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);

  return (
    <span
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setOpen(false); }}
    >
      <button
        type="button"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-describedby={open ? receiptId : undefined}
        aria-label={`${fact.label}: ${fact.value}. ${PROVENANCE_COPY[fact.provenance]}. Source: ${fact.source}`}
        className={cn(
          'font-mono tabular-nums underline decoration-dotted underline-offset-4 cursor-help',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-color',
          fact.negative ? 'decoration-muted-foreground' : 'decoration-accent-color/60'
        )}
      >
        {fact.value}
        {fact.unit ? <span className="ml-0.5">{fact.unit}</span> : null}
      </button>

      {open && (
        <span
          id={receiptId}
          role="tooltip"
          className="absolute left-0 top-full z-50 block w-72 rounded-lg border bg-background p-3 text-left text-xs shadow-lg max-lg:fixed max-lg:bottom-6 max-lg:left-6 max-lg:right-6 max-lg:top-auto max-lg:w-auto"
        >
          <span className="block font-medium text-foreground">{fact.label}</span>
          <span className="mt-1 block text-muted-foreground">
            {PROVENANCE_COPY[fact.provenance]} · {fact.source}
          </span>
          {fact.note && <span className="mt-2 block text-muted-foreground">{fact.note}</span>}
        </span>
      )}
    </span>
  );
}
