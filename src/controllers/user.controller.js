const userRepository = require("../repositories/user.repository");
const storeRepository = require("../repositories/store.repository");
const itemRepository = require("../repositories/item.repository");
const baseResponse = require("../utils/baseResponse.util");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return baseResponse(res, false, 400, "Email, password, and name are required");
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      balance: 1000000,
      created_at: new Date().toISOString(),
    };

    const createdUser = await userRepository.createUser(newUser);

    const allItems = await itemRepository.getAllItems();
    const lanyardItem = allItems.find(item => item.name.toLowerCase() === "lanyard");
    
    if (lanyardItem) {
      await itemRepository.updateItemStock(lanyardItem.id, 10);
    }    

    return baseResponse(res, true, 201, "User created", createdUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating user", error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return baseResponse(res, false, 400, "Email and password are required");
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }

    delete user.password;
    return baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error logging in");
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving user", error);
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    if (!id || !name || !email || !password) {
      return baseResponse(res, false, 400, "ID, name, email, and password are required");
    }

    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      return baseResponse(res, false, 404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userRepository.updateUserById(id, name, email, hashedPassword);
    return baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user");
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
      return baseResponse(res, false, 404, "User not found");
    }

    await userRepository.deleteUserById(id);
    return baseResponse(res, true, 200, "User deleted", existingUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    if (users.length === 0) {
      return baseResponse(res, false, 404, "No users found");
    }
    return baseResponse(res, true, 200, "Users found", users);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving users", error);
  }
};

exports.topUpBalance = async (req, res) => {
  try {
    const { id, amount } = req.query;
    if (!id || !amount) {
      return baseResponse(res, false, 400, "ID and amount are required");
    }

    const user = await userRepository.getUserById(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found");
    }

    const topUpAmount = parseInt(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      return baseResponse(res, false, 400, "Amount must be larger than 0");
    }

    const newBalance = user.balance + topUpAmount;
    const updatedUser = await userRepository.updateUserBalance(id, newBalance);
    return baseResponse(res, true, 200, "Top up successful", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error processing top-up");
  }
};
