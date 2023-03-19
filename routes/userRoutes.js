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

module.exports = router;
