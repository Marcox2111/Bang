import React from "react";
import {Card} from "./card";
import { useGame } from '../context/context';

export function Hero() {
    const { activePlayer } = useGame();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-400">
            {activePlayer.hand.map((card, index) => (
                <Card key={card.id} itemId={card.id} title={card.title} />
            ))}
        </div>
    );
}
