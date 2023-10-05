import React from "react";
import {Card} from "./card";
import { useGame } from '../context/Context';

export function Hero() {
    const { activePlayerID, players } = useGame();

    // Find the active player once
    const activePlayer = players.find(p => p.id === activePlayerID);
    console.log(activePlayer)
    // If the active player isn't found, return a fallback UI or null
    if (!activePlayer) {
        return <div>No active player found!</div>;
    }

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-400">
            {/*<Card key={activePlayer.character.id} cardID={activePlayer.character.id} cardName={activePlayer.character.title} />*/}
            {/*<Card key={activePlayer.role.id} cardID={activePlayer.role.id} cardName={activePlayer.role.title} />*/}
        </div>
    );
}
