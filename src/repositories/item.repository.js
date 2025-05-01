const db = require("../database/pg.database");

exports.getItemsByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1 ORDER BY created_at DESC", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error fetching items by store_id:", error);
        throw error;
    }
};

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items ORDER BY created_at DESC");
        return res.rows;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};

exports.getItemById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error fetching item by ID:", error);
        throw error;
    }
};

exports.updateItem = async (id, name, price, store_id, image_url, stock) => {
    try {
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
            [name, price, store_id, image_url, stock, id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error updating item:", error);
        throw error;
    }
};

exports.deleteItem = async (id) => {
    try {
        await db.query("DELETE FROM items WHERE id = $1", [id]);
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};

exports.createItem = async (name, price, store_id, image_url, stock) => {
    try {
        const res = await db.query(
            "INSERT INTO items (id, name, price, store_id, image_url, stock, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW()) RETURNING *",
            [name, price, store_id, image_url, stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    }
};

exports.updateItemStock = async (id, stock) => {
    try {
        await db.query("UPDATE items SET stock = $1 WHERE id = $2", [stock, id]);
    } catch (error) {
        console.error("Error updating item stock:", error);
        throw error;
    }
};