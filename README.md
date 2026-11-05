# support-agent

The support agent of Lumen, a demo store for home goods. It looks up the order and answers the
customer by the store's policy in [`src/prompt.ts`](src/prompt.ts).

```sh
npm install
npm start B2087 "My desk lamp stopped working. Can I return it?"
```

It needs `ANTHROPIC_API_KEY` and `TELEMETRY_DEV_API_KEY`.

## Evals

Each pull request runs [`evals/reply.eval.ts`](evals/reply.eval.ts) on the `support-golden`
dataset of [telemetry.dev](https://telemetry.dev), which holds real customer messages. The
Correctness judge scores each reply, and the check fails when fewer than 90% pass.
