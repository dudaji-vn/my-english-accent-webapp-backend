"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function customResponse(res) {
    // Add a success method
    res.success = function (data) {
        return res.status(200).json({
            status: 'success',
            data: data
        });
    };
    // Add an error method
    res.error = function (statusCode = 500, message, messageDetail = '') {
        return res.status(statusCode || 500).json({
            status: 'error',
            message: message || 'Internal Server Error',
            messageDetail: messageDetail
        });
    };
    // Return the modified response object
    return res;
}
exports.default = customResponse;
