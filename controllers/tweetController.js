const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function index(req, res) {
  const user = await User.findById(req.auth.id);
  console.log("user", user);
  const tweets = await Tweet.find({ author: { $in: [...user.following, user] } })
    .limit(20)
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "_id firstname lastname username email image",
    });
  res.json(tweets);
  //const tweets = await Tweet.find();
  //res.json(tweets);
  //console.log(tweets);
}

async function indexById(req, res) {
  const userId = req.params.id;
  const tweets = await Tweet.findById(userId).sort({ createdAt: -1 });
  console.log(tweets);
  return res.json(tweets);
}

async function store(req, res) {
  const { loggedUserId, tweetContent } = req.body;

  const createdTweet = await Tweet.create({
    content: tweetContent,
    author: loggedUserId,
  });

  await User.findByIdAndUpdate(loggedUserId, {
    $push: { tweetlist: createdTweet._id },
  });

  return res.end();
}

async function update(req, res) {
  const tweetId = req.params.id;
  const tweetContent = req.body.content;

  await Tweet.findByIdAndUpdate(tweetId, {
    content: tweetContent,
  });

  return res.end();
}

async function destroy(req, res) {
  const tweetId = req.params.id;
  const { userId } = req.body;

  await Tweet.findByIdAndDelete(tweetId);

  await User.findByIdAndUpdate(userId, { $pull: { tweetlist: tweetId } });

  return res.end();
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

module.exports = { index, indexById, store, update, destroy, like };
