const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await storeRepository.getStoreById(id);

        if (!store) {
            return baseResponse(res, false, 404, "Store not found");
        }

        baseResponse(res, true, 200, "Store found", store);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving store", error);
    }
};

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Name and address are required");
    }

    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.updateStoreById = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body); // Debugging
        
        const { id, name, address } = req.body;

        if (!id || !name || !address) {
            return baseResponse(res, false, 400, "ID, name, and address are required");
        }

        const existingStore = await storeRepository.getStoreById(id);
        console.log("Existing store:", existingStore); // Debugging
        
        if (!existingStore) {
            return baseResponse(res, false, 404, "Store not found");
        }

        const updatedStore = await storeRepository.updateStoreById(id, name, address);
        baseResponse(res, true, 200, "Store updated", updatedStore);
    } catch (error) {
        console.error("Error updating store:", error);
        baseResponse(res, false, 500, "Error updating store", error);
    }
};

exports.deleteStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting store with ID:", id); // Debugging

        const existingStore = await storeRepository.getStoreById(id);
        if (!existingStore) {
            return baseResponse(res, false, 404, "Store not found");
        }

        await storeRepository.deleteStoreById(id);
        baseResponse(res, true, 200, "Store deleted", existingStore);
    } catch (error) {
        console.error("Error deleting store:", error);
        baseResponse(res, false, 500, "Error deleting store", error);
    }
};


