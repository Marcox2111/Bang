import React from "react";

const PlayerList = ({ players }) => {
    return (
        <div className="player-list">
            <h2>Players in Lobby</h2>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
