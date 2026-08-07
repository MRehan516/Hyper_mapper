import { defineMcp } from "@lovable.dev/mcp-js";
import mapConceptTool from "./tools/map-concept";
import listMappingSessionsTool from "./tools/list-mapping-sessions";
import submitTesterFeedbackTool from "./tools/submit-tester-feedback";

export default defineMcp({
  name: "hyper-mapper",
  title: "Hyper-Mapper",
  version: "0.1.0",
  instructions:
    "Tools for Hyper-Mapper, an accessibility-first learning app that translates K-12 academic concepts into personalized cognitive anchors for neurodivergent learners. Use `map_concept` to build a concept map from a concept plus an anchor system, `list_mapping_sessions` to review recent maps and quiz scores, and `submit_tester_feedback` to record NNEA tester feedback.",
  tools: [mapConceptTool, listMappingSessionsTool, submitTesterFeedbackTool],
});
