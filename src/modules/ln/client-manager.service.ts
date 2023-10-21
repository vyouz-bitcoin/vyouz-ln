// client-manager.service.ts

import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientManagerService {
  private connectedClients = new Map<string, Socket>();

  addClient(clientId: string, client: Socket) {
    this.connectedClients.set(clientId, client);
  }

  removeClient(clientId: string) {
    this.connectedClients.delete(clientId);
  }

  getClient(clientId: string): Socket | undefined {
    return this.connectedClients.get(clientId);
  }
}
