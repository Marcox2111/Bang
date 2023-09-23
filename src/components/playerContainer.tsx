import React from 'react';
import { Hero } from './hero';
import { List } from './list';
import {useGame} from "../context/context";

export function PlayerContainer() {
    const {activePlayer}  = useGame()

    return (
        <div className="grid grid-cols-4 justify-between items-center" >
            <div className="col-span-3 flex flex-col">
                <List type="Hand" cards={activePlayer.hand}/>
                <List type="Ground" cards={activePlayer.ground}/>
            </div>
            <div className="col-span-1">
                <Hero />
            </div>
        </div>
    );
}
