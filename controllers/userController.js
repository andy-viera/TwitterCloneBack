const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { expressjwt: checkJwt } = require("express-jwt");

async function store(req, res) {
  const { firstname, lastname, image, email, username, password } = req.body;
  var token = jwt.sign();
  // const form = formidable({
  //   multiples: true,
  //   uploadDir: __dirname + "/../public/img",
  //   keepExtensions: true,
  // });

  // form.parse(req, async (err, fields, files) => {
  //   const { firstname, lastname, email, username, password } = fields;
  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingUsername || existingEmail) {
    res.end();
    /* req.flash("error", "You are already registered!");
      res.redirect("/register"); */
  } else {
    await User.create({
      firstname,
      lastname,
      email,
      username,
      image,
      password: await bcrypt.hash(password, 10),
    });
    //     req.login(user, () => res.redirect("/"));
  }
  // });
}

// async function follow(req, res) {
//   const userId = req.params.userid;
//   const loggedUserId = req.user._id;
//   const user = await User.findById(userId);
//   const followers = user.followers;
//   const following = req.user.following;
//   const followerIndex = followers.indexOf(loggedUserId);
//   const followingIndex = following.indexOf(userId);

//   if (followerIndex === -1) {
//     followers.push(loggedUserId);
//     following.push(userId);
//   } else {
//     followers.splice(followerIndex, 1);
//     following.splice(followingIndex, 1);
//   }
//   await user.save();
//   await req.user.save();

//   res.redirect(req.headers.referer || "/");
// }

// async function showFollowers(req, res) {
//   const username = req.params.username;
//   const userFollowers = await User.findOne({ username }).populate("followers");
//   res.render("pages/followers", { userFollowers });
// }

// async function showFollowing(req, res) {
//   const username = req.params.username;
//   const userFollowing = await User.findOne({ username }).populate("following");
//   res.render("pages/following", { userFollowing });
// }

module.exports = {
  register,
  store,
  follow,
  showFollowers,
  showFollowing,
};
