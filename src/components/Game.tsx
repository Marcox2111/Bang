import React from "react";
import {useGame} from "../context/Context";
import {List} from "./list";


export function Game(){
    const {activePlayerID, players} = useGame()

    return (
        <div>
            <List id={`Player_${activePlayerID}_Hand`} type="Hand" cards={players.find(p => p.id === activePlayerID)?.Hand}/>
        </div>
    );
}