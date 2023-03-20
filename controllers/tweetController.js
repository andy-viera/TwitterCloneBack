const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function index(req, res) {
  const user = await User.findById(req.auth.id);
  const tweets = await Tweet.find({ author: { $in: [...user.following, user] } })
    .limit(20)
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "_id firstname lastname username email image",
    });
  return res.json(tweets);
}

async function indexById(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password -email").exec();
  const tweets = await Tweet.find({ author: { $in: [userId] } }).sort({ createdAt: -1 });

  return res.json({
    tweets,
    user,
  });
}

async function store(req, res) {
  const tweetContent = req.body.content;
  const loggedUserId = req.auth.id;

  const createdTweet = await Tweet.create({
    content: tweetContent,
    author: loggedUserId,
  });

  await User.findByIdAndUpdate(loggedUserId, {
    $push: { tweetlist: createdTweet },
  });
  return res.json(createdTweet);
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
  const loggedUserId = req.auth.id;
  const tweet = await Tweet.findById(tweetId);

  if (tweet.author.toString() === loggedUserId) {
    await Tweet.findByIdAndDelete(tweetId);
    await User.findByIdAndUpdate(loggedUserId, { $pull: { tweetlist: tweetId } });
  }

  return res.end();
}

async function like(req, res) {
  const tweetId = req.params.id;
  const loggedUserId = req.auth.id;
  const tweet = await Tweet.findById(tweetId);
  const likes = tweet.likes;
  const likeIndex = likes.indexOf(loggedUserId);
  if (likeIndex === -1) {
    likes.push(loggedUserId);
  } else {
    likes.splice(likeIndex, 1);
  }
  await tweet.save();

  return res.json(likes);
}

module.exports = { index, indexById, store, update, destroy, like };
