const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
//const ifIsProfileUser = require("../middlewares/ifIsProfileUser");

router.get("/", tweetController.index);
router.get("/:id", tweetController.indexById); // data via parameters
router.post("/", tweetController.store); // data via request body json
router.patch("/:id", tweetController.update); // data via request body json
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
