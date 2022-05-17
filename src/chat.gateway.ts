import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('control')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('control', message);
  }
}
