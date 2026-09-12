import { BookOpen } from 'lucide-react';

export function BuildAidReferenceBar() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-950">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-xs sm:text-sm">
        <BookOpen className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <span>
          <strong>BuildAid 2025/2026 referenced</strong>
          <span className="hidden sm:inline"> throughout Qilly&apos;s templates and pricing methodology</span>
          {' '}· Indicative estimates—confirm current supplier quotations.
        </span>
      </div>
    </div>
  );
}
