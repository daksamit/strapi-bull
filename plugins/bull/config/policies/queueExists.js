"use strict";

/**
 * `queueExists` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  const queueName = ctx.params.queue;
  try {
    const bull = strapi.plugins.bull;
    const queue = await bull.services.bull.findQueues(queueName);
    if (!queue) {
      throw `Queue '${queueName}' not found`;
    }
    ctx.queue = queue;
    await next();
  } catch (err) {
    console.log(err);
    return ctx.badRequest(err);
  }
};
