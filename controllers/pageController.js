/*const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function showHome(req, res) {
  const currentUser = req.user;
  const following = currentUser.following;

  const tweets = await Tweet.find({ author: { $in: following } })
    .sort({ createdAt: -1 })
    .populate("author");

  res.render("pages/home", { tweets });
}

async function showProfile(req, res) {
  const username = req.params.username;
  const userData = await User.findOne({ username }).populate({
    path: "tweetlist",
    options: { sort: { createdAt: "desc" } },
  });
  res.render("pages/profile", { userData });
}

async function showContact(req, res) {
  res.render("pages/contact");
}

async function showAboutUs(req, res) {
  res.render("pages/aboutUs");
}

async function show404(req, res) {
  res.status(404).render("pages/404");
}

// Otros handlers...
// ...

module.exports = {
  showHome,
  showProfile,
  showContact,
  showAboutUs,
}; */
