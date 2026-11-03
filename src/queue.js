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
    try {
      while (this.#jobs.length) {
        const job = this.#jobs.shift();
        try {
          await job();
        } catch {
          // A failing job must not wedge the queue or let the next job start early.
        }
      }
    } finally {
      this.#running = false;
    }
  }
}
