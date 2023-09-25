import React from 'react';
import { useGame } from "../context/context";


export function Sidebar({ onAddPlayerClick }) {
    //Chiamo la funzione useGame che mi restituisce il context e da questo mi prendo le informazioni di tutti player,
    //per come ho definito players, è un array di player cha hanno come informazioni: ruolo, character, le carte in mano e sul ground. Perf
    const { players, setActivePlayerID } = useGame()


    return (
        <div className="h-screen flex flex-col justify-between p-8 bg-gray-400">
            <div className="flex space-y-2 flex-col">
                {players.map(player => ( //this is how map works in react, it takes an array and for each element it calls the function
                    <button key={player.id} onClick={() => { //() => {} is a function that takes no arguments
                        const foundPlayer = players.find(p => p.id === player.id);
                        if (foundPlayer) {
                            setActivePlayerID(foundPlayer.id);
                        }
                    }}
                        className="font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100">
                        {player.id}
                    </button>
                ))}
                <button key={"newplayer"} onClick={onAddPlayerClick}
                    className="font-medium border-4 border-white text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                    New Player
                </button>
            </div>

            <a href="#"
                className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                Discard
            </a>

        </div>
    );
}
