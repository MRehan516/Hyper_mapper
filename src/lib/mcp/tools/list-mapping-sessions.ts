import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_mapping_sessions",
  title: "List recent mapping sessions",
  description:
    "List the most recent Hyper-Mapper concept mapping sessions, including the concept, the cognitive anchor used, and the comprehension score when a quiz was completed.",
  inputSchema: {
    limit: z.number().int().describe("How many sessions to return (1-50, default 10)."),
  },
  outputSchema: { sessions: z.array(z.unknown()) },
  annotations: { readOnlyHint: true, idempotentHint: true },
  handler: async ({ limit }) => {
    const take = Math.min(50, Math.max(1, Math.round(limit || 10)));
    const supabase = supabaseAnon();

    const { data, error } = await supabase
      .from("mapping_sessions")
      .select("id, raw_concept, cognitive_anchor, comprehension_score, created_at")
      .order("created_at", { ascending: false })
      .limit(take);

    if (error) throw new ToolError(error.message);

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { sessions: data ?? [] },
    };
  },
});
