import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ErrorCard } from "@/components/error-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, isSupabaseConfigured, MISSING_CONFIG_MESSAGE } from "@/lib/supabase";

export const Route = createFileRoute("/tester-feedback")({
  head: () => ({
    meta: [
      { title: "NNEA Tester Feedback Portal | Hyper-Mapper" },
      {
        name: "description",
        content:
          "Share clarity and cognitive-friction ratings to help improve Hyper-Mapper for neurodivergent learners.",
      },
      { property: "og:title", content: "NNEA Tester Feedback Portal | Hyper-Mapper" },
      {
        property: "og:description",
        content:
          "Share clarity and cognitive-friction ratings to help improve Hyper-Mapper for neurodivergent learners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TesterFeedbackPage,
});

const IDENTIFIERS = [
  "Autistic Self-Advocate",
  "NNEA Volunteer",
  "Educator / Mentor",
  "Student",
];

function StarRating({
  legend,
  value,
  onChange,
  name,
}: {
  legend: string;
  value: number;
  onChange: (value: number) => void;
  name: string;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-foreground">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const selected = value === star;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${star} out of 5`}
              name={name}
              onClick={() => onChange(star)}
              className={`flex min-h-11 min-w-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                star <= value
                  ? "border-highlight bg-highlight-soft text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Star
                className={`size-4 ${star <= value ? "fill-highlight text-highlight" : ""}`}
                aria-hidden="true"
              />
              {star}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {value > 0 ? `Selected: ${value} of 5` : "No rating selected yet"}
      </p>
    </fieldset>
  );
}

function TesterFeedbackPage() {
  const [identifier, setIdentifier] = useState("");
  const [clarity, setClarity] = useState(0);
  const [friction, setFriction] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(MISSING_CONFIG_MESSAGE);
      return;
    }
    if (!identifier || clarity === 0 || friction === 0) {
      setError("Please choose a tester identifier and both star ratings before submitting.");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.rpc("submit_tester_feedback", {
      p_session_id: null,
      p_tester_type: identifier,
      p_clarity_rating: clarity,
      p_friction_rating: friction,
      p_notes: notes.trim() || null,
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          NNEA Tester Feedback Portal
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Help us measure impact and improve Hyper-Mapper for neurodivergent youth.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border-2 border-success/40 bg-success-soft p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
              Thank You for Validating Our Design!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Your feedback has been recorded and will directly shape the next iteration.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6 min-h-11"
              onClick={() => {
                setSubmitted(false);
                setIdentifier("");
                setClarity(0);
                setFriction(0);
                setNotes("");
              }}
            >
              Submit another response
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-3">
              <Label htmlFor="tester-identifier" className="text-base font-semibold">
                Tester Identifier
              </Label>
              <Select value={identifier} onValueChange={setIdentifier}>
                <SelectTrigger id="tester-identifier" className="min-h-11 w-full">
                  <SelectValue placeholder="Select the role that fits you best" />
                </SelectTrigger>
                <SelectContent>
                  {IDENTIFIERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <StarRating
              name="clarity"
              legend="How clear were the analogies?"
              value={clarity}
              onChange={setClarity}
            />
            <StarRating
              name="friction"
              legend="Did this reduce cognitive friction compared to standard textbooks?"
              value={friction}
              onChange={setFriction}
            />

            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-semibold">
                Qualitative Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                placeholder="What worked? What felt confusing? What would you change?"
                className="text-base leading-relaxed"
              />
            </div>

            {error ? <ErrorCard message={error} /> : null}

            <Button
              type="submit"
              disabled={submitting}
              className="min-h-12 w-full text-base font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
