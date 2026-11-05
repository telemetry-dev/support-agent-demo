import { init, runExperiment } from "@telemetry-dev/sdk";

import { replyToCustomer, type Ticket } from "../src/agent.ts";

init({ serviceName: "support-agent" });

await runExperiment({
  // On a pull request, the experiment takes the name of its branch.
  name: process.env.GITHUB_HEAD_REF || undefined,
  dataset: "support-golden",
  task: (item) => replyToCustomer(item.input as unknown as Ticket),
  evaluators: ["correctness"],
  minScores: { correctness: 0.9 },
});
