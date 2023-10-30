import {Player} from "./player.model";
import {Deck} from "./deck.model";
import {RoomType} from "../../../shared/types";

export class Room {
    readonly id: string;
    private players: Player[] = []; // initialize here, type inferred
    private deck = new Deck(); // initialize here, type inferred
    private currentPlayerIndex = 0; // initialize here, type inferred

    constructor(roomID: string) {
        this.id = roomID;
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
                    player.name === playerName || player.role === "Sheriff"
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

    assignRoles() {
        const numPlayers = this.players.length; // Changed from this.players.size to this.players.length
        let roles: string[];

        switch (numPlayers) {
            case 1:
                roles = ["Sheriff"];
                break;
            case 2:
                roles = ["Sheriff", "Renegade"];
                break;
            case 3:
                roles = ["Sheriff", "Renegade", "Outlaw"];
                break;
            case 4:
                roles = ["Sheriff", "Renegade", "Outlaw", "Outlaw"];
                break;
            case 5:
                roles = ["Sheriff", "Renegade", "Outlaw", "Outlaw", "Deputy"];
                break;
            case 6:
                roles = ["Sheriff", "Renegade", "Outlaw", "Outlaw", "Outlaw", "Deputy"];
                break;
            case 7:
                roles = [
                    "Sheriff",
                    "Renegade",
                    "Outlaw",
                    "Outlaw",
                    "Outlaw",
                    "Deputy",
                    "Deputy",
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
            if (roles[index] === "Sheriff") {
                this.currentPlayerIndex = index;
                player.turn = true;
            }
        });
    }

    startGame() {
        this.assignRoles();
        this.distributeCards();
    }

    distributeCards() {
        this.players.forEach((player, index) => {
            const nCards = player.hp + (player.role === "Sheriff" ? 1 : 0);
            this.drawCards(player, nCards);
        });
    }

    startTurnDraw(playerName) {
        const player = this.players.find((player) => player.name === playerName);
        this.drawCards(player, 2);
    }

    drawCards(player: Player, numberOfCards: number) {
        const cards = this.deck.deal(numberOfCards);
        player.addCards(cards);
    }

    nextTurn() {
        // Set current player's turn to false
        this.players[this.currentPlayerIndex].turn = false;

        // Move to the next player
        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;

        // Set the new current player's turn to true
        this.players[this.currentPlayerIndex].turn = true;
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
