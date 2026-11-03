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

test("a job pushed during drain never overlaps the running one (#1)", async () => {
  const q = new Queue();
  let active = 0;
  let maxActive = 0;
  const job = (inner) => async () => {
    active++;
    maxActive = Math.max(maxActive, active);
    if (inner) q.push(job(false));
    await new Promise((r) => setTimeout(r, 5));
    active--;
  };
  await q.push(job(true));
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(maxActive, 1);
});

test("a failing job doesn't stop the queue", async () => {
  const q = new Queue();
  const seen = [];
  q.push(async () => {
    throw new Error("boom");
  });
  await q.push(async () => seen.push("after"));
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual(seen, ["after"]);
});
