import { Server } from 'http';
import io from 'socket.io';
import { fromEvent, of, Observable } from 'rxjs';
import { SocketEventEnum, SocketCustomEventEnum } from './events';
import { switchMap, mergeMap, mapTo, map, takeUntil } from 'rxjs/operators';
import { getAllUsers } from './utilities';
import { UserStates } from './models/user.model';

export type SocketIOServer = SocketIO.Server & NodeJS.EventEmitter;
export type SocketIOClient = SocketIO.Socket & { username: string };

interface SocketIOConnect {
  server: SocketIOServer;
  client: SocketIOClient;
}

interface SocketIOListener<T> extends SocketIOConnect {
  data: T;
}

export class SocketServer {
  private io$: Observable<SocketIO.Server>;
  private connection$: Observable<SocketIOConnect>;
  private disconnect$: Observable<SocketIOClient>;

  constructor(private httpServer: Server) {
    this.io$ = of(io(httpServer));

    this.connection$ = this.io$
      .pipe(
        switchMap((server: SocketIOServer) => fromEvent(server, SocketEventEnum.CONNECTION)
          .pipe(map((client: SocketIOClient) => ({server, client}))))
      );

    this.disconnect$ = this.connection$
      .pipe(
        mergeMap(({server, client}: SocketIOConnect) => fromEvent(client, SocketEventEnum.DISCONNECT)
          .pipe(mapTo(client))
      ));

    this.listen<string>(SocketCustomEventEnum.SAVE_USERNAME).subscribe(this.handleSaveUsername);
    this.listen<UserStates>(SocketCustomEventEnum.CHANGE_STATE).subscribe(this.handleChangeState);
    this.listen(SocketCustomEventEnum.SHAPE_ADD).subscribe(this.handleAddShape);
    this.listen(SocketCustomEventEnum.SHAPE_CHANGE).subscribe(this.handleChangeShape);
    this.disconnect$.subscribe(this.handleUserLeft);
  }

  private listen = <T>(event: string): Observable<SocketIOListener<T>> => {
    return this.connection$
      .pipe(
        mergeMap(({server, client}: SocketIOConnect) => fromEvent(client, event)
          .pipe(
            takeUntil(fromEvent(client, SocketEventEnum.DISCONNECT)),
            map((data: T) => ({ server, client, data })
          )
      ))
    );
  }

  private handleSaveUsername = ({server, client, data}: SocketIOListener<string>): void => {
    (<SocketIOClient>server.sockets.sockets[client.id]).username = data;
    client.emit(SocketCustomEventEnum.ALL_USERS, getAllUsers(server));
    client.broadcast.emit(SocketCustomEventEnum.USER_JOIN, {
      id: client.id,
      username: data
    });
  }

  private handleChangeState = ({server, client, data}: SocketIOListener<UserStates>): void => {
    const message = {
      id: client.id,
      message: data
    };

    client.emit(SocketCustomEventEnum.CHANGE_STATE, message);
    client.broadcast.emit(SocketCustomEventEnum.CHANGE_STATE, message);
  }

  private handleAddShape = ({server, client, data}: SocketIOListener<object>): void => {
    const message = {
      id: client.id,
      message: data
    };

    client.broadcast.emit(SocketCustomEventEnum.SHAPE_ADD, message);
  }

  private handleChangeShape =  ({server, client, data}: SocketIOListener<object>): void => {
    const message = {
      id: client.id,
      message: data
    };

    client.broadcast.emit(SocketCustomEventEnum.SHAPE_CHANGE, message);
  }

  private handleUserLeft = (client: SocketIOClient): void => {
    client.broadcast.emit(SocketCustomEventEnum.USER_LEFT, {
      id: client.id
    });
  }
}
