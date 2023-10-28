import {Card} from "./card.model";
import {CardFactory} from "./cardfactory.model";

export class Deck {
    cards: Card[] = [];
    cardFactory: CardFactory = new CardFactory();

    constructor() {
        this.initializeDeck();
    }

    initializeDeck() {
        // This can be as sophisticated as needed.
        // It could involve random card generation, predefined card sequences, etc.
        for (let i = 0; i < 15; i++) {
            this.cards.push(this.cardFactory.createCard("bang"));
        }
        for(let i = 0; i < 5; i++) {
            this.cards.push(this.cardFactory.createCard("birra"));
        }
        for(let i = 0; i < 2; i++) {
            this.cards.push(this.cardFactory.createCard("saloon"));
        }
        for(let i = 0; i < 3; i++) {
            this.cards.push(this.cardFactory.createCard("gatling"));
        }
        for(let i = 0; i < 3; i++) {
            this.cards.push(this.cardFactory.createCard("panico"));
        }

        // Shuffle the deck if needed
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(numberOfCards: number): Card[] {
        return this.cards.splice(0, numberOfCards);
    }
}
