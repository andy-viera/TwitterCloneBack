const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");

async function store(req, res) {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    const { firstname, lastname, email, username, password } = fields;
    console.log(fields);

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUsername || existingEmail) {
      res.status(400).json({ error: "User already exists" });
    } else {
      await User.create({
        firstname,
        lastname,
        email,
        username,
        image: files.image.newFilename,
        password: await bcrypt.hash(password, 10),
      });
      var token = jwt.sign({ id: "test" }, `${process.env.SESSION_SECRET}`);
      res.send(JSON.stringify({ token: token }));
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const hash = user.password;
    const checkPassword = await bcrypt.compare(password, hash);

    if (checkPassword) {
      var token = jwt.sign({ id: "dñakfjsd" }, `${process.env.SESSION_SECRET}`);
      res.send(JSON.stringify({ token: token }));
    } else {
      console.log("Invalid credentials");
    }
  } else {
    console.log("User not found");
  }
  res.end();
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
  login,
  // register,
  store,
  // follow,
  // showFollowers,
  // showFollowing,
};
