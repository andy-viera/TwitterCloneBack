const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const { expressjwt: checkJwt } = require("express-jwt");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
//const ifIsProfileUser = require("../middlewares/ifIsProfileUser");
router.get(
  "/",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  tweetController.index,
);

router.get(
  "/:id",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  tweetController.indexById,
); // data via parameters

router.post(
  "/",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  tweetController.store,
); // data via request body json

router.patch("/:id/edit", tweetController.update); // data via request body json, data via params (id)

router.delete(
  "/:id",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  tweetController.destroy,
); // data via parameters

router.patch(
  "/:id/like",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  tweetController.like,
);

module.exports = router;
