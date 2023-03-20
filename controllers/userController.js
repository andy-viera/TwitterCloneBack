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
      res.end();
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
      var token = jwt.sign({ id: user._id }, `${process.env.SESSION_SECRET}`);
      res.send({
        token: token,
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        followers: user.followers,
        following: user.following,
        username: user.username,
        image: user.image,
      });
    } else {
      console.log("Invalid credentials");
    }
  } else {
    console.log("User not found");
  }
  res.end();
}

async function follow(req, res) {
  const userId = req.params.id;
  const loggedUserId = req.auth.id;

  const user = await User.findById(userId);
  const loggedUser = await User.findById(loggedUserId);

  const userFollowers = user.followers;
  const loggedUserFollowing = loggedUser.following;
  const followerIndex = userFollowers.indexOf(loggedUserId);
  const followingIndex = loggedUserFollowing.indexOf(userId);

  if (followerIndex === -1) {
    userFollowers.push(loggedUserId);
    loggedUserFollowing.push(userId);
  } else {
    userFollowers.splice(followerIndex, 1);
    loggedUserFollowing.splice(followingIndex, 1);
  }
  await user.save();
  await loggedUser.save();

  return res.json({
    followingList: loggedUserFollowing,
  });
}

async function showFollowers(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "followers",
      select: "firstname lastname username image",
    })
    .exec();

  return res.json(user);
}

async function showFollowing(req, res) {
  const userId = req.params.id;
  const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "following",
      select: "firstname lastname username image",
    })
    .exec();

  return res.json(user);
}

async function whoToFollow(req, res) {
  const users = await User.find().select("username firstname lastname image id").limit(5).lean();

  return res.json(users);
}

module.exports = {
  store,
  login,
  follow,
  showFollowers,
  showFollowing,
  whoToFollow,
};
