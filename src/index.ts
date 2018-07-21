import 'core-js';
import { HttpServer } from './http';

const app = new HttpServer().getApp();

export {
  app
};
