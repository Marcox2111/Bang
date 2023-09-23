import React from "react";
import {Card} from "./card";
import { useGame } from '../context/context';

export function Hero() {
    const { activePlayer } = useGame();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-400">
            <Card key={activePlayer.character.id} itemId={activePlayer.character.id} title={activePlayer.character.title} />
            <Card key={activePlayer.role.id} itemId={activePlayer.role.id} title={activePlayer.role.title} />

        </div>
    );
}
