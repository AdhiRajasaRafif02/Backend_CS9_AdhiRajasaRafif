const baseResponse = (res, success, status, message, payload = null) => {
    return res.status(status).json({
        success,
        message,
        payload,
    });
};

module.exports = baseResponse;

