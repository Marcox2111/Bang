// GameRoom.ts
import {Room, Client} from "@colyseus/core";
import {RoomState} from "./schema/RoomState";
import {machine} from "./StateMachine"
import {interpret} from "xstate";

interface JoinOptions {
    name: string;
}

export class GameRoom extends Room<RoomState> {
    maxClients = 7;
    gameService: any;

    onCreate(options: any) {
        this.setState(new RoomState());

        // Instantiate the state machine for this game room
        this.gameService = interpret(
            machine.withContext({
                room: this
            })
        );

        // Start the state machine
        this.gameService.start();

        this.registerMessages();
    }

    registerMessages() {
        this.onMessage("start", (client) => {
            const player = this.state.players.find(p => p.id === client.sessionId);

            if (!player) {
                console.log("ERROR: message coming from invalid player.")
                return;
            }
            if (!player.isHost) {
                console.log("ERROR: message coming from a nonHost player");
                return;
            }
            console.log("start")
            this.gameService.send('START_GAME')
        })

        this.onMessage("*", (client, type, value) => {
            const player = this.state.players.find(p => p.id === client.sessionId);

            if (!player) {
                console.log("ERROR: message coming from invalid player.")
                return;
            }

            if (!player.alive || !player.turn) {
                return;
            }

            // Now that we have the player, we can handle the message
            switch (type) {
                case "hello":
                    console.log("test", type)
                    break;
                // Add more cases as needed for other message types
                default:
                    console.warn("Received unrecognized message type:", type);
            }

        })
    }

    onJoin(client: Client, options: JoinOptions) {
        const isFirstPlayer = this.clients.length === 1; // If this is the first client, they are the host

        const player = this.state.createPlayer(client.sessionId, options.name);
        if (isFirstPlayer) {
            player.isHost = true; // Set the host flag for the first player
        }
        console.log(client.sessionId, "joined!", isFirstPlayer ? "as host" : "");
    }

    onLeave(client: Client, consented: boolean) {
        this.state.removePlayer(client.sessionId);
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    assignRolesToPlayers(){
        const numPlayers = this.state.players.length;
        let roles: string[];

        switch (numPlayers) {
            case 1:
                roles = ["sceriffo"];
                break;
            case 2:
                roles = ["sceriffo", "rinnegato"];
                break;
            case 3:
                roles = ["sceriffo", "rinnegato", "fuorilegge"];
                break;
            case 4:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge"];
                break;
            case 5:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge", "vice"];
                break;
            case 6:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge", "fuorilegge", "vice"];
                break;
            case 7:
                roles = [
                    "sceriffo",
                    "rinnegato",
                    "fuorilegge",
                    "fuorilegge",
                    "fuorilegge",
                    "vice",
                    "vice",
                ];
                break;
            default:
                throw new Error("Invalid number of players for role assignment");
        }

        // Shuffle roles
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // Assign shuffled roles to players
        this.state.players.forEach((player, index) => {
            player.role = roles[index];
            if (roles[index] === "sceriffo") {
                player.turn = true;
            }
        });
        this.gameService.send('ROLES_ASSIGNED');

    }


}
