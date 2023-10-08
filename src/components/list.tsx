import React from "react";
import {Card} from "./card";
import { CardType } from '../types';

type ListProps = {
    id: string
    type: string;
    cards: CardType[];
};

export function List({id, type, cards}: ListProps) {

    return (
        <div
            className="flex flex-grow overflow-x-scroll overflow-y-visible hide-scroll-bar">
            {cards.map((card, index) => (
                <Card key={card.id} id={card.id} cardName={card.title}/>
            ))}
        </div>
    );
}
