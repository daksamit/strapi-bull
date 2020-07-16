"use strict";
const Queue = require("bull");

/**
 * bull.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  async findQueues(queueName = null) {
    const config = strapi.config.get("server.bull");
    const bullConfig = config.default;
    const bullQueues = config.queues;
    const queues = [];

    for (const [queueName, config] of Object.entries(bullQueues)) {
      queues.push(new Queue(queueName, { ...bullConfig, config }));
    }
    // return queueName !== null ? queues.find(q => q.name === queueName) : queues;
    return queueName !== null
      ? queues.find((q) => q.name === queueName)
      : {
          "all queues": "http://loc.strapi.inntoo.pl/bull",
          "OrdersB2B queue": "http://loc.strapi.inntoo.pl/bull/bborders",
          queues,
        };
  },

  async getRedisStatistics() {
    return strapi.config.bull;
  },
};
