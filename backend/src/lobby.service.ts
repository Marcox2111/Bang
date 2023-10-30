import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Player} from './objects/player.model';
import {Room} from './objects/room.model';

@Injectable()
export class LobbyService {
    private rooms = new Map<string, Room>();

    // Helper function to handle errors
    private handleError(client: Socket, message: string): void {
        client.emit('error', {message});
    }

    // Helper function to get client data
    private getClientData(
        client: Socket,
    ): { roomID: string; playerName: string } | null {
        const {roomID, playerName} = client.data;
        if (!roomID || !playerName) {
            this.handleError(client, 'Invalid client data');
            return null;
        }
        return {roomID, playerName};
    }

    // Emit room info to a client
    private emitRoomInfo(client: Socket): void {
        const clientData = this.getClientData(client);
        if (!clientData) return;

        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }
        client.emit('roomInfo', room.toClient(playerName));
    }

    createRoom(
        client: Socket,
        roomID: string,
        playerName: string,
    ): { success: boolean; message?: string } {
        client.data = {roomID, playerName};

        if (this.rooms.has(roomID)) {
            return {success: false, message: 'Room already exists'};
        }

        const newPlayer = new Player(roomID, playerName);
        newPlayer.isHost = true;

        const room = new Room(roomID);
        room.addPlayer(newPlayer);
        this.rooms.set(roomID, room);

        client.join(roomID);
        client.emit('roomCreated', {roomID, playerName});
        return {success: true};
    }

    joinRoom(
        client: Socket,
        roomID: string,
        playerName: string,
    ): { success: boolean; message?: string } {
        client.data = {roomID, playerName};
        const room = this.rooms.get(roomID);

        if (!room) {
            return {success: false, message: 'Room not found'};
        }

        room.addPlayer(new Player(roomID, playerName));
        client.join(roomID);
        client.emit('joinedRoom', {roomID, playerName});
        client.to(roomID).emit('playerJoined');
        return {success: true};
    }

    getRoomInfo(client: Socket): void {
        this.emitRoomInfo(client);
    }

    removePlayer(client: Socket): void {
        const clientData = this.getClientData(client);
        if (!clientData) return;

        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);

        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }

        room.removePlayer(playerName);

        if (room.isEmpty()) {
            this.rooms.delete(roomID);
        } else {
            this.emitRoomInfo(client);
        }
    }

    handleReady(client: Socket): void {
        const clientData = this.getClientData(client);
        if (!clientData) return;

        const {roomID} = clientData;
        const room = this.rooms.get(roomID);

        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }

        room.startGame();
        client.emit('startGame');
        client.to(roomID).emit('startGame');
    }

    handleStartTurn(client: Socket): void {
        const clientData = this.getClientData(client);
        if (!clientData) return;

        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }
        room.startTurnDraw(playerName);
        client.emit('playerAction');
        client.to(roomID).emit('playerAction');
    }

    handleNext(client: Socket): void {
        const clientData = this.getClientData(client);
        if (!clientData) return;

        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }
        room.nextTurn();
        client.emit('playerAction');
        client.to(roomID).emit('playerAction');
    }
}
