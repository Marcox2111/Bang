import {ArraySchema, Schema, type} from "@colyseus/schema";
import {Card} from "./Card";

export class Emporio extends Schema {

    @type([Card]) cards: ArraySchema<Card>;


    constructor() {
        super();
        this.cards = new ArraySchema<Card>(); // Initialize the array
    }

    addCards(cards: Card[]) {
        for (let card of cards) {
            this.cards.push(card);
        }
    }

    removeCard(cardID: string): Card | undefined {
        const cardIndex = this.cards.findIndex((card) => card.id === cardID);
        if (cardIndex > -1) {
            return this.cards.splice(cardIndex, 1)[0];
        }
    }
}
