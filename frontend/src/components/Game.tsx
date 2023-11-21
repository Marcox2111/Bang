import React, { useState } from "react";
import { PlayerCarousel } from "./PlayerCarousel";
import { CharChoice } from "./CharChoice";
import { useGame } from "../context/Context";

export function Game() {
    const { clientPlayer, rotateCarouselLeft, rotateCarouselRight, isYourTurn } = useGame();
    const [roleAndChar, setRoleAndChar] = useState(true);

    // Function to handle left rotation
    const handleRotateLeft = () => {
        rotateCarouselLeft(); // Your logic to rotate carousel left
    };

    // Function to handle right rotation
    const handleRotateRight = () => {
        rotateCarouselRight(); // Your logic to rotate carousel right
    };

    // Function to handle deck interaction


    return (
        <div className="w-screen h-screen overflow-hidden">
            {roleAndChar ? (
                <CharChoice role={clientPlayer.role} setRoleAndChar={setRoleAndChar}/>
            ) : (
                <>
                    <PlayerCarousel/>
                    <div className="interaction-layer">
                        {isYourTurn() && <button onClick={handleRotateLeft}>Rotate Left</button>}
                        {isYourTurn() && <button onClick={handleRotateRight}>Rotate Right</button>}
                    </div>
                </>
            )}
        </div>
    );
}
