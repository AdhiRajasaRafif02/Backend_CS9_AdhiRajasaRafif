const express = require("express");
const itemController = require("../controllers/item.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/create", upload.single("image"), itemController.createItem);
router.put("/", upload.single("image"), itemController.updateItem);
router.get("/", itemController.getAllItems);
router.get("/byId/:id", itemController.getItemById);
router.get("/byStoreId/:store_id", itemController.getItemsByStoreId);
router.delete("/:id", itemController.deleteItem);

module.exports = router;









