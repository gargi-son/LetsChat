//write all the routes related to the user

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// used when we need to chain the requests
router.route("/").post(registerUser).get(protect, allUsers); // it will have to go through the protect middleware before going to the allUsers
router.post("/login", authUser);

module.exports = router;
