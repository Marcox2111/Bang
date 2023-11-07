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
    private getClientData(client: Socket): { roomID: string; playerName: string } | null {
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

        const {roomID} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(client, 'Room not found');
            return;
        }

        room.forEachPlayer(player => {
            const playerName = player.name;
            const playerSocket = room.getPlayerSocket(playerName);

            if (playerSocket) {
                playerSocket.emit('roomInfo', room.toClient(playerName));
            } else {
                console.error(`No socket found for player ${playerName}`);
            }
        });
    }

    createRoom(clientSocket: Socket, roomID: string, playerName: string,): { success: boolean; message?: string } {
        clientSocket.data = {roomID, playerName};

        if (this.rooms.has(roomID)) {
            return {success: false, message: 'Room already exists'};
        }

        const newPlayer = new Player(roomID, playerName, clientSocket);
        newPlayer.isHost = true;

        const room = new Room(roomID);
        room.addPlayer(newPlayer);
        this.rooms.set(roomID, room);

        clientSocket.join(roomID);
        clientSocket.emit('roomCreated', {roomID, playerName});
        this.emitRoomInfo(clientSocket)
        return {success: true};
    }

    joinRoom(clientSocket: Socket, roomID: string, playerName: string,): { success: boolean; message?: string } {
        clientSocket.data = {roomID, playerName};
        const room = this.rooms.get(roomID);

        if (!room) {
            return {success: false, message: 'Room not found'};
        }

        room.addPlayer(new Player(roomID, playerName, clientSocket));
        clientSocket.join(roomID);
        clientSocket.emit('joinedRoom', {roomID, playerName});
        this.emitRoomInfo(clientSocket)
        return {success: true};
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

    handleReady(clientSocket: Socket): void {
        const clientData = this.getClientData(clientSocket);
        if (!clientData) return;

        const {roomID} = clientData;
        const room = this.rooms.get(roomID);

        if (!room) {
            this.handleError(clientSocket, 'Room not found');
            return;
        }

        room.startGame();
        this.emitRoomInfo(clientSocket)
        clientSocket.emit('startGame');
        clientSocket.to(roomID).emit('startGame');
    }

    // handleStartTurn(clientSocket: Socket): void {
    //     const clientData = this.getClientData(clientSocket);
    //     if (!clientData) return;
    //
    //     const {roomID, playerName} = clientData;
    //     const room = this.rooms.get(roomID);
    //     if (!room) {
    //         this.handleError(clientSocket, 'Room not found');
    //         return;
    //     }
    //     room.startTurnDraw(playerName);
    //     this.emitRoomInfo(clientSocket)
    // }

    handleNext(clientSocket: Socket): void {
        const clientData = this.getClientData(clientSocket);
        if (!clientData) return;

        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(clientSocket, 'Room not found');
            return;
        }
        if (room.nextTurn(playerName)) {
            this.emitRoomInfo(clientSocket);
        }
    }

    handleDiscardCard(clientSocket: Socket, cardID: string): void {
        const clientData = this.getClientData(clientSocket);
        if (!clientData) return;
        const {roomID, playerName} = clientData;
        const room = this.rooms.get(roomID);
        if (!room) {
            this.handleError(clientSocket, 'Room not found');
            return;
        }
        room.discardCard(playerName, cardID)
        this.emitRoomInfo(clientSocket)
    }
}
