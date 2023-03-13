const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function index(req, res) {
  res.setHeader("Content-Type", "application/json");
  const tweets = await Tweet.find().sort({ createdAt: -1 });
  return res.send(JSON.stringify({ tweets }));
}

async function store(req, res) {
  const loggedUserId = req.user._id;
  const createdTweet = await Tweet.create({
    content: req.body.tweetContent,
    author: loggedUserId,
  });

  await User.findByIdAndUpdate(loggedUserId, {
    $push: { tweetlist: createdTweet._id },
  });

  res.redirect("/");
}

async function destroy(req, res) {
  const tweetId = req.params.tweetid;

  await Tweet.findByIdAndDelete(tweetId);

  res.redirect(`/profile/${req.user.username}`);
}

async function like(req, res) {
  const tweetId = req.params.tweetid;
  const loggedUserId = req.user._id;
  const tweet = await Tweet.findById(tweetId);
  const likes = tweet.likes;
  const likeIndex = likes.indexOf(loggedUserId);
  if (likeIndex === -1) {
    likes.push(loggedUserId);
  } else {
    likes.splice(likeIndex, 1);
  }
  await tweet.save();
  res.redirect(req.headers.referer || "/");
}

module.exports = { store, destroy, like, index };
