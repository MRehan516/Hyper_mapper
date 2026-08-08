import type { ConceptMapPayload } from "@/lib/supabase";

export function MappingCard({
  mapping,
  index,
}: {
  mapping: ConceptMapPayload["mappings"][number];
  index: number;
}) {
  return (
    <div className="print-card rounded-2xl border border-border bg-card p-6 shadow-sm">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {index + 1}
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">{mapping.concept_element}</h3>
      <p className="mt-1 text-sm font-semibold text-accent-foreground">
        ↳ {mapping.anchor_equivalent}
      </p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{mapping.explanation}</p>
    </div>
  );
}
