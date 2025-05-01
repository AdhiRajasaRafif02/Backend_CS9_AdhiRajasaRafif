const express = require("express");
const storeController = require("../controllers/store.controller");

const router = express.Router();

router.get("/getAll", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.post("/create", storeController.createStore);
router.put("/", storeController.updateStoreById);
router.delete("/:id", storeController.deleteStoreById); // Tambahkan route ini

module.exports = router;


