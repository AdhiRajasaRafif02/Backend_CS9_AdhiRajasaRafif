const db = require("../database/pg.database");

exports.getAllStores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

exports.getStoreById = async (store_id) => {
    try {
        const trimmedStoreId = store_id.trim(); // Hapus spasi

        console.log("Searching for store with ID:", trimmedStoreId); // Debugging

        const res = await db.query("SELECT * FROM stores WHERE id = $1", [trimmedStoreId]);
        console.log("Query result:", res.rows); // Debugging

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (id, name, address) VALUES ($1, $2, $3) RETURNING *",
            [store.id, store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

exports.updateStoreById = async (id, name, address) => {
    try {
        console.log("Updating store with ID:", id); // Debugging
        
        const res = await db.query(
            "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
            [name, address, id]
        );

        console.log("Update result:", res.rows); // Debugging
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing update query:", error);
        throw error;
    }
};

exports.deleteStoreById = async (id) => {
    try {
        await db.query("DELETE FROM stores WHERE id = $1", [id]);
    } catch (error) {
        console.error("Error executing delete query:", error);
        throw error;
    }
};

