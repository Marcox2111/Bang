import {Card} from './card.model';
import {v4 as uuidv4} from 'uuid';

export class Player {
    roomID: string;
    id: string;
    name: string;
    turn: boolean = false;
    isHost: boolean = false;
    range: number = 1;
    cards: Card[];
    hp: number;
    role: string | null = null;

    constructor(roomID: string, name: string) {
        this.roomID = roomID;
        this.id= uuidv4();
        this.name = name;
        this.cards = [];
        this.hp = 5;
    }

    addCards(cards: Card[]) {
        this.cards.push(...cards);
    }

    playCard(cardId: string, target?: Player) {
        if (this.turn) { // Check if it's the player's turn
            const cardIndex = this.cards.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                const cardToPlay = this.cards[cardIndex];
                cardToPlay.play(this, target);
                this.cards.splice(cardIndex, 1);
            }
        } else {
            console.log("It's not your turn!");
        }
    }



    takeDamage(damage: number) {
        this.hp! -= damage;
    }

    takeHeal(heal: number) {
        this.hp! += heal;
    }

}
