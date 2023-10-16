import React from "react";
import {useGame} from "../context/Context";
import {PlayerContainer} from "./playerContainer";


export function Game() {
    const {players} = useGame();


    return (
            <div
                style={{
                    perspective: "10000cm",
                    transformStyle: "preserve-3d",
                    position: "absolute",
                    border: "1px solid black",
                    height: "50%",
                    width: "50%",
                    left: "25%",
                    top: "25%",
                    transform: `rotateY(0deg)`,
                    transition: "transform 1s"
                }}
            >
                {players.map((objectPlayer, index) => {
                    return (
                        // <PlayerContainer key={index} player={objectPlayer} />
                        <div key={index} style={{
                            backgroundColor: `hsl(${index * (360 / players.length)}, 100%, 70%)`,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            border: "5px inset silver",
                            // top: "calc(50% - 75px)",
                            // left: "calc(50% - 75px)",
                            transform: `
                        rotateY(${index * (360 / players.length)+30}deg)
                        translateZ(300px)
                        `,
                            transition: "transform 1s"
                        }}>
                            <PlayerContainer key={index} player={objectPlayer}/>
                        </div>
                    );
                })}
            </div>
    )
}