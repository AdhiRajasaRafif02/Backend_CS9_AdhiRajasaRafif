const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/byEmail/:email", userController.getUserByEmail);
router.get("/all", userController.getAllUsers);
router.put("/", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);
router.post("/topUp", userController.topUpBalance);

module.exports = router;
