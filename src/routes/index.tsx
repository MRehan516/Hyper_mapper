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
  Upload,
  FileCheck2,
  Trash2,
  X,

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

const sensoryRules: Record<string, string> = {
  "Short Sentences": "Enforce rigid maximum sentence length of 10 words.",
  "Plain Language (No Jargon)":
    "Strip all academic or technical jargon; explain concepts using everyday grade-school vocabulary.",
  "High Visual Contrast":
    "Keep each explanation visually scannable: short standalone lines, no dense paragraphs.",
  "Break into Micro-Steps":
    "Deconstruct the explanation into granular, sequential micro-steps (at least 5 distinct atomic steps), each written as its own sentence.",
};

// Combine every selected chip into one rule block so the model obeys all of
// them simultaneously (any combination of the four options).
function buildSensoryInstructions(prefs: string[]) {
  const rules = prefs.map((pref) => sensoryRules[pref]).filter(Boolean);
  if (rules.length === 0) return "";
  return (
    ` [Accessibility formatting rules — obey ALL of the following simultaneously: ` +
    rules.map((rule, index) => `${index + 1}) ${rule}`).join(" ") +
    `]`
  );
}


const formatOptions = [
  { value: "Concept Map", icon: Network },
  { value: "Story Mode", icon: BookOpen },
  { value: "Bullet Points", icon: List },
  { value: "Flowchart", icon: GitBranch },
];

const formatInstructions: Record<string, string> = {
  "Concept Map":
    "Generate a standard 4-step conceptual analogy mapping: each step pairs one concept element with its anchor equivalent and a clear plain-language explanation.",
  "Story Mode":
    "Transform the explanation into a cohesive, narrative-driven story that uses the cognitive anchor as the setting. Each mapping's explanation should read as a connected scene of one continuous story, in order.",
  "Bullet Points":
    "Structure the breakdown as ultra-concise, high-scannability bullet points. Keep every explanation to one or two short lines — no long paragraphs.",
  "Flowchart":
    "Format the steps as an explicit sequential workflow with directional logic (e.g. 'Condition A triggers State B'). Each step must clearly lead into the next.",
};

const anchorCategories: { label: string; keywords: string[] }[] = [
  { label: "Video games", keywords: ["game", "gaming", "minecraft", "redstone", "roblox", "fortnite", "console"] },
  { label: "Sports", keywords: ["sport", "soccer", "football", "basketball", "team", "coach", "match"] },
  { label: "Cooking", keywords: ["cook", "bak", "recipe", "kitchen", "chef", "ingredient"] },
  { label: "Transit systems", keywords: ["transit", "train", "subway", "metro", "bus", "traffic", "route"] },
  { label: "Music", keywords: ["music", "song", "beat", "guitar", "piano", "band", "producer"] },
  { label: "Film & TV", keywords: ["show", "movie", "tv", "film", "anime", "plot", "series"] },
  { label: "Computer logic", keywords: ["logic", "computer", "code", "circuit", "gate", "program", "algorithm"] },
];

