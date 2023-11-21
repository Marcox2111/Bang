// Player.ts
import {Schema, type, ArraySchema, filter} from "@colyseus/schema";
import {Card} from './Card';
import {Client} from "@colyseus/core"; // Assuming Card is also a Schema

export class Player extends Schema {

    @type("string") id: string;

    @type("string") name: string;

    @type("boolean") alive: boolean = true;

    @type("boolean") turn: boolean = false;

    @type("boolean") isHost: boolean = false;

    @type("number") range: number = 1;

    @type("number") hp: number;

    @filter(function (this: Player, client: Client, value: Player['role'], root) {
        return !this.alive || client.sessionId === this.id;
    })
    @type("string") role: string = 'unknown';

    @type([Card]) cards: ArraySchema<Card>;


    constructor(playerID: string, playerName: string) {
        super();
        this.id = playerID;
        this.name = playerName;
        this.hp = 5;
        this.cards = new ArraySchema<Card>(); // Initialize the array
    }

    addCards(cards: Card[]) {
        for (let card of cards) {
            this.cards.push(card);
        }
        this.arrangeCards();
    }

    removeCard(cardID: string): Card | undefined {
        const cardIndex = this.cards.findIndex((card) => card.id === cardID);
        if (cardIndex > -1) {
            return this.cards.splice(cardIndex, 1)[0];
        }
    }

    private arrangeCards() {
        this.cards.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Methods like playCard, takeDamage, and takeHeal should be moved to the room logic.
    // You can't have methods in Schema classes that manipulate the state.
    // You would call these methods from the room class where you have access to the player's instance.
}
