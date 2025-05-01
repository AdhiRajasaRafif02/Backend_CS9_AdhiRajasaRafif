const transactionRepository = require("../repositories/transaction.repository");
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const { v4: uuidv4 } = require("uuid");

exports.createTransaction = async (req, res) => {
    try {
        const { user_id, item_id, quantity } = req.body;

        if (!user_id || !item_id || !quantity) {
            return baseResponse(res, false, 400, "user_id, item_id, and quantity are required");
        }

        if (quantity <= 0) {
            return baseResponse(res, false, 400, "Quantity must be larger than 0");
        }

        const item = await itemRepository.getItemById(item_id);
        const user = await userRepository.getUserById(user_id);

        if (!item || !user) {
            return baseResponse(res, false, 404, "User or item not found");
        }

        const total = item.price * quantity;
        const newTransaction = {
            id: uuidv4(),
            user_id,
            item_id,
            quantity,
            total,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        const created = await transactionRepository.createTransaction(newTransaction);
        baseResponse(res, true, 201, "Transaction created", created);
    } catch (err) {
        console.error("Error creating transaction:", err);
        baseResponse(res, false, 500, "Failed to create transaction");
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // 🔹 Cek apakah transaksi ada
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found");
        }

        // 🔹 Cek apakah transaksi sudah dibayar
        if (transaction.status === "paid") {
            return baseResponse(res, false, 400, "Transaction already paid");
        }

        // 🔹 Ambil data user dan item terkait
        const user = await userRepository.getUserById(transaction.user_id);
        const item = await itemRepository.getItemById(transaction.item_id);

        if (!user || !item) {
            return baseResponse(res, false, 404, "User or item not found");
        }

        // 🔹 Cek apakah user memiliki saldo yang cukup
        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Insufficient balance");
        }

        // 🔹 Cek apakah stok mencukupi
        if (item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Insufficient stock");
        }

        // 🔹 Kurangi saldo user
        const newBalance = user.balance - transaction.total;
        await userRepository.updateUserBalance(transaction.user_id, newBalance);

        // 🔹 Kurangi stok item
        const newStock = item.stock - transaction.quantity;
        await itemRepository.updateItemStock(transaction.item_id, newStock);

        // 🔹 Update status transaksi menjadi "paid"
        const updatedTransaction = await transactionRepository.updateTransactionStatus(id, "paid");

        return baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        console.error("Error processing payment:", error);
        return baseResponse(res, false, 500, "Failed to process payment");
    }
};

exports.deleteTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Periksa apakah transaksi dengan ID ini ada
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found");
        }

        // ✅ Hapus transaksi dari database
        await transactionRepository.deleteTransactionById(id);

        return baseResponse(res, true, 200, "Transaction deleted", transaction);
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return baseResponse(res, false, 500, "Failed to delete transaction");
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactionsWithDetails();

        const formatted = transactions.map((t) => ({
            id: t.id,
            user_id: t.user_id,
            item_id: t.item_id,
            quantity: t.quantity,
            total: t.total,
            status: t.status,
            created_at: t.created_at,
            user: {
                id: t.user_id,
                name: t.user_name,
                email: t.user_email,
                password: t.user_password,
                balance: t.user_balance,
                created_at: t.user_created_at,
            },
            item: {
                id: t.item_id,
                name: t.item_name,
                price: t.item_price,
                stock: t.item_stock,
                image_url: t.item_image_url,
                created_at: t.item_created_at,
            }
        }));

        baseResponse(res, true, 200, "Transactions found", formatted);
    } catch (error) {
        baseResponse(res, false, 500, "Failed to fetch transactions", error);
    }
};