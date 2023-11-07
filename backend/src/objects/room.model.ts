import {Player} from "./player.model";
import {Deck} from "./deck.model";
import {RoomType} from "../../../shared/types";
import {DiscardDeck} from "./discarddeck.model";
import {machine} from "./gamemachine.model"
import {Socket} from "socket.io";
import {interpret} from "xstate";

export class Room {
    readonly id: string;
    private players: Player[] = []; // initialize here, type inferred
    private deck = new Deck(); // initialize here, type inferred
    private discarddeck = new DiscardDeck();
    private service;
    private startPlayerIndex;

    constructor(roomID: string) {
        this.id = roomID;
        this.id = roomID;
        this.service = interpret(
            machine.withContext({
                room: this,  // set room property to this Room instance
                currentPlayerIndex: 0  // set initial currentPlayerIndex
            })
        )
            .onTransition((state) => {
                console.log('Transitioned to state:', state.value);
            })
            .start();
    }

    startGame() {
        this.service.send('START_GAME');
    }

    assignRoles() {
        const numPlayers = this.players.length; // Changed from this.players.size to this.players.length
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
        this.players.forEach((player, index) => {
            player.role = roles[index];
            if (roles[index] === "sceriffo") {
                player.turn = true;
                this.startPlayerIndex = index;
            }
        });
        this.service.send('ROLES_ASSIGNED');
    }

    distributeCards() {
        this.players.forEach((player, index) => {
            const nCards = player.hp + (player.role === "sceriffo" ? 1 : 0);
            this.drawCards(player, nCards);
        });
        console.log("ciao")
        this.service.send('CARDS_DISTRIBUTED');
    }

    getStartPlayerIndex() {
        return this.startPlayerIndex;
    }

    startTurnDraw(player: Player) {
        this.drawCards(player, 2);
        this.service.send('RESOLVE_FIRST_DRAW');
    }

    forEachPlayer(callback: (player: Player) => void): void {
        this.players.forEach(callback);
    }

    getPlayerSocket(playerName: string): Socket | null {
        const player = this.players.find(p => p.name === playerName);
        return player ? player.socket : null;
    }

    toClient(playerName: string): RoomType {
        return {
            id: this.id,
            players: this.players.map((player) => ({
                id: player.id,
                isHost: player.isHost,
                name: player.name,
                range: player.range,
                turn: player.turn,
                cards:
                    player.name === playerName
                        ? player.cards.map((card) => ({
                            id: card.id,
                            name: card.name,
                            target: card.target,
                        }))
                        : player.cards.map((card) => ({
                            id: card.id,
                            name: "hidden",
                            target: null,
                        })),
                character: null,
                hp: player.hp,
                role:
                    player.name === playerName || player.role === "sceriffo"
                        ? player.role
                        : null,
            })),
        };
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    removePlayer(playerName: string): void {
        const playerIndex = this.players.findIndex(
            (player) => player.name === playerName,
        );
        if (playerIndex !== -1) {
            this.players.splice(playerIndex, 1);
        }
    }

    isEmpty(): boolean {
        return this.players.length === 0;
    }

    drawCards(player: Player, numberOfCards: number) {
        const cards = this.deck.deal(numberOfCards);
        player.addCards(cards);
    }

    discardCard(playerName: string, cardID: string) {
        const player = this.players.find((player) => player.name === playerName);
        this.discarddeck.cards.push(player.removeCard(cardID))
    }

    nextTurn(playerName: string): boolean {
        this.service.send('PASS_TURN')
        return true;
    }

    isPlayerInRange(player: Player, target: Player) {
        const playerIndex = this.players.indexOf(player);
        const targetIndex = this.players.indexOf(target);
        const directDistance = Math.abs(playerIndex - targetIndex);
        const circularDistance = this.players.length - directDistance;
        const actualDistance = Math.min(directDistance, circularDistance);
        return actualDistance <= player.range;
    }
}
