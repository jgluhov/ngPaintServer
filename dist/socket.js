"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const rxjs_1 = require("rxjs");
const events_1 = require("./events");
const operators_1 = require("rxjs/operators");
const utilities_1 = require("./utilities");
class SocketServer {
    constructor(httpServer) {
        this.httpServer = httpServer;
        this.listen = (event) => {
            return this.connection$
                .pipe(operators_1.mergeMap(({ server, client }) => rxjs_1.fromEvent(client, event)
                .pipe(operators_1.takeUntil(rxjs_1.fromEvent(client, events_1.SocketEventEnum.DISCONNECT)), operators_1.map((data) => ({ server, client, data })))));
        };
        this.handleSaveUsername = ({ server, client, data }) => {
            server.sockets.sockets[client.id].username = data;
            client.emit(events_1.SocketCustomEventEnum.ALL_USERS, utilities_1.getAllUsers(server));
            client.broadcast.emit(events_1.SocketCustomEventEnum.USER_JOIN, {
                id: client.id,
                username: data
            });
        };
        this.handleChangeState = ({ server, client, data }) => {
            const message = {
                id: client.id,
                message: data
            };
            client.emit(events_1.SocketCustomEventEnum.CHANGE_STATE, message);
            client.broadcast.emit(events_1.SocketCustomEventEnum.CHANGE_STATE, message);
        };
        this.handleAddShape = ({ server, client, data }) => {
            const message = {
                id: client.id,
                message: data
            };
            client.broadcast.emit(events_1.SocketCustomEventEnum.SHAPE_ADD, message);
        };
        this.handleChangeShape = ({ server, client, data }) => {
            const message = {
                id: client.id,
                message: data
            };
            client.broadcast.emit(events_1.SocketCustomEventEnum.SHAPE_CHANGE, message);
        };
        this.handleUserLeft = (client) => {
            client.broadcast.emit(events_1.SocketCustomEventEnum.USER_LEFT, {
                id: client.id
            });
        };
        this.io$ = rxjs_1.of(socket_io_1.default(httpServer));
        this.connection$ = this.io$
            .pipe(operators_1.switchMap((server) => rxjs_1.fromEvent(server, events_1.SocketEventEnum.CONNECTION)
            .pipe(operators_1.map((client) => ({ server, client })))));
        this.disconnect$ = this.connection$
            .pipe(operators_1.mergeMap(({ server, client }) => rxjs_1.fromEvent(client, events_1.SocketEventEnum.DISCONNECT)
            .pipe(operators_1.mapTo(client))));
        this.listen(events_1.SocketCustomEventEnum.SAVE_USERNAME).subscribe(this.handleSaveUsername);
        this.listen(events_1.SocketCustomEventEnum.CHANGE_STATE).subscribe(this.handleChangeState);
        this.listen(events_1.SocketCustomEventEnum.SHAPE_ADD).subscribe(this.handleAddShape);
        this.listen(events_1.SocketCustomEventEnum.SHAPE_CHANGE).subscribe(this.handleChangeShape);
        this.disconnect$.subscribe(this.handleUserLeft);
    }
}
exports.SocketServer = SocketServer;
