import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientManagerService } from './client-manager.service';

@WebSocketGateway({ cors: true })
export class InvoiceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly clientManager: ClientManagerService) {}

  handleConnection(client: Socket) {
    client.emit('message', client.id);
    this.clientManager.addClient(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.clientManager.removeClient(client.id);
  }

  @SubscribeMessage('payment-verified')
  handlePaymentVerified(client: Socket, data: any) {
    client.emit('payment-verified', data);
  }
}
