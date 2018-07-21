"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_1 = require("./socket");
var cors_1 = __importDefault(require("cors"));
var HttpServer = (function () {
    function HttpServer() {
        this.app = express_1.default();
        this.port = process.env.PORT || HttpServer.PORT;
        this.server = http_1.createServer(this.app);
        this.socketServer = new socket_1.SocketServer(this.server);
        this.setupRoutes();
        this.listen();
    }
    HttpServer.prototype.setupRoutes = function () {
        this.app.use(cors_1.default());
        this.app.get('/', function (req, res) {
            res.send('Socket Server for ngPaint (https://github.com/jgluhov)');
        });
    };
    HttpServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
    };
    HttpServer.prototype.getApp = function () {
        return this.app;
    };
    HttpServer.PORT = 8080;
    return HttpServer;
}());
exports.HttpServer = HttpServer;
