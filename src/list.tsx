import React, {useState} from "react";
import {Card} from "./card";
import { useGame } from './context';

type ListProps = {
    type: "Hand" | "Ground";
};


export function List({ type }: ListProps) {
    const { activePlayer, addCardToHand, moveCardToGround } = useGame();
    const cards = type === "Hand" ? activePlayer.hand : activePlayer.ground;

    return (
        <div className="flex overflow-x-scroll hide-scroll-bar">
            {cards.map((card, index) => (
                <Card
                    title={`Card ${index + 1}`}
                    itemId={`Card ${index + 1}`} // NOTE: itemId is required for track items
                    key={index}
                />
            ))}
            {type === "Hand" && (
                <button onClick={() => addCardToHand(activePlayer.id)} className="inline-block px-4 py-8 cursor-pointer select-none">
                    <div className="card-button"></div>
                </button>
            )}
        </div>
    );
}
