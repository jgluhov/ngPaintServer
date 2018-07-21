import express from 'express';
import { Server, createServer } from 'http';
import { SocketServer } from './socket';

export class HttpServer {
  public static readonly PORT: number = 80;
  private app: express.Application;
  private server: Server;
  private socketServer: SocketServer;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || HttpServer.PORT;
    this.server = createServer(this.app);
    this.socketServer = new SocketServer(this.server);
    this.setupRoutes();
    this.listen();
  }

  private setupRoutes(): void {
    this.app.get('/', function (req, res) {
      res.send('Socket Server for ngPaint (https://github.com/jgluhov)');
    });
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
