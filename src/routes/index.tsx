import { useRef, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Gamepad2,
  Trophy,
  ChefHat,
  TrainFront,
  Music,
  Clapperboard,
  ShieldCheck,
  Brain,
  ChevronLeft,
  ChevronRight,
  Download,
  Zap,
  Sprout,
  Contrast,
  Puzzle,
  MessageSquareHeart,
  Printer,
  Network,
  BookOpen,
  List,
  GitBranch,
  Activity,
  Layers,
  FileText,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar, type WorkspaceTab } from "@/components/app-sidebar";
import { MappingCard } from "@/components/mapping-card";

import { ErrorCard } from "@/components/error-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  supabase,
  isSupabaseConfigured,
  MISSING_CONFIG_MESSAGE,
  type ConceptMapPayload,
} from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hyper-Mapper | Concept Maps for Neurodivergent Learners" },
      {
        name: "description",
        content:
          "Turn K-12 academic concepts into personalized cognitive anchors like Minecraft Redstone, transit maps, or logic gates.",
      },
      { property: "og:title", content: "Hyper-Mapper | Concept Maps for Neurodivergent Learners" },
      {
        property: "og:description",
        content:
          "Turn K-12 academic concepts into personalized cognitive anchors like Minecraft Redstone, transit maps, or logic gates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function SkeletonLoader() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <span className="sr-only">Building your concept map. This can take a few moments.</span>
      <div className="h-6 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="space-y-3 rounded-xl border border-border p-4">
            <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function isCorrect(
  question: { correct_answer?: string; correct_index?: number },
  option: string,
  optionIndex: number,
) {
  if (typeof question.correct_index === "number") return question.correct_index === optionIndex;
  return question.correct_answer === option;
}

function BridgeCheckCard({
  bridge_check,
  bridgeAnswer,
  setBridgeAnswer,
}: {
  bridge_check: import("@/lib/supabase").BridgeCheck;
  bridgeAnswer: number | null;
  setBridgeAnswer: (index: number) => void;
}) {
  return (
    <section aria-labelledby="bridge-check" className="mt-10">
      <h2 id="bridge-check" className="font-display text-xl font-bold text-foreground">
        One more check
      </h2>
      <div className="mt-4 rounded-2xl border border-border border-l-4 border-l-primary bg-secondary/30 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-base font-semibold leading-relaxed text-foreground">
            One more check — no factory, no game, just the real thing
          </p>
        </div>
        <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">
          {bridge_check.question}
        </p>
        <div
          role="group"
          aria-label={bridge_check.question}
          className="mt-4 space-y-3"
        >
          {bridge_check.options.map((option, optionIndex) => {
            const correct = bridge_check.correct_index === optionIndex;
            const picked = bridgeAnswer === optionIndex;
            const revealed = bridgeAnswer !== null;
            const classes = !revealed
              ? "border-border bg-card hover:bg-secondary"
              : correct
                ? "border-success bg-success-soft"
                : picked
                  ? "border-destructive bg-destructive-soft"
                  : "border-border bg-card opacity-70";
            return (
              <button
                key={option}
                type="button"
                disabled={revealed}
                onClick={() => setBridgeAnswer(optionIndex)}
                aria-label={`Answer: ${option}`}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base leading-relaxed text-foreground transition-colors ${classes}`}
              >
                {revealed && correct ? (
                  <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
                ) : null}
                {revealed && picked && !correct ? (
                  <XCircle className="size-5 shrink-0 text-destructive" aria-hidden="true" />
                ) : null}
                <span>{option}</span>
                {revealed && correct ? (
                  <span className="ml-auto text-xs font-semibold uppercase text-success">Correct</span>
                ) : null}
                {revealed && picked && !correct ? (
                  <span className="ml-auto text-xs font-semibold uppercase text-destructive">Your answer</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const anchorSuggestions = [
  { icon: Gamepad2, label: "Video games", value: "Video game logic — " },
  { icon: Trophy, label: "A sport I play", value: "Sports rules — " },
  { icon: ChefHat, label: "Cooking", value: "Baking/Cooking steps — " },
  { icon: TrainFront, label: "Public transit", value: "City transit maps — " },
  { icon: Music, label: "Music", value: "Music production — " },
  { icon: Clapperboard, label: "A show I love", value: "TV/Movie plots — " },
];

const sensoryOptions = [
  { value: "Short Sentences", label: "⚡ Short Sentences", icon: Zap },
  { value: "Plain Language (No Jargon)", label: "🌱 Plain Language (No Jargon)", icon: Sprout },
  { value: "High Visual Contrast", label: "🎯 High Visual Contrast", icon: Contrast },
  { value: "Break into Micro-Steps", label: "🧩 Break into Micro-Steps", icon: Puzzle },
];

const formatOptions = [
  { value: "Concept Map", icon: Network },
  { value: "Story Mode", icon: BookOpen },
  { value: "Bullet Points", icon: List },
  { value: "Flowchart", icon: GitBranch },
];



function Index() {
  const [rawConcept, setRawConcept] = useState("");
  const [anchor, setAnchor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConceptMapPayload | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bridgeAnswer, setBridgeAnswer] = useState<number | null>(null);
  const [sensoryPrefs, setSensoryPrefs] = useState<string[]>([]);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackTesterId, setFeedbackTesterId] = useState("");
  const [feedbackClarity, setFeedbackClarity] = useState<number | null>(null);
  const [feedbackFriction, setFeedbackFriction] = useState<number | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<
    {
      id: string;
      tester_id: string;
      tester_email: string;
      clarity: number | null;
      friction: number | null;
      notes: string;
      at: string;
    }[]
  >([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [deck, setDeck] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("hypermapper_deck");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isPrintingProfile, setIsPrintingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("Dashboard");
  const [selectedFormat, setSelectedFormat] = useState("Concept Map");

  const anchorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onAfterPrint = () => setIsPrintingProfile(false);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  function exportTeacherPass() {
    setIsPrintingProfile(true);
    requestAnimationFrame(() => {
      window.print();
      setIsPrintingProfile(false);
    });
  }


  useEffect(() => {
    try {
      localStorage.setItem("hypermapper_deck", JSON.stringify(deck));
    } catch {
      /* storage unavailable or full — deck stays in memory only */
    }
  }, [deck]);

  useEffect(() => {
    setActiveCardIndex(0);
    setIsFocusMode(false);
  }, [result]);

  const questions = result?.comprehension_check ?? [];
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, question, index) => {
    const chosen = answers[index];
    if (chosen === undefined) return total;
    const optionIndex = question.options.indexOf(chosen);
    return total + (isCorrect(question, chosen, optionIndex) ? 1 : 0);
  }, 0);
  const quizComplete = questions.length > 0 && answeredCount === questions.length;

  function applyAnchorSuggestion(value: string) {
    setAnchor(value);
    setTimeout(() => {
      const input = anchorInputRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(value.length, value.length);
    }, 0);
  }

  function toggleSensoryPref(value: string) {
    setSensoryPrefs((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  async function submitSessionFeedback() {
    setFeedbackError(null);
    if (!feedbackTesterId.trim() || !feedbackEmail.trim()) {
      setFeedbackError("Please add your tester ID and email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackEmail.trim())) {
      setFeedbackError("Please enter a valid email address.");
      return;
    }

    setFeedbackSaving(true);
    const { data, error: insertError } = await supabase
      .from("tester_feedback")
      .insert({
        session_id: sessionId,
        tester_type: feedbackTesterId.trim(),
        tester_id: feedbackTesterId.trim(),
        tester_email: feedbackEmail.trim(),
        clarity_rating: feedbackClarity,
        cognitive_friction_reduction_rating: feedbackFriction,
        qualitative_notes: feedbackNotes.trim() || null,
      })
      .select("id, created_at")
      .maybeSingle();
    setFeedbackSaving(false);

    if (insertError) {
      setFeedbackError(insertError.message);
      return;
    }

    setSessionFeedback((prev) => [
      {
        id: (data?.id as string) ?? crypto.randomUUID(),
        tester_id: feedbackTesterId.trim(),
        tester_email: feedbackEmail.trim(),
        clarity: feedbackClarity,
        friction: feedbackFriction,
        notes: feedbackNotes.trim(),
        at: (data?.created_at as string) ?? new Date().toISOString(),
      },
      ...prev,
    ]);
    setFeedbackNotes("");
    setFeedbackClarity(null);
    setFeedbackFriction(null);
  }

  async function generate() {
    setError(null);
    setResult(null);
    setSessionId(null);
    setAnswers({});
    setBridgeAnswer(null);
    setSessionFeedback([]);
    setFeedbackError(null);

    if (!isSupabaseConfigured) {
      setError(MISSING_CONFIG_MESSAGE);
      return;
    }
    if (!rawConcept.trim() || !anchor.trim()) {
      setError("Please enter both an academic concept and your preferred cognitive anchor.");
      return;
    }

    setLoading(true);
    const raw_concept = rawConcept.trim();
    const cognitive_anchor = anchor.trim();
    const conceptText =
      raw_concept +
      ` [Format as: ${selectedFormat}]` +
      (sensoryPrefs.length ? ` [Formatting constraints: ${sensoryPrefs.join(", ")}]` : "");


    const { data, error: fnError } = await supabase.functions.invoke("map-concept", {
      body: { raw_concept: conceptText, cognitive_anchor },
    });

    if (fnError) {
      setLoading(false);
      setError(fnError.message);
      return;
    }
    if (!data || data.error || !data.data) {
      setLoading(false);
      setError(
        (typeof data?.error === "string" && data.error) ||
          data?.message ||
          "The concept mapping service returned an unexpected response.",
      );
      return;
    }

    const payload = data.data as ConceptMapPayload;
    setResult(payload);
    setDeck((prev) =>
      [
        {
          ...payload,
          _id: crypto.randomUUID(),
          _raw_concept: raw_concept,
          _cognitive_anchor: cognitive_anchor,
          _saved_at: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 15),
    );
    setLoading(false);

    const { data: inserted, error: insertError } = await supabase
      .from("mapping_sessions")
      .insert({ raw_concept, cognitive_anchor, structured_output: payload })
      .select("id")
      .maybeSingle();

    if (insertError) {
      setError(`Your map was generated, but saving the session failed: ${insertError.message}`);
      return;
    }
    if (inserted?.id) setSessionId(inserted.id as string);
  }

  async function selectAnswer(questionIndex: number, option: string) {
    if (answers[questionIndex] !== undefined) return;
    const next = { ...answers, [questionIndex]: option };
    setAnswers(next);

    if (Object.keys(next).length !== questions.length || !sessionId) return;

    const finalScore = questions.reduce((total, question, index) => {
      const chosen = next[index];
      if (chosen === undefined) return total;
      return total + (isCorrect(question, chosen, question.options.indexOf(chosen)) ? 1 : 0);
    }, 0);

    await supabase
      .from("mapping_sessions")
      .update({ comprehension_score: finalScore })
      .eq("id", sessionId);
  }

  return (
    <SidebarProvider>
      <div
        className={`flex min-h-dvh w-full bg-background ${isPrintingProfile ? "printing-profile" : ""}`}
      >
        <AppSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <SidebarInset className="bg-background">
        <SiteHeader withSidebarTrigger onOpenFeedback={() => setFeedbackOpen(true)} />
        <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <h1 className="sr-only">Hyper-Mapper concept mapping dashboard</h1>

        {activeTab === "Dashboard" ? (
          <div key="dashboard" className="animate-fade-in mx-auto w-full max-w-3xl space-y-8">
        <section className="no-print overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-soft via-secondary to-highlight-soft p-8 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/70 px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            <Activity className="size-3.5" aria-hidden="true" />
            Cognitive Sync: Active
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hyper-Mapper Core
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Translate any academic concept into the system your brain already knows by heart.
          </p>
        </section>

        <div className="no-print space-y-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/40 px-8 py-6 text-center text-sm font-medium text-secondary-foreground sm:flex-row">
            <Brain className="size-4 shrink-0" aria-hidden="true" />
            <span>Designed for how your brain works — zero medical labels, zero diagnostic profiling required.</span>
          </div>
          <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-accent-foreground">Layout Spec:</span> Enforces 32px
            Cognitive Padding to prevent visual crowding and sensory overload.
          </p>
        </div>

        <section
          aria-labelledby="step-one"
          className="no-print w-full rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <h2 id="step-one" className="font-display text-2xl font-bold text-foreground">
            Build your concept map
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tell us what you are learning and the system you already understand deeply.
          </p>


          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <p className="text-base font-semibold text-foreground">Output format</p>
              <div role="group" aria-label="Output format" className="flex flex-wrap gap-2">
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = selectedFormat === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedFormat(option.value)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{option.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">

              <Label htmlFor="concept" className="text-base font-semibold">
                Academic Concept to Learn
              </Label>
              <Textarea
                id="concept"
                rows={3}
                value={rawConcept}
                onChange={(event) => setRawConcept(event.target.value)}
                placeholder="e.g., Photosynthesis, Electromagnetism, Cell Division..."
                className="text-base leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="anchor" className="text-base font-semibold">
                Your Preferred Cognitive Anchor
              </Label>
              <Input
                id="anchor"
                ref={anchorInputRef}
                value={anchor}
                onChange={(event) => setAnchor(event.target.value)}
                placeholder="e.g., Computer Logic Gates, City Transit Maps, Minecraft Redstone, Music Theory..."
                className="min-h-12 text-base"
              />
              <div
                role="list"
                aria-label="Anchor suggestions"
                className="flex flex-wrap gap-2"
              >
                {anchorSuggestions.map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={suggestion.value}
                      type="button"
                      role="listitem"
                      onClick={() => applyAnchorSuggestion(suggestion.value)}
                      aria-label={`Use anchor: ${suggestion.value}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{suggestion.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Accordion type="single" collapsible className="rounded-xl border border-border">
              <AccordionItem value="sensory" className="border-b-0">
                <AccordionTrigger className="min-h-11 px-4 text-left text-base font-semibold">
                  Sensory &amp; Formatting Options (Optional)
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div role="group" aria-label="Sensory and formatting preferences" className="flex flex-wrap gap-2 pb-2">
                    {sensoryOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = sensoryPrefs.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleSensoryPref(option.value)}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
                          }`}
                        >
                          <Icon className="size-4 shrink-0" aria-hidden="true" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button
              type="button"
              onClick={generate}
              disabled={loading}
              className="min-h-13 w-full py-3 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Generating your map...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" aria-hidden="true" />
                  Generate Concept Map
                </>
              )}
            </Button>
          </div>
        </section>

        {error ? (
          <div className="mx-auto mt-8 w-full max-w-[700px]">
            <ErrorCard message={error} onRetry={generate} />
          </div>
        ) : null}

        {loading ? <SkeletonLoader /> : null}

        {result ? (
          <>
            <section aria-labelledby="summary" className="mt-10">
              <h2 id="summary" className="font-display text-2xl font-bold text-foreground">
                Your concept map
              </h2>
              <div className="print-card mt-4 rounded-2xl border-2 border-highlight/50 bg-highlight-soft p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-1 size-5 shrink-0 text-highlight" aria-hidden="true" />
                  <p className="text-base leading-relaxed text-foreground">
                    {result.concept_summary}
                  </p>
                </div>
              </div>
            </section>

            <section aria-labelledby="mappings" className="mt-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 id="mappings" className="font-display text-xl font-bold text-foreground">
                  Analogy mapping steps
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                    className="no-print min-h-11 px-4 text-sm font-semibold"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download as Study Sheet
                  </Button>
                  <div className="no-print flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
                    <Switch
                      id="focus-mode"
                      checked={isFocusMode}
                      onCheckedChange={setIsFocusMode}
                    />
                    <Label htmlFor="focus-mode" className="cursor-pointer text-sm font-medium">
                      Focus Mode (One step at a time)
                    </Label>
                  </div>
                </div>
              </div>

              {isFocusMode && result.mappings[activeCardIndex] ? (
                <div className="mt-4">
                  <MappingCard mapping={result.mappings[activeCardIndex]!} index={activeCardIndex} />
                  <div className="no-print mt-5 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveCardIndex((i) => Math.max(0, i - 1))}
                      disabled={activeCardIndex === 0}
                      className="min-h-11 px-4 text-sm font-semibold"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                      Previous Step
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {activeCardIndex + 1} of {result.mappings.length}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveCardIndex((i) => Math.min(result.mappings.length - 1, i + 1))}
                      disabled={activeCardIndex === result.mappings.length - 1}
                      className="min-h-11 px-4 text-sm font-semibold"
                    >
                      Next Step
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="mt-4 grid gap-5 md:grid-cols-2">
                  {result.mappings?.map((mapping, index) => (
                    <li
                      key={`${mapping.concept_element}-${index}`}
                      className="print-card rounded-2xl border border-border bg-card p-6 shadow-sm"
                    >
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-foreground">
                        {mapping.concept_element}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-accent-foreground">
                        ↳ {mapping.anchor_equivalent}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {mapping.explanation}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {questions.length > 0 ? (
              <section aria-labelledby="quiz" className="mt-10">
                <h2 id="quiz" className="font-display text-xl font-bold text-foreground">
                  Quick comprehension check
                </h2>
                <ol className="mt-4 space-y-6">
                  {questions.map((question, questionIndex) => {
                    const chosen = answers[questionIndex];
                    return (
                      <li
                        key={`${question.question}-${questionIndex}`}
                        className="print-card rounded-2xl border border-border bg-card p-6 shadow-sm"
                      >
                        <p className="text-base font-semibold leading-relaxed text-foreground">
                          {questionIndex + 1}. {question.question}
                        </p>
                        <div
                          role="group"
                          aria-label={question.question}
                          className="mt-4 space-y-3"
                        >
                          {question.options?.map((option, optionIndex) => {
                            const correct = isCorrect(question, option, optionIndex);
                            const picked = chosen === option;
                            const revealed = chosen !== undefined;
                            const classes = !revealed
                              ? "border-border bg-card hover:bg-secondary"
                              : correct
                                ? "border-success bg-success-soft"
                                : picked
                                  ? "border-destructive bg-destructive-soft"
                                  : "border-border bg-card opacity-70";
                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={revealed}
                                onClick={() => selectAnswer(questionIndex, option)}
                                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base leading-relaxed text-foreground transition-colors ${classes}`}
                              >
                                {revealed && correct ? (
                                  <CheckCircle2
                                    className="size-5 shrink-0 text-success"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                {revealed && picked && !correct ? (
                                  <XCircle
                                    className="size-5 shrink-0 text-destructive"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <span>{option}</span>
                                {revealed && correct ? (
                                  <span className="ml-auto text-xs font-semibold uppercase text-success">
                                    Correct
                                  </span>
                                ) : null}
                                {revealed && picked && !correct ? (
                                  <span className="ml-auto text-xs font-semibold uppercase text-destructive">
                                    Your answer
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                        {chosen !== undefined && question.explanation ? (
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {question.explanation}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>

                <p
                  aria-live="polite"
                  className="mt-6 rounded-2xl border border-border bg-card p-6 text-lg font-bold text-foreground shadow-sm"
                >
                  {quizComplete
                    ? `${score}/${questions.length} Correct!`
                    : `Answered ${answeredCount} of ${questions.length}`}
                </p>
              </section>
            ) : null}

            {result?.bridge_check ? (
              <BridgeCheckCard
                bridge_check={result.bridge_check}
                bridgeAnswer={bridgeAnswer}
                setBridgeAnswer={setBridgeAnswer}
              />
            ) : null}
          </>
        ) : null}
          </div>
        ) : null}

        {activeTab === "My Learning DNA" ? (
          <div key="dna" className="no-profile-print animate-fade-in space-y-8">
            <header>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                My Learning DNA
              </h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Your cognitive profile — no diagnosis, no labels. Share it with a teacher in one page.
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-card p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  Cognitive anchor
                </p>
                <p className="mt-3 font-display text-2xl font-bold leading-snug text-foreground">
                  {anchor || "Not chosen yet"}
                </p>
              </article>
              <article className="rounded-3xl border border-border bg-gradient-to-br from-highlight-soft to-card p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  Sensory &amp; formatting options
                </p>
                {sensoryPrefs.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sensoryPrefs.map((pref) => (
                      <li
                        key={pref}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground"
                      >
                        {pref}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 font-display text-2xl font-bold text-foreground">
                    None selected
                  </p>
                )}
              </article>
            </div>

            <section
              aria-labelledby="pattern-intelligence"
              className="rounded-3xl border border-border bg-card p-8 shadow-sm"
            >
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                <Activity className="size-3.5" aria-hidden="true" />
                Local pattern intelligence
              </p>
              <h3
                id="pattern-intelligence"
                className="mt-4 font-display text-2xl font-bold text-foreground"
              >
                Autonomous Behavioral Adaptation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Derived locally from your usage patterns. Nothing leaves this device.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft to-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    Maps generated
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold text-foreground">
                    {deckStats.total}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-gradient-to-br from-highlight-soft to-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    Top anchor category
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold leading-snug text-foreground">
                    {deckStats.topCategory}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary to-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    Distinct anchors used
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold text-foreground">
                    {deckStats.distinctAnchors}
                  </p>
                </div>
              </div>
            </section>

            <Button
              type="button"
              onClick={exportTeacherPass}
              className="min-h-13 px-6 text-base font-semibold"
            >
              <Printer className="size-5" aria-hidden="true" />
              Export Teacher Pass
            </Button>
          </div>
        ) : null}

        {activeTab === "History" ? (
          <div key="history" className="no-profile-print animate-fade-in space-y-8">
            <header>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                History
              </h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                <Layers className="mr-2 inline size-4" aria-hidden="true" />
                Your last 15 maps, saved on this device only.
              </p>
            </header>

            {deck.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-8 text-base leading-relaxed text-muted-foreground shadow-sm">
                Nothing saved yet. Generate a concept map and it will appear here.
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {deck.map((saved) => (
                  <AccordionItem
                    key={saved._id}
                    value={saved._id}
                    className="rounded-2xl border border-border bg-card px-6 shadow-sm"
                  >
                    <AccordionTrigger
                      aria-label={`Saved map: ${saved._raw_concept || "concept map"}`}
                      className="min-h-13 text-left text-lg font-bold"
                    >
                      {saved._raw_concept || "Saved concept map"}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      {saved._cognitive_anchor ? (
                        <p className="text-sm font-semibold text-accent-foreground">
                          Anchor: {saved._cognitive_anchor}
                        </p>
                      ) : null}
                      {saved.concept_summary ? (
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                          {saved.concept_summary}
                        </p>
                      ) : null}
                      {Array.isArray(saved.mappings) && saved.mappings.length > 0 ? (
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
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
          </div>
        ) : null}

        {activeTab === "Research & Impact" ? (
          <div key="research" className="no-profile-print animate-fade-in space-y-8">
            <header>
              <p className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                <FileText className="size-3.5" aria-hidden="true" />
                Research &amp; Impact
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground">
                The crisis behind school distress
              </h2>
            </header>

            <div className="grid gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft to-card p-8 shadow-sm">
                <p className="font-display text-6xl font-bold tracking-tight text-foreground">
                  92.1%
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  of students experiencing severe school distress are neurodivergent.
                </p>
              </article>
              <article className="rounded-3xl border border-border bg-gradient-to-br from-highlight-soft to-card p-8 shadow-sm">
                <p className="font-display text-6xl font-bold tracking-tight text-foreground">
                  83.4%
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  of those students are autistic.
                </p>
              </article>
            </div>

            <blockquote className="rounded-3xl border-l-4 border-l-primary border border-border bg-card p-8 text-lg leading-relaxed text-foreground shadow-sm">
              Standard curricula assume a linear, executive-function-heavy path to understanding.
              For many learners that path never opens. Hyper-Mapper bridges the gap by routing new
              concepts through a system the learner already masters.
              <footer className="mt-4 text-sm font-semibold text-muted-foreground">
                — Connolly &amp; Mullally, 2023
              </footer>
            </blockquote>
          </div>
        ) : null}



        <div id="teacher-pass" className="hidden">
          <h2 className="font-display text-2xl font-bold">Teacher Pass — My Learning DNA</h2>
          <p className="mt-4 text-base">
            <strong>Cognitive anchor:</strong> {anchor || "Not chosen yet"}
          </p>
          <p className="mt-2 text-base">
            <strong>Sensory &amp; formatting options:</strong>{" "}
            {sensoryPrefs.length > 0 ? sensoryPrefs.join(", ") : "None selected"}
          </p>
        </div>
        </main>
        </SidebarInset>
      </div>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              <MessageSquareHeart className="mr-2 inline size-5 text-primary" aria-hidden="true" />
              Feedback on this conversation
            </DialogTitle>
            <DialogDescription>
              Your ratings help us reduce cognitive friction for the next learner.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fb-id" className="text-base font-semibold">
                Tester ID
              </Label>
              <Input
                id="fb-id"
                value={feedbackTesterId}
                onChange={(event) => setFeedbackTesterId(event.target.value)}
                placeholder="e.g., NNEA-014"
                className="min-h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fb-email" className="text-base font-semibold">
                Email address
              </Label>
              <Input
                id="fb-email"
                type="email"
                value={feedbackEmail}
                onChange={(event) => setFeedbackEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-h-12 text-base"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { label: "Clarity (1-5)", value: feedbackClarity, set: setFeedbackClarity, name: "clarity" },
              { label: "Friction reduced (1-5)", value: feedbackFriction, set: setFeedbackFriction, name: "friction" },
            ].map((group) => (
              <div key={group.name} className="space-y-2">
                <p className="text-base font-semibold text-foreground">{group.label}</p>
                <div role="group" aria-label={group.label} className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-pressed={group.value === rating}
                      onClick={() => group.set(rating)}
                      className={`inline-flex size-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                        group.value === rating
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-secondary"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fb-notes" className="text-base font-semibold">
              Notes (optional)
            </Label>
            <Textarea
              id="fb-notes"
              rows={3}
              value={feedbackNotes}
              onChange={(event) => setFeedbackNotes(event.target.value)}
              placeholder="What worked, what felt confusing?"
              className="text-base leading-relaxed"
            />
          </div>

          {feedbackError ? (
            <p
              role="alert"
              className="rounded-xl border-2 border-destructive bg-destructive-soft px-4 py-3 text-sm font-medium text-foreground"
            >
              {feedbackError}
            </p>
          ) : null}

          <Button
            type="button"
            onClick={submitSessionFeedback}
            disabled={feedbackSaving}
            className="min-h-12 w-full text-base font-semibold"
          >
            {feedbackSaving ? "Saving feedback..." : "Submit feedback"}
          </Button>

          {sessionFeedback.length > 0 ? (
            <ul aria-live="polite" className="space-y-4">
              {sessionFeedback.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-base font-bold text-foreground">{entry.tester_id}</p>
                  <p className="text-sm text-muted-foreground">{entry.tester_email}</p>
                  <p className="mt-2 text-sm font-semibold text-accent-foreground">
                    Clarity: {entry.clarity ?? "—"}/5 · Friction reduced: {entry.friction ?? "—"}/5
                  </p>
                  {entry.notes ? (
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{entry.notes}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(entry.at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

