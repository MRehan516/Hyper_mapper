import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "submit_tester_feedback",
  title: "Submit tester feedback",
  description:
    "Record NNEA tester feedback about Hyper-Mapper: who the tester is, how clear the analogies were, how much cognitive friction was reduced, and free-form notes.",
  inputSchema: {
    tester_type: z
      .enum(["Autistic Self-Advocate", "NNEA Volunteer", "Educator / Mentor", "Student"])
      .describe("Tester identifier."),
    clarity_rating: z.number().int().describe("How clear were the analogies, 1 to 5."),
    friction_rating: z
      .number()
      .int()
      .describe("How much cognitive friction was reduced vs. standard textbooks, 1 to 5."),
    notes: z.string().trim().describe("Qualitative feedback and suggestions."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false },
  handler: async ({ tester_type, clarity_rating, friction_rating, notes }) => {
    const clamp = (value: number) => Math.min(5, Math.max(1, Math.round(value)));
    const supabase = supabaseAnon();

    const { error } = await supabase.from("tester_feedback").insert({
      tester_type,
      clarity_rating: clamp(clarity_rating),
      friction_rating: clamp(friction_rating),
      notes,
    });

    if (error) throw new ToolError(error.message);

    return {
      content: [{ type: "text", text: "Thank you for validating our design! Feedback recorded." }],
    };
  },
});
