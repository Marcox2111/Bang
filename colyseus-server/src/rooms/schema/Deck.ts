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
        this.createCards("bang", 1);
        this.createCards("birra", 1);
        this.createCards("saloon", 1);
        this.createCards("gatling", 1);
        this.createCards("panico", 1);
        this.createCards("mancato",1);
        this.createCards("indiani",1);
        this.createCards("duello", 1);
        this.createCards("emporio", 30);

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
            this._cards.push(this.createCard(name, "Deck"));
        }
    }


    shuffle() {
        // Convert ArraySchema to a regular array
        const regularArray = Array.from(this._cards);

        // Perform the shuffle on the regular array
        for (let i = regularArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [regularArray[i], regularArray[j]] = [regularArray[j], regularArray[i]];
        }

        // Clear the ArraySchema
        this._cards.clear();

        // Push the shuffled elements back into the ArraySchema
        regularArray.forEach(card => this._cards.push(card));

        // this._cards.map((card) => console.log(card.name))

    }

    deal(numberOfCards: number): ArraySchema<Card> {
        const dealtCards = new ArraySchema<Card>();
        for (let i = 0; i < numberOfCards; i++) {
            if (this._cards.length > 0) {
                const card = this._cards.shift();
                dealtCards.push(card);
            }
        }
        this.cardCount = this._cards.length; // Update the card count after dealing
        return dealtCards;
    }
}
