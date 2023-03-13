const Tweet = require("../models/Tweet");

function ifIsProfileUser(req, res, next) {
  const tweetId = req.params.tweetid;
  if (req.user.tweetlist.includes(tweetId)) {
    return next();
  } else {
    res.redirect("/pages/404");
  }
}

module.exports = ifIsProfileUser;
