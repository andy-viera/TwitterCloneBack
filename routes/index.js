//const authRoutes = require("./authRoutes");
const tweetRoutes = require("./tweetRoutes");
const userRoutes = require("./userRoutes");

module.exports = (app) => {
  //app.use("/", authRoutes);
  app.use("/tweets", tweetRoutes);
  app.use("/users", userRoutes);
};
