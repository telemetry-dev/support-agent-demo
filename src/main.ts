import { init, shutdown } from "@telemetry-dev/sdk";

import { replyToCustomer } from "./agent.ts";

init({ serviceName: "support-agent" });

const [orderId = "B2087", ...words] = process.argv.slice(2);
console.log(await replyToCustomer({ order_id: orderId, message: words.join(" ") || "Can I return this?" }));
await shutdown();
