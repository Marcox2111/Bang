import {Card} from "./Card";
import {ArraySchema, Schema, type} from "@colyseus/schema";

export class Deck extends Schema {

    private _cards: ArraySchema<Card> = new ArraySchema<Card>();


    @type("number")
    public cardCount: number = 0;

    constructor() {
        super();
        this.initializeDeck();
    }

    initializeDeck() {
        // This can be as sophisticated as needed.
        // It could involve random card generation, predefined card sequences, etc.
        this.createCards("bang", 15);
        this.createCards("birra", 5);
        this.createCards("saloon", 2);
        this.createCards("gatling", 3);
        this.createCards("panico", 3);

        // Shuffle the deck
        this.shuffle();

        // Update the card count
        this.cardCount = this._cards.length;
    }

    createCard(name: string, owner: string): Card {
        return new Card(name, owner);
    }

    createCards(name: string, quantity: number) {
        for (let i = 0; i < quantity; i++) {
            // Since the cards are in the deck, we'll set their owner to an empty string for now
            this._cards.push(this.createCard(name, "deck"));
        }
    }

    shuffle() {
        // Shuffle the cards in the deck
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }

    deal(numberOfCards: number, owner: string): ArraySchema<Card> {
        const dealtCards = new ArraySchema<Card>();
        for (let i = 0; i < numberOfCards; i++) {
            if (this._cards.length > 0) {
                const card = this._cards.shift();
                card.owner = owner
                dealtCards.push(card);
            }
        }
        this.cardCount = this._cards.length; // Update the card count after dealing
        return dealtCards;
    }
}
