/**
 * ElevenLabs Conversational AI agent IDs.
 * Capture + Map share one agent ("expert interviewer"); Teach uses a separate tutor agent.
 * Paste the IDs from https://elevenlabs.io/app/agents below (agent IDs are public, safe in code).
 */
export type AgentRole = "captureMap" | "teach";

export const AGENT_IDS: Record<AgentRole, string> = {
  captureMap: "agent_1801m4379cqvfqjra767kydbtdwn", // Apprentice Agent (Capture + Map)
  teach: "", // TODO: Teach agent_id
};

export function getAgentId(role: AgentRole): string {
  return AGENT_IDS[role].trim();
}
