"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAntiBan = void 0;

const makeAntiBan = (config = {}) => {
    const messagesSendRate = config.messagesSendRate || 1;
    const minGapMs = 1000 / messagesSendRate;
    const humanizeEnabled = config.humanizeMessages !== false;

    const queues = new Map();

    const randomBetween = (min, max) => {
        const lo = Math.min(min, max);
        const hi = Math.max(min, max);
        return lo + Math.random() * (hi - lo);
    };

    const enqueue = (jid, task) => {
        if (!queues.has(jid)) {
            queues.set(jid, { chain: Promise.resolve(), lastSentAt: 0 });
        }
        const queue = queues.get(jid);
        const run = queue.chain.then(async () => {
            const wait = Math.max(0, minGapMs - (Date.now() - queue.lastSentAt));
            if (wait > 0) {
                await new Promise((resolve) => setTimeout(resolve, wait));
            }
            const result = await task();
            queue.lastSentAt = Date.now();
            return result;
        });
        queue.chain = run.catch(() => { });
        return run;
    };

    return { enqueue, humanizeEnabled, randomBetween };
};

exports.makeAntiBan = makeAntiBan;
