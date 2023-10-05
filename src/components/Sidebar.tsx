import React from 'react';
import classNames from "classnames";
import {useGame} from "../context/Context";

// add NavItem prop to component prop
type Props = {
    collapsed: boolean;
    setCollapsed(collapsed: boolean): void;
    shown: boolean;
};

export function Sidebar({collapsed,setCollapsed,shown}: Props) {
    //Chiamo la funzione useGame che mi restituisce il context e da questo mi prendo le informazioni di tutti player,
    //per come ho definito players, è un array di player cha hanno come informazioni: ruolo, character, le carte in mano e sul ground. Perf
    const {players, setActivePlayerID} = useGame()


    return (

        <div
            className={classNames({
                "fixed bg-gray-500 md:static md:translate-x-0 z-20": true,
                "transition-all duration-300 ease-in-out": true,
                "w-[300px]": !collapsed,
                "w-16": collapsed,
                "-translate-x-full": !shown,
            })}
        >
            <div
                className={
                    "flex flex-col justify-between h-screen w-full"}
            >
                {/* logo and collapse button */}
                <div
                    className={classNames({
                        "flex items-center transition-none": true,
                        "p-4 justify-between": !collapsed,
                        "py-4 justify-center": collapsed,
                    })}
                >
                    {!collapsed && <span className="whitespace-nowrap">Bang</span>}
                    <button
                        className="grid place-content-center bg-gray-400 hover:bg-gray-200 w-10 h-10 rounded-lg opacity-0 md:opacity-100"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        ciao
                    </button>
                </div>
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
                    <button key={"newplayer"}
                            className="font-medium border-4 border-white text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                        New Player
                    </button>
                </div>

                <a href="#"
                   className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100">
                    Discard
                </a>
            </div>
        </div>
    );
}
