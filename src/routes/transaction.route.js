const express = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/create", transactionController.createTransaction);
router.post("/pay/:id", transactionController.payTransaction);
router.delete("/:id", transactionController.deleteTransactionById);
router.get("/", transactionController.getAllTransactions);

module.exports = router;
