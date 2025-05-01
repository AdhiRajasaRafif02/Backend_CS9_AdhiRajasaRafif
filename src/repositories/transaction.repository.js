const db = require("../database/pg.database");

exports.createTransaction = async (trx) => {
    const query = `
        INSERT INTO transactions (id, user_id, item_id, quantity, total, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;

    const values = [
        trx.id,
        trx.user_id,
        trx.item_id,
        trx.quantity,
        trx.total,
        trx.status,
        trx.created_at,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error fetching transaction:", error);
        throw error;
    }
};

exports.updateTransactionStatus = async (id, status) => {
    try {
        const res = await db.query(
            "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error updating transaction status:", error);
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error fetching transaction by ID:", error);
        throw error;
    }
};

// ✅ Hapus transaksi berdasarkan ID
exports.deleteTransactionById = async (id) => {
    try {
        await db.query("DELETE FROM transactions WHERE id = $1", [id]);
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
};

exports.getAllTransactionsWithDetails = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*, 
                u.name AS user_name, u.email AS user_email, u.password AS user_password, u.balance AS user_balance, u.created_at AS user_created_at,
                i.name AS item_name, i.price AS item_price, i.stock AS item_stock, i.image_url AS item_image_url, i.created_at AS item_created_at
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
        `);

        return res.rows;
    } catch (error) {
        console.error("Error fetching transactions with details:", error);
        throw error;
    }
};