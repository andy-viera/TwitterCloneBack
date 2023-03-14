const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

router.post("/user", userController.store);
router.post("/tokens", userController.login);
//router.get("/register", userController.register);
//router.post("/users", userController.store);
//router.get("/:userid/follow", ensureAuthenticated, userController.follow);

module.exports = router;
