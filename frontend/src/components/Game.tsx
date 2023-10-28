import React from "react";
import {PlayerCarousel} from "./PlayerCarousel";
import {CharChoice} from "./CharChoice";
import {useGame} from "../context/Context";

export function Game() {
    const {clientPlayer} = useGame();
    const [roleandchar, setRoleandchar] = React.useState(true);


    return (
        <div className="w-screen h-screen overflow-hidden">
            {roleandchar ? <CharChoice role={clientPlayer.role} setRoleandchar={setRoleandchar}/> : <PlayerCarousel/>}
        </div>

    )
}