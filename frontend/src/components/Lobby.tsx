import React, {useEffect} from "react";
import {socket} from "../context/socket";
import {useGame} from "../context/Context";
import {PAGES} from "../context/constants";

type AddPlayerProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
};

export function Lobby({setCurrentPage}: AddPlayerProps) {
    const {players, updateRoomInfo} = useGame();
    const clientPlayer = players.find(player => player.name === socket.data.playerName);

    function handleDisconnect() {
        socket.disconnect();
        setCurrentPage(PAGES.ADD_PLAYER);
    }

    function handleStart() {
        socket.emit('ready');
    }

    useEffect(() => {

        updateRoomInfo();

        socket.on('playerJoined', () => {
            updateRoomInfo();
        });


        socket.on('startGame', () => {
            updateRoomInfo();
            setCurrentPage(PAGES.GAME);
        });


        return () => {
            // Clean up the socket listener when the component unmounts
            socket.off('startGame');
            socket.off('playerJoined');
        };
    }, []);

    return (
        <div
            className="flex flex-col justify-between h-screen w-screen p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div
                className="flex flex-col justify-between items-center h-full sm:h-auto sm:shadow-2xl sm:rounded-xl sm:max-w-full">
                <div className="flex-1 text-2xl font-bold mt-4 mb-4">Lobby</div>
                <div className="h-full w-full overflow-auto hide-scroll-bar">
                    <div className="flex flex-col h-full justify-center align-middle sm:flex-row">
                        {/* List of player */}
                        {players.map((player, index) => (
                            <div
                                key={index}
                                className={`m-2 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-xl font-semibold border border-gray-200 ${player.name === socket.data.playerName ? 'bg-blue-200' : 'bg-white'}`}  // Conditionally apply background color
                            >
                                {player.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-row space-x-4">
                    {clientPlayer?.isHost &&
                        <button
                            type="submit"
                            onClick={handleStart}
                            className="mt-4 mb-4 h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600"
                        >
                            Start
                        </button>
                    }
                    <button
                        type="submit"
                        className="mt-4 mb-4 h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600"
                        onClick={handleDisconnect}
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
