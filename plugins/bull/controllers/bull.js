"use strict";

/**
 * bull.js controller
 *
 * @description: A set of functions called "actions" of the `bull` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  overview(ctx) {
    // const result = {}
    // for (let queue of queues) {
    //   result[queue.name] = {}
    //   result[queue.name].waiting = await queue.getWaitingCount()
    //   result[queue.name].active = await queue.getActiveCount()
    //   result[queue.name].completed = await queue.getCompletedCount()
    //   result[queue.name].failed = await queue.getFailedCount()
    //   result[queue.name].delayed = await queue.getDelayedCount()
    //   result[queue.name].paused = await queue.getPausedCount()
    // }
    // return result
    const bull = strapi.plugins.bull;
    return bull.services.bull.findQueues();
  },

  async find(ctx) {
    const queueType = ctx.params.type;
    try {
      const queue = ctx.queue;
      switch (queueType) {
        case "waiting":
          return queue.getWaiting();
        case "active":
          return queue.getActive();
        case "completed":
          return queue.getCompleted();
        case "failed":
          return queue.getFailed();
        case "delayed":
          return queue.getDelayed();
        // case 'paused':
        //   return queue.getPaused();
        default:
          throw `invalid queue type: ${queueType}`;
      }
    } catch (err) {
      const message = `cannot find jobs, ${err}`;
      strapi.log.error(message);
      ctx.badRequest(null, message);
    }
  },

  async findOne(ctx) {
    const jobId = ctx.params.id;
    try {
      const queue = ctx.queue;
      return queue.getJob(jobId);
    } catch (err) {
      const message = `cannot find job id: ${jobId}`;
      strapi.log.error(message);
      ctx.badRequest(null, message);
    }
  },

  async create(ctx) {
    const jobId = ctx.params.id || null;
    const data = ctx.request.body;
    const opts = ctx.request.options;
    try {
      const queue = ctx.queue;
      if (jobId !== null) {
        return queue.add(data, {
          jobId,
          ...opts,
        });
      } else return queue.add(data, opts);
    } catch (err) {
      const message = `cannot create job: ${err}`;
      strapi.log.error(message);
      ctx.badRequest(null, message);
    }
  },

  async retry(ctx) {
    const jobId = ctx.params.id;
    try {
      const queue = ctx.queue;
      if (jobId !== null) {
        const job = await queue.getJob(jobId);
        return job.retry();
      }
      throw `missing job id ${jobId}`;
    } catch (err) {
      const message = `cannot retry job: ${err}`;
      strapi.log.error(message);
      ctx.badRequest(null, message);
    }
  },

  async delete(ctx) {
    const jobId = ctx.params.id;
    try {
      const queue = ctx.queue;
      let jobs = null;
      if (jobId !== null) {
        switch (jobId) {
          case "waiting":
            jobs = await queue.getWaiting();
            break;
          case "active":
            jobs = await queue.getActive();
            break;
          case "completed":
            jobs = await queue.getCompleted();
            break;
          case "failed":
            jobs = await queue.getFailed();
            break;
          case "delayed":
            jobs = await queue.getDelayed();
            break;
          case "paused":
            jobs = await queue.getPaused();
            break;
          default:
            jobs = [jobId];
        }
        jobs.forEach((j) => {
          if (j instanceof Object) {
            j.remove();
          } else {
            queue.getJob(j).then((job) => job.remove());
          }
        });
        return {
          message: "removed",
        };
      }
      throw `missing job id ${jobId}`;
    } catch (err) {
      const message = `cannot remove job(s): ${err}`;
      strapi.log.error(message);
      ctx.badRequest(null, message);
    }
  },
};
