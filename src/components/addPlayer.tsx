import React, {useState} from "react";
import {useGame} from "../context/context";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'


export function AddPlayer({onClose}) {
    const {addNewPlayer} = useGame();
    const [currentImage, setCurrentImage] = useState(null);
    const [playerName, setPlayerName] = useState(''); // For the input textbox
    const [selectedCharacter, setSelectedCharacter] = useState(''); // For the selected item from ReactSearchAutocomplete



    const items = [
        'bartcassidy',
        'blackjack',
        'calamityjanet',
        'elgringo',
        'jessejones',
        'jourdonnais',
        'kitcarlson',
        'luckyduke',
        'paulregret',
        'pedroramirez',
        'rosedoolan',
        'sidketchum',
        'slabthekiller',
        'suzylafayette',
        'vulturesam',
        'willythekid'
    ].map((name, index) => ({
        id: index,
        name: name
    }));

    const handleOnSearch = (string, results) => {
    }

    const handleOnHover = (result) => {
        console.log(result.name)
        try {
            const image = require(`../cards/bang_cards/character/${result.name}.png`);
            setCurrentImage(image);
        } catch (error) {
            const image = require(`../cards/bang_cards/character/blackjack.png`);
            setCurrentImage(image); // or set to a default image
        }
    }

    const handleOnSelect = (item) => {
        try {
            const image = require(`../cards/bang_cards/character/${item.name}.png`);
            setCurrentImage(image);
        } catch (error) {
            const image = require(`../cards/bang_cards/character/blackjack.png`);
            setCurrentImage(image); // or set to a default image
        }
        setSelectedCharacter(item);
    }

    const handleAddPlayer = (event) => {
        event.preventDefault(); // This line prevents the form from being submitted which in turn prevents the page from being refreshed
        addNewPlayer(playerName,selectedCharacter);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen">
            <div className="relative flex justify-center max-w-xl py-4 m-auto bg-white shadow-2xl">
                <span onClick={onClose}
                      className="absolute top-0 right-0 block w-10 h-5 -mt-2 -mr-4 text-xs text-center text-gray-600 transform rotate-45 bg-white rounded shadow-md cursor-pointer hover:bg-gray-100">close</span>
                <div className="flex">
                    {currentImage && <img src={currentImage} alt="Character"/>}
                </div>
                <div className="flex flex-col m-2 justify-between w-1/2 px-4 space-y-6">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold leading-tight">
                            New Player
                        </h1>
                    </div>
                    <div>
                        <form onSubmit={handleAddPlayer}>
                            <div className={"flex flex-col space-y-4"}>
                                <input
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full px-5 py-5 border rounded focus:border-blue-500 focus:outline-none"
                                    type="text" placeholder="Name"/>
                                <ReactSearchAutocomplete
                                    items={items}
                                    onSearch={handleOnSearch}
                                    onHover={handleOnHover}
                                    onSelect={handleOnSelect}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="block w-full py-3 mt-3 text-white bg-blue-500 rounded shadow-lg hover:bg-blue-600">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
