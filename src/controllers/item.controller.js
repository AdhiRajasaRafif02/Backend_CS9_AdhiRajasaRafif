const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createItem = async (req, res) => {
    try {
        let { name, price, store_id, stock } = req.body;
        stock = parseInt(stock) || 10;
        const image = req.file ? req.file.path : null;

        if (!name || !price || !store_id) {
            return baseResponse(res, false, 400, "Name, price, and store_id are required");
        }

        const store = await storeRepository.getStoreById(store_id);
        if (!store) {
            return baseResponse(res, false, 404, "Store doesn't exist");
        }

        const newItem = await itemRepository.createItem(name, price, store_id, image, stock);
        return baseResponse(res, true, 201, "Item created", newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        return baseResponse(res, false, 500, "Failed to create item");
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;
        const image = req.file ? req.file.path : null;

        if (!id || !name || !price || !store_id || !stock) {
            return baseResponse(res, false, 400, "All fields are required");
        }

        const existingItem = await itemRepository.getItemById(id);
        if (!existingItem) {
            return baseResponse(res, false, 404, "Item not found");
        }

        const store = await storeRepository.getStoreById(store_id);
        if (!store) {
            return baseResponse(res, false, 404, "Store doesn't exist");
        }

        const updatedItem = await itemRepository.updateItem(
            id, name, price, store_id, image || existingItem.image_url, stock
        );
        return baseResponse(res, true, 200, "Item updated", updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        return baseResponse(res, false, 500, "Failed to update item");
    }
};

exports.getItemsByStoreId = async (req, res) => {
    try {
        const { store_id } = req.params;
        const store = await storeRepository.getStoreById(store_id);
        if (!store) {
            return baseResponse(res, false, 404, "Store doesn't exist");
        }
        const items = await itemRepository.getItemsByStoreId(store_id);
        return baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        console.error("Error fetching items by store_id:", error);
        return baseResponse(res, false, 500, "Failed to fetch items");
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        if (items.length === 0) {
            return baseResponse(res, false, 404, "No items found");
        }
        return baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        console.error("Error getting items:", error);
        return baseResponse(res, false, 500, "Failed to get items");
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemRepository.getItemById(id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found");
        }
        return baseResponse(res, true, 200, "Item found", item);
    } catch (error) {
        console.error("Error fetching item:", error);
        return baseResponse(res, false, 500, "Failed to fetch item");
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const existingItem = await itemRepository.getItemById(id);
        if (!existingItem) {
            return baseResponse(res, false, 404, "Item not found");
        }

        await itemRepository.deleteItem(id);
        return baseResponse(res, true, 200, "Item deleted", existingItem);
    } catch (error) {
        console.error("Error deleting item:", error);
        return baseResponse(res, false, 500, "Failed to delete item");
    }
};