import {Card} from "./card.model";

export class CardFactory {
    createCard(type: string): Card {
        switch (type) {
            case "bang":
                return new Card("bang");
            case "birra":
                return new Card("birra");
            case "panico":
                return new Card("panico");
            case "saloon":
                return new Card("saloon");
            case "gatling":
                return new Card("gatling");

            // Add more cases for each card type...
            default:
                throw new Error("Invalid card type");
        }
    }
}
