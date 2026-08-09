import { useState } from "react";
import { Check } from "lucide-react";
import type { ConceptMapPayload } from "@/lib/supabase";

export type SensoryRenderPrefs = {
  highContrast?: boolean;
  microSteps?: boolean;
  relaxedTypography?: boolean;
};

export function splitIntoMicroSteps(text: string): string[] {
  return text
    .split(/(?<=[.!?;])\s+|\n+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

export function MappingCard({
  mapping,
  index,
  highContrast = false,
  microSteps = false,
  relaxedTypography = false,
}: {
  mapping: ConceptMapPayload["mappings"][number];
  index: number;
} & SensoryRenderPrefs) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const steps = microSteps ? splitIntoMicroSteps(mapping.explanation) : [];

  const containerClass = highContrast
    ? "print-card rounded-2xl border-4 border-highlight bg-foreground p-6 shadow-sm"
    : "print-card rounded-2xl border border-border bg-card p-6 shadow-sm";
  const titleClass = highContrast ? "text-background" : "text-foreground";
  const bodyClass = highContrast ? "text-background" : "text-muted-foreground";
  const typographyClass = relaxedTypography ? "leading-loose tracking-wide" : "leading-relaxed";

  return (
    <div className={containerClass}>
      <span
        className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold ${
          highContrast
            ? "bg-highlight text-highlight-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {index + 1}
      </span>
      <h3 className={`mt-4 text-lg font-bold ${titleClass}`}>{mapping.concept_element}</h3>
      <p
        className={`mt-1 text-sm font-semibold ${
          highContrast ? "text-highlight" : "text-accent-foreground"
        }`}
      >
        ↳ {mapping.anchor_equivalent}
      </p>

      {microSteps && steps.length > 0 ? (
        <ul className={`mt-4 space-y-4 text-base ${typographyClass}`}>
          {steps.map((step, stepIndex) => {
            const done = Boolean(checked[stepIndex]);
            return (
              <li key={stepIndex}>
                <button
                  type="button"
                  aria-pressed={done}
                  onClick={() => setChecked((prev) => ({ ...prev, [stepIndex]: !prev[stepIndex] }))}
                  className={`flex w-full min-h-11 items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    highContrast
                      ? "border-highlight bg-transparent text-background"
                      : done
                        ? "border-primary bg-primary-soft text-foreground"
                        : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2 ${
                      done ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {done ? <Check className="size-4" /> : null}
                  </span>
                  <span className={done ? "line-through opacity-80" : undefined}>
                    <span className="mr-2 font-bold">Step {stepIndex + 1}.</span>
                    {step}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={`mt-3 space-y-4 text-base ${typographyClass} ${bodyClass}`}>
          {mapping.explanation}
        </p>
      )}
    </div>
  );
}
