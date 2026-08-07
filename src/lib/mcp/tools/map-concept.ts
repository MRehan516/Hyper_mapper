import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "map_concept",
  title: "Map concept to a cognitive anchor",
  description:
    "Translate a K-12 academic concept into a personalized cognitive anchor analogy (e.g. Minecraft Redstone, city transit maps, logic gates). Returns a concept summary, analogy mappings, and comprehension questions, and saves the mapping session.",
  inputSchema: {
    raw_concept: z
      .string()
      .trim()
      .describe("The academic concept to learn, e.g. 'Photosynthesis'."),
    cognitive_anchor: z
      .string()
      .trim()
      .describe("The familiar system to map onto, e.g. 'Computer logic gates'."),
  },
  outputSchema: { session_id: z.string().nullable(), concept_map: z.unknown() },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async ({ raw_concept, cognitive_anchor }) => {
    if (!raw_concept || !cognitive_anchor) {
      throw new ToolError("Both raw_concept and cognitive_anchor are required.");
    }

    const supabase = supabaseAnon();
    const { data, error } = await supabase.functions.invoke("map-concept", {
      body: { raw_concept, cognitive_anchor },
    });

    if (error) throw new ToolError(error.message);
    if (!data || data.error || !data.data) {
      throw new ToolError(
        (typeof data?.error === "string" && data.error) ||
          data?.message ||
          "The concept mapping service returned an unexpected response.",
      );
    }

    const payload = data.data as Record<string, unknown>;
    const { data: inserted } = await supabase
      .from("mapping_sessions")
      .insert({ raw_concept, cognitive_anchor, structured_output: payload })
      .select("id")
      .maybeSingle();

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { session_id: inserted?.id ?? null, concept_map: payload },
    };
  },
});
