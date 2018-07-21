"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSockets = (server) => {
    const sockets = server.sockets.sockets;
    return Object.keys(sockets).map((key) => sockets[key]);
};
exports.getAllUsers = (socket) => {
    const sockets = getSockets(socket);
    return sockets.map(({ id, username }) => ({ id, username }));
};
