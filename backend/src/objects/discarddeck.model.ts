import {Card} from "./card.model";
import {CardFactory} from "./cardfactory.model";

export class DiscardDeck {
    cards: Card[] = [];


    deal(numberOfCards: number): Card[] {
        return this.cards.splice(0, numberOfCards);
    }
}
