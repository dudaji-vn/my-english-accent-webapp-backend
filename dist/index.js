"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const customResponse_1 = __importDefault(require("./middleware/customResponse"));
const api_router_1 = __importDefault(require("./router/v1/api.router"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://r5200nc8-3000.asse.devtunnels.ms',
        'https://my-english-accent-239fb.web.app',
        'https://techtalk-admin.vercel.app'
    ]
}));
const http = require('http').createServer(app);
// Routes
app.use(function (req, res, next) {
    res = (0, customResponse_1.default)(res);
    next();
});
app.get('/', (req, res) => {
    return res.success('Hello');
});
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
app.use('/api', api_router_1.default);
const mongoUrl = process.env.MONGODB_URL;
if (mongoUrl) {
    mongoose_1.default
        .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
        console.log('Connected to mongo');
    })
        .catch((err) => {
        console.log(err);
    });
}
const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log('Server is running on port', port);
});
module.exports = app;
