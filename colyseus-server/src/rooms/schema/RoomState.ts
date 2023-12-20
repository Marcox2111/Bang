// RoomState.ts
import {Schema, ArraySchema, type} from "@colyseus/schema";
import {Player} from "./Player";
import {Deck} from "./Deck"; // Make sure this path is correct
import {Emporio} from "./Emporio"; // Make sure this path is correct

export class RoomState extends Schema {
    @type([Player]) players: ArraySchema<Player>;
    @type(Deck) deck: Deck
    @type(Emporio) emporio: Emporio

    constructor() {
        super();
        this.players = new ArraySchema<Player>();
        this.deck = new Deck();
        this.emporio = new Emporio();
    }

    createPlayer(playerID: string, playerName: string): Player {
        // Create a new player instance
        const newPlayer = new Player(playerID, playerName);
        // Add the new player to the players array
        this.players.push(newPlayer);
        return newPlayer;
    }

    removePlayer(playerID: string): void {
        // Remove the player with the given session ID from the players array
        this.players = this.players.filter(player => player.id !== playerID);
    }


    // ... any other methods you need for managing players or game state
}
