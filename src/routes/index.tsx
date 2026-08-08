import { useRef, useState } from "react";
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
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ErrorCard } from "@/components/error-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

function Index() {
  const [rawConcept, setRawConcept] = useState("");
  const [anchor, setAnchor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConceptMapPayload | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bridgeAnswer, setBridgeAnswer] = useState<number | null>(null);
  const anchorInputRef = useRef<HTMLInputElement>(null);

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

  async function generate() {
    setError(null);
    setResult(null);
    setSessionId(null);
    setAnswers({});
    setBridgeAnswer(null);

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

    const { data, error: fnError } = await supabase.functions.invoke("map-concept", {
      body: { raw_concept, cognitive_anchor },
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
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="sr-only">Hyper-Mapper concept mapping dashboard</h1>

        <section
          aria-labelledby="step-one"
          className="mx-auto w-full max-w-[700px] rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <h2 id="step-one" className="font-display text-2xl font-bold text-foreground">
            Build your concept map
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tell us what you are learning and the system you already understand deeply.
          </p>

          <div className="mt-6 space-y-6">
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
              <div className="mt-4 rounded-2xl border-2 border-highlight/50 bg-highlight-soft p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-1 size-5 shrink-0 text-highlight" aria-hidden="true" />
                  <p className="text-base leading-relaxed text-foreground">
                    {result.concept_summary}
                  </p>
                </div>
              </div>
            </section>

            <section aria-labelledby="mappings" className="mt-10">
              <h2 id="mappings" className="font-display text-xl font-bold text-foreground">
                Analogy mapping steps
              </h2>
              <ul className="mt-4 grid gap-5 md:grid-cols-2">
                {result.mappings?.map((mapping, index) => (
                  <li
                    key={`${mapping.concept_element}-${index}`}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
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
                        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
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
      </main>
    </div>
  );
}
