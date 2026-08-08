import { AlertTriangle, Dna, Layers, Printer } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MappingCard } from "@/components/mapping-card";

export function AppSidebar({
  deck,
  cognitiveAnchor,
  sensoryPrefs,
  onExportTeacherPass,
}: {
  deck: any[];
  cognitiveAnchor: string;
  sensoryPrefs: string[];
  onExportTeacherPass: () => void;
}) {
  return (
    <Sidebar className="no-print no-profile-print">
      <SidebarContent className="gap-2">
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 text-sm font-semibold">
            <AlertTriangle className="size-4" aria-hidden="true" />
            The Crisis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
              Research (Connolly &amp; Mullally, 2023) shows 92.1% of students experiencing severe
              school distress are neurodivergent (83.4% autistic). Standard curricula trigger
              executive dysfunction. Hyper-Mapper bridges this gap.
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 text-sm font-semibold">
            <Dna className="size-4" aria-hidden="true" />
            My Learning DNA
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed shadow-sm">
              <p className="font-semibold text-foreground">Cognitive anchor</p>
              <p className="text-muted-foreground">{cognitiveAnchor || "Not chosen yet"}</p>
              <p className="mt-3 font-semibold text-foreground">Sensory &amp; formatting</p>
              <p className="text-muted-foreground">
                {sensoryPrefs.length > 0 ? sensoryPrefs.join(", ") : "None selected"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onExportTeacherPass}
              className="min-h-11 w-full text-sm font-semibold"
            >
              <Printer className="size-4" aria-hidden="true" />
              Export Teacher Pass
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="gap-2 text-sm font-semibold">
            <Layers className="size-4" aria-hidden="true" />
            Saved Maps
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {deck.length === 0 ? (
              <p className="px-1 text-sm leading-relaxed text-muted-foreground">
                Maps you generate are saved here on this device only.
              </p>
            ) : (
              <Accordion type="single" collapsible>
                {deck.map((saved) => (
                  <AccordionItem key={saved._id} value={saved._id}>
                    <AccordionTrigger
                      aria-label={`Saved map: ${saved._raw_concept || "concept map"}`}
                      className="min-h-11 text-left text-sm font-semibold"
                    >
                      {saved._raw_concept || "Saved concept map"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {saved._cognitive_anchor ? (
                        <p className="text-sm font-semibold text-accent-foreground">
                          Anchor: {saved._cognitive_anchor}
                        </p>
                      ) : null}
                      {saved.concept_summary ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {saved.concept_summary}
                        </p>
                      ) : null}
                      {Array.isArray(saved.mappings) && saved.mappings.length > 0 ? (
                        <div className="mt-4 grid gap-4">
                          {saved.mappings.map((mapping: any, index: number) => (
                            <MappingCard key={index} mapping={mapping} index={index} />
                          ))}
                        </div>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
