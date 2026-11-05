import Anthropic from "@anthropic-ai/sdk";
import { wrapAnthropic } from "@telemetry-dev/anthropic";
import { observe, startSpan } from "@telemetry-dev/sdk";

import { lookupOrder } from "./orders.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";

const MODEL = "claude-haiku-5-5";
const MAX_TURNS = 4;

const anthropic = wrapAnthropic(new Anthropic());

const tools: Anthropic.Tool[] = [
  {
    name: "lookup_order",
    description: "Look up an order by its ID. Returns the item, the total, the status, and the days since delivery.",
    input_schema: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  },
];

function runTool(input: { order_id: string }): Anthropic.ToolResultBlockParam["content"] {
  const span = startSpan("lookup_order", { type: "tool", toolName: "lookup_order", input });
  try {
    const order = lookupOrder(input.order_id);
    span.end({ output: order });
    return JSON.stringify(order);
  } catch (error) {
    span.end({ error });
    return (error as Error).message;
  }
}

export interface Ticket {
  order_id: string;
  message: string;
}

export const replyToCustomer = observe(
  async function supportAgent(ticket: Ticket): Promise<string> {
    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: `Order ${ticket.order_id}: ${ticket.message}` },
    ];
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        tools,
        messages,
      });
      messages.push({ role: "assistant", content: res.content });
      const calls = res.content.filter((block) => block.type === "tool_use");
      if (calls.length === 0) {
        return res.content.find((block) => block.type === "text")?.text ?? "";
      }
      messages.push({
        role: "user",
        content: calls.map((call) => ({
          type: "tool_result" as const,
          tool_use_id: call.id,
          content: runTool(call.input as { order_id: string }),
        })),
      });
    }
    return "A teammate will follow up on your request shortly.";
  },
  { type: "agent", agentName: "support-agent" },
);
