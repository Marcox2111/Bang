import React from "react";
import { useGame } from '../context/context';

export function Sidebar() {
    const { setActivePlayer, players } = useGame();

    const handlePlayerClick = (playerId) => {
        const selectedPlayer = players.find(player => player.id === playerId);
        setActivePlayer(selectedPlayer);
    };

    return (
        <div className="h-screen flex flex-col justify-between p-8 bg-gray-400">
            <ul className="space-y-2">
                {players.map(player => (
                    <li key={player.id}>
                        <a href="#" onClick={() => handlePlayerClick(player.id)}
                           className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                            Player {player.id}
                        </a>
                    </li>
                ))}
            </ul>

            <a href="#"
               className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                Discard
            </a>
        </div>
    );
}
