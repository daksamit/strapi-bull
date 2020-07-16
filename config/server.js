module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  bull: {
    default: {
      redis: {
        port: 6379,
        host: "127.0.0.1",
        password: "",
      },
    },
    queues: {
      Wholesale: {},
      Server: {},
    },
  },
});
