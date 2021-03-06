"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var rxjs_1 = require("rxjs");
var events_1 = require("./events");
var operators_1 = require("rxjs/operators");
var utilities_1 = require("./utilities");
var SocketServer = (function () {
    function SocketServer(httpServer) {
        var _this = this;
        this.httpServer = httpServer;
        this.listen = function (event) {
            return _this.connection$
                .pipe(operators_1.mergeMap(function (_a) {
                var server = _a.server, client = _a.client;
                return rxjs_1.fromEvent(client, event)
                    .pipe(operators_1.takeUntil(rxjs_1.fromEvent(client, events_1.SocketEventEnum.DISCONNECT)), operators_1.map(function (data) { return ({ server: server, client: client, data: data }); }));
            }));
        };
        this.handleSaveUsername = function (_a) {
            var server = _a.server, client = _a.client, data = _a.data;
            server.sockets.sockets[client.id].username = data;
            client.emit(events_1.SocketCustomEventEnum.ALL_USERS, utilities_1.getAllUsers(server));
            client.broadcast.emit(events_1.SocketCustomEventEnum.USER_JOIN, {
                id: client.id,
                username: data
            });
        };
        this.handleChangeState = function (_a) {
            var server = _a.server, client = _a.client, data = _a.data;
            var message = {
                id: client.id,
                message: data
            };
            client.emit(events_1.SocketCustomEventEnum.CHANGE_STATE, message);
            client.broadcast.emit(events_1.SocketCustomEventEnum.CHANGE_STATE, message);
        };
        this.handleAddShape = function (_a) {
            var server = _a.server, client = _a.client, data = _a.data;
            var message = {
                id: client.id,
                message: data
            };
            client.broadcast.emit(events_1.SocketCustomEventEnum.SHAPE_ADD, message);
        };
        this.handleChangeShape = function (_a) {
            var server = _a.server, client = _a.client, data = _a.data;
            var message = {
                id: client.id,
                message: data
            };
            client.broadcast.emit(events_1.SocketCustomEventEnum.SHAPE_CHANGE, message);
        };
        this.handleUserLeft = function (client) {
            client.broadcast.emit(events_1.SocketCustomEventEnum.USER_LEFT, {
                id: client.id
            });
        };
        this.io$ = rxjs_1.of(socket_io_1.default(httpServer));
        this.connection$ = this.io$
            .pipe(operators_1.switchMap(function (server) { return rxjs_1.fromEvent(server, events_1.SocketEventEnum.CONNECTION)
            .pipe(operators_1.map(function (client) { return ({ server: server, client: client }); })); }));
        this.disconnect$ = this.connection$
            .pipe(operators_1.mergeMap(function (_a) {
            var server = _a.server, client = _a.client;
            return rxjs_1.fromEvent(client, events_1.SocketEventEnum.DISCONNECT)
                .pipe(operators_1.mapTo(client));
        }));
        this.listen(events_1.SocketCustomEventEnum.SAVE_USERNAME).subscribe(this.handleSaveUsername);
        this.listen(events_1.SocketCustomEventEnum.CHANGE_STATE).subscribe(this.handleChangeState);
        this.listen(events_1.SocketCustomEventEnum.SHAPE_ADD).subscribe(this.handleAddShape);
        this.listen(events_1.SocketCustomEventEnum.SHAPE_CHANGE).subscribe(this.handleChangeShape);
        this.disconnect$.subscribe(this.handleUserLeft);
    }
    return SocketServer;
}());
exports.SocketServer = SocketServer;