function categorizeAnchor(value: string) {
  const text = value.toLowerCase();
  for (const category of anchorCategories) {
    if (category.keywords.some((keyword) => text.includes(keyword))) return category.label;
  }
  return "Not enough data yet";
}


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
  const [resultFormat, setResultFormat] = useState("Concept Map");
  const [resultPrefs, setResultPrefs] = useState<string[]>([]);

  const [inputMode, setInputMode] = useState<"manual" | "paste">("manual");
  const [denseText, setDenseText] = useState("");
  const [extractNote, setExtractNote] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function extractReadableText(raw: string) {
    // Pull readable runs of text out of a raw byte string (works for the
    // uncompressed text layer of simple PDFs and for plain documents).
    const parenText = Array.from(raw.matchAll(/\(([^()\\]{2,})\)/g))
      .map((match) => match[1])
      .join(" ");
    const source = parenText.length > 40 ? parenText : raw;
    return source
      .replace(/[^\x20-\x7E\n\r\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function handleFileUpload(file: File | null | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploadedFileName(null);
    try {
      const isPdf = /\.pdf$/i.test(file.name) || file.type === "application/pdf";
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("read-failed"));
        reader.onload = () => resolve(String(reader.result ?? ""));
        if (isPdf || /\.docx$/i.test(file.name)) {
          reader.readAsBinaryString(file);
        } else {
          reader.readAsText(file);
        }
      });
      const cleaned = isPdf || /\.docx$/i.test(file.name) ? extractReadableText(text) : text.trim();
      setUploadedFileName(file.name);
      if (cleaned.length > 30) {
        setDenseText(cleaned.slice(0, 20000));
        const firstSentence = (cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned).trim();
        setRawConcept(firstSentence.replace(/\s+/g, " ").slice(0, 240));
        setExtractNote("Text pulled from your file. Edit the concept below if it needs trimming.");
      } else {
        setRawConcept(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
        setUploadError(
          "I could not read a text layer in that file, so I used the file name as a starting concept. Paste or type any extra detail below.",
        );
      }
    } catch {
      setUploadedFileName(file.name);
      setUploadError("That file could not be read in the browser. Try pasting the text instead.");
    }
  }

  function clearUploadedFile() {
    setUploadedFileName(null);
    setUploadError(null);
    setDenseText("");
    setExtractNote(null);
  }

  function deleteSavedMap(id: string) {
    setDeck((current) => current.filter((item) => item?._id !== id));
  }

  function clearAllSavedMaps() {
    setDeck([]);
  }

  const deckStats = (() => {
    const total = deck.length;

    const anchors = deck
      .map((item) => String(item?._cognitive_anchor ?? "").trim())
      .filter(Boolean);
    const counts = new Map<string, number>();
    for (const anchorValue of anchors) {
      const category = categorizeAnchor(anchorValue);
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    let topCategory = "Not enough data yet";
    let best = 0;
    for (const [category, count] of counts) {
      if (count > best) {
        best = count;
        topCategory = category;
      }
    }
    return {
      total,
      topCategory,
      distinctAnchors: new Set(anchors.map((a) => a.toLowerCase())).size,
    };
  })();

  function autoExtract() {
    const text = denseText.trim();
    if (!text) {
      setExtractNote("Paste some text first and I will pull the core concept out of it.");
      return;
    }
    const firstSentence = (text.split(/(?<=[.!?])\s+/)[0] ?? text).trim();
    const concept = firstSentence.replace(/\s+/g, " ").slice(0, 240);
    setRawConcept(concept);
    const detected = categorizeAnchor(text);
    if (!anchor.trim() && detected !== "Not enough data yet") {
      setAnchor(`${detected} — `);
    }
    setExtractNote("Concept extracted into the field below. Edit it if it needs trimming.");
    setInputMode("manual");
  }


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
      ` [Output format: ${selectedFormat}. ${formatInstructions[selectedFormat] ?? ""}]` +
      (sensoryPrefs.length ? ` [Formatting constraints: ${sensoryPrefs.join(", ")}]` : "");
    setResultFormat(selectedFormat);


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
    <SidebarProvider style={{ "--sidebar-width": "20rem", "--sidebar-width-icon": "5rem" } as React.CSSProperties}>
      <div
        className={`flex min-h-dvh w-full bg-background ${isPrintingProfile ? "printing-profile" : ""}`}
      >
        <AppSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <SidebarInset className="bg-background">
        <SiteHeader withSidebarTrigger onOpenFeedback={() => setFeedbackOpen(true)} />
        <main className="flex w-full flex-col gap-8 px-6 py-8 lg:px-12">
        <h1 className="sr-only">Hyper-Mapper concept mapping dashboard</h1>

        {activeTab === "Dashboard" ? (
          <div key="dashboard" className="animate-fade-in mx-auto flex w-full max-w-6xl flex-col gap-8 space-y-6">
        <section className="no-print w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-soft via-secondary to-highlight-soft p-8 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/70 px-4 py-2 text-xl font-semibold text-accent-foreground lg:text-2xl">
            <Activity className="size-3.5" aria-hidden="true" />
            Cognitive Sync: Active
          </span>
          <h2 className="mt-4 font-display text-6xl font-extrabold tracking-tight text-foreground">
            Hyper-Mapper Core
          </h2>
          <p className="mt-4 text-2xl leading-relaxed text-muted-foreground lg:text-3xl">
            Translate any academic concept into the system your brain already knows by heart.
          </p>
        </section>

        <div className="no-print w-full space-y-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/40 px-8 py-6 text-center text-xl font-medium text-secondary-foreground lg:text-2xl sm:flex-row">
            <Brain className="size-4 shrink-0" aria-hidden="true" />
            <span>Designed for how your brain works — zero medical labels, zero diagnostic profiling required.</span>
          </div>
          <p className="w-full text-center text-xl leading-relaxed text-muted-foreground lg:text-2xl">
            <span className="font-semibold text-accent-foreground">Layout Spec:</span> Enforces 32px
            Cognitive Padding to prevent visual crowding and sensory overload.
          </p>
        </div>

        <section
          aria-labelledby="step-one"
          className="no-print w-full rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <h2 id="step-one" className="font-display text-3xl font-bold text-foreground lg:text-4xl">
            Build your concept map
          </h2>
          <p className="mt-3 text-2xl leading-relaxed text-muted-foreground lg:text-3xl">
            Tell us what you are learning and the system you already understand deeply.
          </p>

          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <div role="group" aria-label="Input mode" className="flex flex-wrap gap-2">
                {([
                  { value: "manual" as const, label: "Type it myself", icon: Sparkles },
                  { value: "paste" as const, label: "Paste Dense Text / Syllabus", icon: FileText },
                ]).map((mode) => {
                  const Icon = mode.icon;
                  const selected = inputMode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setInputMode(mode.value)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-5 py-3 text-xl font-semibold transition-colors lg:text-2xl ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-6">
                <Label htmlFor="file-upload" className="text-3xl font-bold lg:text-4xl">
                  Upload a document
                </Label>
                <p className="text-xl leading-relaxed text-muted-foreground lg:text-2xl">
                  PDF, TXT, MD, or DOCX. The text is read right here in your browser — nothing is
                  uploaded anywhere.
                </p>
                <div className="flex w-full items-center gap-3">
                  <Upload className="size-6 shrink-0 text-primary" aria-hidden="true" />
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.txt,.md,.docx"
                    onChange={(event) => {
                      void handleFileUpload(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                    className="block w-full cursor-pointer rounded-xl border-2 border-border bg-card p-6 text-3xl font-semibold leading-relaxed text-foreground file:mr-6 file:min-h-16 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-8 file:py-4 file:text-3xl file:font-extrabold file:text-primary-foreground"
                  />
                </div>
                {uploadedFileName && !uploadError ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <p
                      aria-live="polite"
                      className="inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-2 text-xl font-bold text-success lg:text-2xl"
                    >
                      <FileCheck2 className="size-5 shrink-0" aria-hidden="true" />
                      File loaded: {uploadedFileName} — Ready to map
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearUploadedFile}
                      aria-label={`Remove file ${uploadedFileName}`}
                      className="min-h-14 gap-2 px-6 text-xl font-bold lg:text-2xl"
                    >
                      <X className="size-5" aria-hidden="true" />
                      Remove file
                    </Button>
                  </div>
                ) : null}
                {uploadError ? (
                  <div className="space-y-3">
                    <p
                      aria-live="polite"
                      className="rounded-xl bg-highlight-soft px-4 py-3 text-xl font-semibold leading-relaxed text-foreground lg:text-2xl"
                    >
                      {uploadError}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearUploadedFile}
                      className="min-h-14 gap-2 px-6 text-xl font-bold lg:text-2xl"
                    >
                      <X className="size-5" aria-hidden="true" />
                      Clear file
                    </Button>
                  </div>
                ) : null}

              </div>

              {inputMode === "paste" ? (
                <div className="space-y-4 rounded-2xl border border-border bg-secondary/30 p-6">
                  <Label htmlFor="dense-text" className="text-3xl font-bold lg:text-4xl">
                    Paste a paragraph or syllabus snippet
                  </Label>
                  <Textarea
                    id="dense-text"
                    rows={6}
                    value={denseText}
                    onChange={(event) => setDenseText(event.target.value)}
                    placeholder="Paste the reading, assignment brief, or syllabus section here..."
                    className="w-full p-6 text-3xl leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={autoExtract}
                      className="min-h-16 px-8 py-6 text-3xl font-extrabold"
                    >
                      <Sparkles className="size-5" aria-hidden="true" />
                      Auto-Extract Concept &amp; Anchor
                    </Button>
                    {denseText ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setDenseText("");
                          setExtractNote(null);
                        }}
                        className="min-h-16 px-8 py-6 text-3xl font-extrabold"
                      >
                        <X className="size-5" aria-hidden="true" />
                        Clear text
                      </Button>
                    ) : null}
                  </div>

                  {extractNote ? (
                    <p aria-live="polite" className="text-xl leading-relaxed text-muted-foreground lg:text-2xl">
                      {extractNote}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>


            <div className="space-y-3">
              <p className="text-3xl font-bold text-foreground lg:text-4xl">Output format</p>
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
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-5 py-3 text-xl font-semibold transition-colors lg:text-2xl ${
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

              <Label htmlFor="concept" className="text-3xl font-bold lg:text-4xl">
                Academic Concept to Learn
              </Label>
              <Textarea
                id="concept"
                rows={3}
                value={rawConcept}
                onChange={(event) => setRawConcept(event.target.value)}
                placeholder="e.g., Photosynthesis, Electromagnetism, Cell Division..."
                className="w-full p-6 text-3xl leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="anchor" className="text-3xl font-bold lg:text-4xl">
                Your Preferred Cognitive Anchor
              </Label>
              <Input
                id="anchor"
                ref={anchorInputRef}
                value={anchor}
                onChange={(event) => setAnchor(event.target.value)}
                placeholder="e.g., Computer Logic Gates, City Transit Maps, Minecraft Redstone, Music Theory..."
                className="min-h-24 w-full p-6 text-3xl md:text-3xl"
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
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-3 text-xl font-semibold text-foreground lg:text-2xl transition-colors hover:border-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <AccordionTrigger className="min-h-14 px-4 text-left text-2xl font-bold lg:text-3xl">
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
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-5 py-3 text-xl font-semibold transition-colors lg:text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
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
              className="min-h-20 w-full px-8 py-6 text-3xl font-extrabold"
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
          <div className="w-full">
            <ErrorCard message={error} onRetry={generate} />
          </div>
        ) : null}

        {loading ? <SkeletonLoader /> : null}

        {result ? (
          <>
            <section aria-labelledby="summary" className="mt-10">
              <h2 id="summary" className="font-display text-3xl font-bold text-foreground lg:text-4xl">
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
                <h2 id="mappings" className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                  {resultFormat === "Story Mode"
                    ? "Your story"
                    : resultFormat === "Bullet Points"
                      ? "Key points"
                      : resultFormat === "Flowchart"
                        ? "Sequential workflow"
                        : "Analogy mapping steps"}
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
              ) : resultFormat === "Story Mode" ? (
                <article className="print-card mt-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
                    Story mode
                  </p>
                  <div className="mt-4 space-y-5">
                    {result.mappings?.map((mapping, index) => (
                      <p
                        key={`${mapping.concept_element}-${index}`}
                        className="text-xl leading-relaxed text-foreground"
                      >
                        <span className="font-bold">{mapping.concept_element}</span>{" "}
                        <span className="font-semibold text-accent-foreground">
                          ({mapping.anchor_equivalent})
                        </span>{" "}
                        — {mapping.explanation}
                      </p>
                    ))}
                  </div>
                </article>
              ) : resultFormat === "Bullet Points" ? (
                <ul className="print-card mt-4 space-y-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
                  {result.mappings?.map((mapping, index) => (
                    <li
                      key={`${mapping.concept_element}-${index}`}
                      className="flex gap-3 text-lg leading-relaxed text-foreground"
                    >
                      <span aria-hidden="true" className="mt-1 text-primary">
                        •
                      </span>
                      <span>
                        <span className="font-bold">{mapping.concept_element}</span> ={" "}
                        <span className="font-semibold text-accent-foreground">
                          {mapping.anchor_equivalent}
                        </span>
                        <span className="block text-base text-muted-foreground">
                          {mapping.explanation}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : resultFormat === "Flowchart" ? (
                <ol className="mt-4 space-y-3">
                  {result.mappings?.map((mapping, index) => (
                    <li key={`${mapping.concept_element}-${index}`}>
                      <div className="print-card rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-wide text-accent-foreground">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-foreground">
                          {mapping.concept_element} → {mapping.anchor_equivalent}
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                          {mapping.explanation}
                        </p>
                      </div>
                      {index < (result.mappings?.length ?? 0) - 1 ? (
                        <div aria-hidden="true" className="py-2 text-center text-2xl text-primary">
                          ↓
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
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
                <h2 id="quiz" className="font-display text-3xl font-bold text-foreground lg:text-4xl">
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
              <h2 className="font-display text-5xl font-extrabold tracking-tight text-foreground lg:text-6xl">
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
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-5xl font-extrabold tracking-tight text-foreground lg:text-6xl">
                  History
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  <Layers className="mr-2 inline size-4" aria-hidden="true" />
                  Your last 15 maps, saved on this device only.
                </p>
              </div>
              {deck.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (
                      window.confirm("Delete all saved maps on this device? This cannot be undone.")
                    ) {
                      clearAllSavedMaps();
                    }
                  }}
                  className="min-h-14 gap-2 border-2 px-6 text-xl font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground lg:text-2xl"
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                  Clear all ({deck.length})
                </Button>
              ) : null}
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
                    <div className="flex items-center gap-3">
                      <AccordionTrigger
                        aria-label={`Saved map: ${saved._raw_concept || "concept map"}`}
                        className="min-h-13 flex-1 text-left text-lg font-bold"
                      >
                        {saved._raw_concept || "Saved concept map"}
                      </AccordionTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => deleteSavedMap(saved._id)}
                        aria-label={`Delete saved map: ${saved._raw_concept || "concept map"}`}
                        className="min-h-11 min-w-11 shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                      </Button>
                    </div>
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => deleteSavedMap(saved._id)}
                        className="mt-6 min-h-12 gap-2 px-5 text-base font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete this map
                      </Button>
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
              <h2 className="mt-4 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground lg:text-6xl">
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

