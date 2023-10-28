import {Injectable} from '@nestjs/common';
import {Socket} from 'socket.io';
import {Player} from './objects/player.model';
import {Room} from './objects/room.model';

@Injectable()
export class LobbyService {
    private rooms = new Map<string, Room>();

    private emitRoomInfo(client: Socket) {
        const roomID = client.data.roomID;
        const room = this.rooms.get(roomID);
        const playerName = client.data.playerName;
        if (!room) {
            client.emit('error', {message: 'Room not found'});
            return;
        }
        client.emit('roomInfo', room.toClient(playerName));
    }

    createRoom(client: Socket, roomID: string, playerName: string): { success: boolean; message?: string } {
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

    joinRoom(client: Socket, roomID: string, playerName: string): { success: boolean; message?: string } {
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

    getRoomInfo(client: Socket) {
        this.emitRoomInfo(client);
    }

    removePlayer(client: Socket) {
        const roomID = client.data.roomID;
        const playerName = client.data.playerName;
        const room = this.rooms.get(roomID);

        if (!room) {
            client.emit('error', {message: 'Room not found'});
            return;
        }

        room.removePlayer(playerName);

        if (room.isEmpty()) {
            this.rooms.delete(roomID);
        } else {
            this.emitRoomInfo(client);
        }
    }

    handleReady(client: Socket) {
        const roomID = client.data.roomID;
        const room = this.rooms.get(roomID);

        if (!room) {
            client.emit('error', {message: 'Room not found'});
            return;
        }

        room.startGame();
        client.emit('startGame');
        client.to(roomID).emit('startGame');
    }

    //SONO PIGRO, NON ME NE FOTTE FACCIO TUTTO IN UN UNICO FILE


    handleStartTurn(client: Socket) {
        const roomID = client.data.roomID;
        const playerName = client.data.playerName;
        const room = this.rooms.get(roomID);
        if (!room) {
            client.emit('error', {message: 'Room not found'});
            return;
        }
        room.startTurnDraw(playerName);
        client.emit('playerAction');
        client.to(roomID).emit('playerAction');
    }

    handleNext(client: Socket) {
        this.emitRoomInfo(client)
    }

}
