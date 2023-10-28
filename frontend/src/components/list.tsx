import React from "react";
import {CardComponent} from "./CardComponent";
import { CardType } from '../../../shared/types';

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
                <CardComponent key={card.id} card={card}/>
            ))}
        </div>
    );
}
