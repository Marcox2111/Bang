import React, {useState} from "react";
import {PAGES} from "../context/constants";
import {useGame} from "../context/Context";

type AddPlayerProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
};

export function AddPlayer({setCurrentPage}: AddPlayerProps) {
    const [playerName, setPlayerName] = useState<string>('');
    const [roomID, setRoomID] = useState<string>('');
    const {createRoom, joinRoom} = useGame()

    const isValidInputs = () => playerName !== "" && roomID !== "";


    const handleCreateRoom = async () => {
        if (playerName !== "") {
            try {
                await createRoom('game', {name: playerName});
                setCurrentPage(PAGES.LOBBY);
            } catch (error) {
                console.error("Error creating room:", error);
                // Handle error (e.g., show message to user)
            }
        }
    };

    const handleJoinRoom = async () => {
        if (isValidInputs()) {
            try {
                await joinRoom(roomID, {name: playerName});
                setCurrentPage(PAGES.LOBBY);
            } catch (error) {
                console.error("Error joining room:", error);
                // Handle error (e.g., show message to user)
            }
        }
    };

    const renderButton = (label, action) => (
        <button
            type="button" // Changed from "submit" to "button" since we're not submitting a form
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

                            <input
                                autoComplete="nope"
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full"
                                type="text"
                                placeholder="Name"
                            />
                            {renderButton("Create Room", handleCreateRoom)}

                            <input
                                autoComplete="nope"
                                placeholder="Room ID"
                                className="w-full"
                                type="text"
                                onChange={(e) => setRoomID(e.target.value)}
                            />
                            {renderButton("Join Room", handleJoinRoom)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
