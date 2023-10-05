import React, {useCallback, useState} from "react";
import {Player, useGame} from '../context/Context';
import {PlayerForm} from "./PlayerForm";

export function AddPlayer() {
    // playerCount state is used to determine how many PlayerForm components to render.
    const [playerCount, setplayerCount] = useState(1); // Start with one form


    const {setPlayers} = useGame();


    // formData state holds the data from each PlayerForm component.
    // It's an array where each element is an object containing a name and character.
    const [playerData, setPlayerData] = useState<Array<{ name: string, character: string | null }>>([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Map over playerData to create new Player objects
        const newPlayers: Player[] = playerData.map((data, index) => ({
            id: index,
            name: data.name,
            character: data.character || '', // Handle the case where character is null
            role: '', // You need to set this value
            Hand: [], // Initialize Hand as an empty array
            Ground: [] // Initialize Ground as an empty array
        }));

        // Use setPlayers to update the players in your context
        setPlayers(newPlayers);
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
        // <div className="flex flex-col justify-between items-center h-screen w-screen bg-gray-400 p-0 m-0 sm:p-4">
        //     <form onSubmit={handleSubmit}
        //           className="flex flex-col justify-between items-center bg-gray-300 h-full w-full sm:min-w-max sm:w-auto mb-auto">
        //         <div className="text-2xl font-bold mt-4 mb-4">Add Players</div>
        //
        //         <div className="flex flex-col justify-between items-center bg-cyan-900 h-full">
        //             <div className="bg-white h-full flex-grow-0 overflow-y-auto">
        //                 <div className="flex flex-col">
        //                     {Array.from({length: playerCount}, (_, i) => (
        //                         <PlayerForm key={i} index={i} onPlayerDataChange={handlePlayerDataChange}/>
        //                     ))}
        //                     <button onClick={() => setplayerCount(playerCount + 1)}
        //                             className="block w-10 h-10 bg-cyan-700 justify-center rounded-full shadow cursor-pointer select-none hover:scale-105 transition duration-300 ease-in-out mt-4">
        //
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="flex-none">
        //             <button
        //                 type={"submit"}
        //                 className="block h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600 mt-4 mb-4">
        //                 Done
        //             </button>
        //         </div>
        //     </form>
        // </div>

//     return (
//         <div className="flex items-center justify-center bg-white min-h-screen ">
//             <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-xl p-4 bg-white shadow-2xl rounded-xl min-w-max ">
//                 <div className="flex justify-between items-center">
//                     {Array.from({length: playerCount}, (_, i) => (
//                         // Pass the handlePlayerDataChange function to each PlayerForm component
//                         <PlayerForm key={i} index={i} onPlayerDataChange={handlePlayerDataChange} />
//                     ))}
//                     <button onClick={() => setplayerCount(playerCount + 1)} className="block w-10 h-10 bg-cyan-700 justify-center rounded-full shadow cursor-pointer select-none hover:scale-105 transition duration-300 ease-in-out">
//
//                     </button>
//                 </div>
//                 <button
//                     type={"submit"}
//                     className="block h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600">
//                     Done
//                 </button>
//             </form>
//         </div>
//     );
// }

        <div
            className="flex flex-col justify-between h-screen w-screen p-0 m-0 sm:p-4 sm:w-auto sm:min-h-screen sm:items-center sm:justify-center">
            <form onSubmit={handleSubmit}
                  className="flex flex-col justify-between items-center h-full w-full sm:h-auto sm:w-auto sm:shadow-2xl sm:rounded-xl">
                <div className="flex-1 text-2xl font-bold mt-4 mb-4">Add Players</div>
                <div className="h-full w-full overflow-y-auto sm:overflow-x-auto sm:h-auto sm:w-auto">
                    <div className="flex flex-col w-full sm:h-auto sm:w-auto sm:flex-row">
                        {Array.from({length: playerCount}, (_, i) => (
                            <PlayerForm key={i} index={i} onPlayerDataChange={handlePlayerDataChange}/>
                        ))}
                        <button onClick={() => setplayerCount(playerCount + 1)}
                                className=" flex items-center justify-center self-center shrink-0 w-20 h-20 m-10 cursor-pointer">
                            <div
                                className="w-10 h-10 bg-cyan-700 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition duration-300 ease-in-out"/>
                        </button>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit}
                        className="mt-4 mb-4 h-10 w-32 text-white bg-red-500 rounded-xl shadow-md transition duration-300 ease-in-out hover:bg-red-600">
                    Done
                </button>
            </form>
        </div>


    );

}

