"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_1 = require("./socket");
class HttpServer {
    constructor() {
        this.app = express_1.default();
        this.port = process.env.PORT || HttpServer.PORT;
        this.server = http_1.createServer(this.app);
        this.socketServer = new socket_1.SocketServer(this.server);
        this.setupRoutes();
        this.listen();
    }
    setupRoutes() {
        this.app.get('/', function (req, res) {
            res.send('Socket Server for ngPaint (https://github.com/jgluhov)');
        });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
    }
    getApp() {
        return this.app;
    }
}
HttpServer.PORT = 8080;
exports.HttpServer = HttpServer;
