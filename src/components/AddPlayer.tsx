import React, {useCallback, useState} from "react";
import {useGame} from '../context/Context';
import {Player, CardType} from "../types";
import {PlayerForm} from "./PlayerForm";

type AddPlayerProps = {
    setIsPlayerAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddPlayer({setIsPlayerAdded}: AddPlayerProps) {
    // playerCount state is used to determine how many PlayerForm components to render.
    const [playerCount, setplayerCount] = useState(1); // Start with one form


    const {setPlayers} = useGame();


    // formData state holds the data from each PlayerForm component.
    // It's an array where each element is an object containing a name and character.
    const [playerData, setPlayerData] = useState<Array<{ name: string, character: string | null }>>([]);

    const fixedCards: CardType[] = [
        { id: '1', title: 'bang' },
        { id: '2', title: 'carabine' },
        { id: '3', title: 'duello' },
        { id: '4', title: 'indiani' },
        { id: '5', title: 'indiani' }
    ];


    const handleSubmit = () => {
        // Map over playerData to create new Player objects
        const newPlayers: Player[] = playerData.map((data, index) => ({
            id: index,
            name: data.name,
            character: data.character || '', // Handle the case where character is null
            role: '', // You need to set this value
            Hand: fixedCards, // Initialize Hand as an empty array
            Ground: [] // Initialize Ground as an empty array
        }));

        // Use setPlayers to update the players in your context
        setPlayers(newPlayers);
        setIsPlayerAdded(true);
    }

    // useCallback is used to memoize the handlePlayerDataChange function.
    // This means the function will retain its identity across renders unless its dependencies change.
    // This is useful for performance reasons, especially when passing the function as a prop to child components.
    const handlePlayerDataChange = useCallback((index: number, data: { name: string, character: string }) => {
        // This function updates the formData state with the data from a PlayerForm component.
        // It uses the previous state to create a new array, updates the element at the specified index, and returns the new array.
        setPlayerData(prevData => {
            const newData = [...prevData];
            newData[index] = data;
            return newData;
        });
    }, []); // Empty dependency array means this callback never re-creates unless the component unmounts and remounts.


    return (

        <div
            className="flex flex-col justify-between h-screen w-screen p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div className="flex flex-col justify-between items-center h-full sm:h-auto sm:shadow-2xl sm:rounded-xl sm:max-w-full">
                <div className="flex-1 text-2xl font-bold mt-4 mb-4">Add Players</div>
                <div className="h-full w-full overflow-auto hide-scroll-bar">
                    <div className="flex flex-col sm:flex-row">
                        {Array.from({length: playerCount}, (_, i) => (
                            <PlayerForm key={i} index={i} onPlayerDataChange={handlePlayerDataChange}/>
                        ))}
                        <div className="flex justify-center items-center">
                            <button onClick={() => setplayerCount(playerCount + 1)}
                                    className="flex items-center justify-center self-center shrink-0 w-20 h-20 m-4 cursor-pointer">
                                <div className="w-10 h-10 bg-cyan-700 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit}
                        className="mt-4 mb-4 h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600">
                    Done
                </button>
            </div>
        </div>


    );

}

