import React, {useEffect, useState} from "react";
import character from "../cards/bang_cards/character/character.json";
import {socket} from "../context/socket";
import {PAGES} from "../context/constants";

type AddPlayerProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
};

export function AddPlayer({setCurrentPage}: AddPlayerProps) {
    const initialImage = require(`../cards/bang_cards/character/${character[Math.floor(Math.random() * character.length)].id}.png`);
    const [playerName, setPlayerName] = useState<string>('');
    const [roomID, setRoomID] = useState<string>('');

    const isValidInputs = () => playerName !== "" && roomID !== "";

    const handleCreateRoom = () => {
        if (isValidInputs()) {
            socket.connect();
            socket.emit("createRoom", {roomID, playerName});
        }
    };

    const handleJoinRoom = () => {
        if (isValidInputs()) {
            socket.connect();
            socket.emit("joinRoom", {roomID, playerName});
        }
    };

    useEffect(() => {
        const onRoomCreated = (data) => {
            socket.data = data;
            setCurrentPage(PAGES.LOBBY);
        };

        const onJoinedRoom = (data) => {
            socket.data = data;
            setCurrentPage(PAGES.LOBBY);
        };

        socket.on('roomCreated', onRoomCreated);
        socket.on('joinedRoom', onJoinedRoom);

        return () => {
            socket.off('roomCreated', onRoomCreated);
            socket.off('joinedRoom', onJoinedRoom);
        };
    }, []);

    const renderButton = (label, action) => (
        <button
            type="submit"
            onClick={action}
            className="mt-4 mb-4 h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600">
            {label}
        </button>
    );

    return (
        <div
            className="flex flex-col justify-between h-screen w-screen p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div
                className="flex flex-col justify-between items-center h-full sm:h-auto sm:shadow-2xl sm:rounded-xl sm:max-w-full">
                <div className="flex-1 text-2xl font-bold mt-4 mb-4">New Player</div>
                <div className="h-full w-full overflow-auto hide-scroll-bar">
                    <div className="flex flex-col h-full justify-center align-middle sm:flex-row">
                        <div
                            className="flex flex-col items-center justify-between p-4 m-4 space-y-4 bg-white border rounded-lg space-x-0 ">
                            <div className="h-auto w-52 border-amber-500 rounded-none overflow-hidden">
                                {initialImage &&
                                    <img src={initialImage} alt="Character" className="w-full h-full object-cover"/>}
                            </div>
                            <div className="flex flex-col flex-1 space-y-4 m-4">
                                <input
                                    autoComplete="nope"
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full"
                                    type="text"
                                    placeholder="Name"
                                />
                                <input
                                    autoComplete="nope"
                                    placeholder="Room ID"
                                    className="w-full"
                                    type="text"
                                    onChange={(e) => setRoomID(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row space-x-4">
                    {renderButton("Create Room", handleCreateRoom)}
                    {renderButton("Join Room", handleJoinRoom)}
                </div>
            </div>
        </div>
    );
}
