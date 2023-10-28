import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Inject, Logger} from '@nestjs/common';
import {LobbyService} from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() wss: Server;
    private logger: Logger = new Logger('LobbyGateway');

    constructor(@Inject(LobbyService) private readonly lobbyService: LobbyService) {
    }

    afterInit(server: any) {
        this.logger.log('Initialized!');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.lobbyService.removePlayer(client);
    }

    @SubscribeMessage('createRoom')
    handleRoomCreation(client: Socket, data: { roomID: string; playerName: string }): void {
        const result = this.lobbyService.createRoom(client, data.roomID, data.playerName);
        if (result.success) {
            this.logger.debug(`Room created: ${data.roomID}`);
        } else {
            client.emit('error', {message: result.message});
        }
    }

    @SubscribeMessage('joinRoom')
    handleRoomJoin(client: Socket, data: { roomID: string; playerName: string }) {
        const result = this.lobbyService.joinRoom(client, data.roomID, data.playerName);
        if (result.success) {
            this.logger.debug(`Joined room: ${data.roomID}`);
        } else {
            client.emit('error', {message: result.message});
        }
    }

    @SubscribeMessage('requestRoomInfo')
    handleRoomInfoRequest(client: Socket) {
        this.lobbyService.getRoomInfo(client);
    }

    @SubscribeMessage('ready')
    handleReady(client: Socket) {
        this.lobbyService.handleReady(client);
    }

    //SONO PIGRO, NON ME NE FOTTE FACCIO TUTTO IN UN UNICO FILE, DA QUI PARTE IL GIOCO

    @SubscribeMessage('startTurnDraw')
    handleStartTurn(client:Socket){
        this.lobbyService.handleStartTurn(client)
    }

    @SubscribeMessage('passTurn')
    handleNextTurn(client:Socket){
        this.lobbyService.handleNext(client)
    }
}
