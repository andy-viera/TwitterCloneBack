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

router.patch("/:id", tweetController.update); // data via request body json, data via params (id)

router.delete("/:id", tweetController.destroy); // data via parameters

//router.post("/create-tweet", ensureAuthenticated, tweetController.store);
/*router.delete(
  "/delete-tweet/:tweetid",
  ensureAuthenticated,
  ifIsProfileUser,
  tweetController.destroy,
);*/
// router.get("/:tweetid/like" /*ensureAuthenticated, tweetController.like*/);

module.exports = router;
