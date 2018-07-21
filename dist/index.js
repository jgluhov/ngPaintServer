"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js");
var http_1 = require("./http");
var app = new http_1.HttpServer().getApp();
exports.app = app;
