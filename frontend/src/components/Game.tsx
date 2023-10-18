import React from "react";
import {useGame} from "../context/Context";
import {PlayerContainer} from "./playerContainer";
import {useResizeDetector} from "react-resize-detector";


export function Game() {
    const {players} = useGame();
    const {width: containerWidth,ref:containerDiv} = useResizeDetector();


    return (
        <div className="w-screen h-screen overflow-hidden">
            <div ref={containerDiv}
                className="w-full h-full"
                style={{
                    transformStyle: "preserve-3d",
                    position: "absolute",
                    border: "1px solid black",
                    transform: `rotateY(0deg)`,
                    transition: "transform 1s",
                    left: "0%",
                    top: "0%",
                }}
            >
                {players.map((objectPlayer, index) => {
                    return (
                        <div key={index} style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            border: "5px inset silver",
                            top: "0%",
                            left: "0%",
                            background: "white",
                            transform: `
                                rotateY(${index * (360 / players.length) + 0}deg)
                                translateZ(${Math.round((containerWidth/2)/Math.tan(Math.PI/players.length))}px)
                            `,
                            transition: "transform 1s"
                        }}>
                            <PlayerContainer player={objectPlayer} key={index}/>
                        </div>
                    );
                })}
            </div>
        </div>

    )
}