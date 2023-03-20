const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { expressjwt: checkJwt } = require("express-jwt");

router.post("/", userController.store);
router.post("/tokens", userController.login);

router.get(
  "/:id/followers",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  userController.showFollowers,
);
router.get(
  "/:id/following",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  userController.showFollowing,
);

router.patch(
  "/:id/follow",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  userController.follow,
);

router.get(
  "/who-to-follow",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  userController.whoToFollow,
);

module.exports = router;
