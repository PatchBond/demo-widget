import { test } from "node:test";
import assert from "node:assert/strict";
import { Queue } from "../src/queue.js";

test("runs jobs in order", async () => {
  const q = new Queue();
  const seen = [];
  q.push(async () => seen.push(1));
  await q.push(async () => seen.push(2));
  assert.deepEqual(seen, [1, 2]);
});
