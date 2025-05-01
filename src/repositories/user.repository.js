const db = require("../database/pg.database");
const bcrypt = require("bcryptjs");

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

exports.getUserById = async (id) => {
    try {
        console.log("Checking user with ID:", id); // Debugging

        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        console.log("Query result:", res.rows); // Debugging

        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
};

exports.createUser = async (user) => {
    try {
      const hashedPassword = user.password; // ✅ Sudah di-hash dari controller
  
      const res = await db.query(
        "INSERT INTO users (id, name, email, password, balance, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [user.id, user.name, user.email, hashedPassword, user.balance, user.created_at]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  };

exports.updateUserById = async (id, name, email, password) => {
    try {
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [name, email, password, id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing update query:", error);
        throw error;
    }
};

exports.deleteUserById = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing delete query:", error);
        throw error;
    }
};

exports.verifyUserPassword = async (email, password) => {
    try {
        const user = await exports.getUserByEmail(email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password); // 🔹 Cocokkan hash
        return passwordMatch ? user : null;
    } catch (error) {
        console.error("Error verifying password:", error);
        throw error;
    }
};

exports.updateUserById = async (id, name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 🔹 Hash password baru

        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [name, email, hashedPassword, id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error executing update query:", error);
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        const res = await db.query("SELECT id, name, email, balance, created_at FROM users");
        return res.rows;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

exports.updateUserBalance = async (id, newBalance) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
            [newBalance, id]
        );
        return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
        console.error("Error updating balance:", error);
        throw error;
    }
};

exports.updateBalance = async (id, balance) => {
    try {
        await db.query("UPDATE users SET balance = $1 WHERE id = $2", [balance, id]);
    } catch (error) {
        console.error("Error updating user balance:", error);
        throw error;
    }
};