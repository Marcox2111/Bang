import React, {useMemo} from "react";
import {useGame} from "../context/Context";
import {PlayerContainer} from "./PlayerContainer";
import {useResizeDetector} from "react-resize-detector";
import {EnemyContainer} from "./EnemyContainer";

export function PlayerCarousel() {
    const {players, rotationPlayer, clientPlayer} = useGame();
    const {width: containerWidth, ref: containerDiv} = useResizeDetector();

    const translateZValue = useMemo(() => {
        return Math.round((containerWidth / 2) / Math.tan(Math.PI / players.length));
    }, [containerWidth, players.length]);

    return (
        <div ref={containerDiv} className="carousel-container">
            {players.map((objectPlayer, index) => {
                const rotationDegree = index * (360 / players.length) + rotationPlayer;
                return (
                    <div key={objectPlayer.id} className="player-card" style={{
                        transform: `rotateY(${rotationDegree}deg) translateZ(${translateZValue}px)`,
                        transition: 'transform 2s',
                    }}>
                        {objectPlayer.id === clientPlayer.id
                            ? <PlayerContainer key={objectPlayer.id} player={objectPlayer}/>
                            : <EnemyContainer key={objectPlayer.id} player={objectPlayer}/>
                        }
                    </div>
                );
            })}
        </div>
    )
}