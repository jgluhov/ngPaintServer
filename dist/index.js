"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
const app = new http_1.HttpServer().getApp();
exports.app = app;
