"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketCustomEventEnum;
(function (SocketCustomEventEnum) {
    SocketCustomEventEnum["SAVE_USERNAME"] = "save username";
    SocketCustomEventEnum["CHANGE_STATE"] = "change state";
    SocketCustomEventEnum["SHAPE_CHANGE"] = "change shape";
    SocketCustomEventEnum["SHAPE_ADD"] = "shape add";
    SocketCustomEventEnum["USER_JOIN"] = "user join";
    SocketCustomEventEnum["USER_LEFT"] = "user left";
    SocketCustomEventEnum["ALL_USERS"] = "all users";
    SocketCustomEventEnum["START_DRAWING"] = "user:start-drawing";
    SocketCustomEventEnum["STOP_DRAWING"] = "user:start-drawing";
})(SocketCustomEventEnum = exports.SocketCustomEventEnum || (exports.SocketCustomEventEnum = {}));
var SocketEventEnum;
(function (SocketEventEnum) {
    SocketEventEnum["CONNECT"] = "connect";
    SocketEventEnum["CONNECTION"] = "connection";
    SocketEventEnum["DISCONNECT"] = "disconnect";
    SocketEventEnum["CONNECT_ERROR"] = "connect_error";
})(SocketEventEnum = exports.SocketEventEnum || (exports.SocketEventEnum = {}));
