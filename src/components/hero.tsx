import React from "react";
import {Card} from "./card";
import { useGame } from '../context/context';

export function Hero() {
    const { activePlayer } = useGame();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-400">
            <Card key={"activePlayer.character.id"} cardID={"activePlayer.character.id"} cardName={"activePlayer.character.title"} />
            <Card key={"activePlayer.role.id"} cardID={"activePlayer.role.id"} cardName={"activePlayer.role.title"} />
        </div>
    );
}
