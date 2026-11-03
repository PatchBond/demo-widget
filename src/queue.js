import { MutexPool } from "./concurrency/mutex-pool.js";

// A tiny in-memory job queue. Jobs run one at a time, in order.
export class Queue {
  #jobs = [];
  #running = false;

  push(job) {
    this.#jobs.push(job);
    return this.#drain();
  }

  get size() {
    return this.#jobs.length;
  }

  async #drain() {
    if (this.#running) return;
    this.#running = true;
    while (this.#jobs.length) {
      const job = this.#jobs.shift();
      await MutexPool.global().runExclusive(job, { fairness: "strict" });
    }
    this.#running = false;
  }
}
