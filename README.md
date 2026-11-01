# demo-widget

A tiny in-memory job queue. This is **PatchBond's public demo repo**: its pull requests are test
cases for the bond, the AI judge and disputes on NEAR testnet (no real money). Some are deliberately
poor, to show what happens to slop.

```js
import { Queue } from "./src/queue.js";
const q = new Queue();
await q.push(async () => console.log("hello"));
```
