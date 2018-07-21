"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSockets = function (server) {
    var sockets = server.sockets.sockets;
    return Object.keys(sockets).map(function (key) { return sockets[key]; });
};
exports.getAllUsers = function (socket) {
    var sockets = getSockets(socket);
    return sockets.map(function (_a) {
        var id = _a.id, username = _a.username;
        return ({ id: id, username: username });
    });
};
