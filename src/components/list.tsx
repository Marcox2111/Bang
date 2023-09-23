import React from "react";
import {Card} from "./card";
import {useGame} from "../context/context";

type ListProps = {
    type: "Hand" | "Ground";
    cards: { id: string, title: string }[];
};

export function List({type, cards}: ListProps) {
    const {addCardToPlayerHand} = useGame();

    const addCard = () => {
        const newCard = {id: 'newId', title: 'New Card'}; // Adjust as needed
        addCardToPlayerHand(newCard);
    };

    return (
        <div className="flex flex-row overflow-visible hide-scroll-bar">
            <div className="flex flex-row overflow-x-scroll hide-scroll-bar">
                {cards.map((card, index) => (
                    <Card
                        title={card.title}
                        itemId={card.id}
                        key={card.id}
                    />
                ))}
                {type === "Hand" && (
                    <button onClick={() => addCard()} className="inline-block px-4 py-8 cursor-pointer select-none">
                        <div className="card-button"></div>
                    </button>
                )}
            </div>
        </div>
    );
}
