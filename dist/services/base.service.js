"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor() { }
    checkFieldsExist(item, fields) {
        return fields.every((field) => item?.hasOwnProperty(field));
    }
}
exports.BaseService = BaseService;
