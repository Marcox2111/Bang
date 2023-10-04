import React, {useState} from "react";
import {useGame} from "../context/context";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

type Item = {
    id: string;
    name: string;
}

export function AddPlayer() {
    const {addNewPlayer} = useGame();
    const initialImage = require("../cards/bang_cards/character/bartcassidy.png");
    const [currentImage, setCurrentImage] = useState(initialImage);
    const [playerName, setPlayerName] = useState(''); // For the input textbox
    const [selectedCharacter, setSelectedCharacter] = useState<Item | null>(null);



    const items = [
        'Bart Cassidy',
        'Black Jack',
        'Calamity Janet',
        'El Gringo',
        'Jesse Jones',
        'Jourdonnais',
        'Kit Carlson',
        'Lucky Duke',
        'Paul Regret',
        'Pedro Ramirez',
        'Rose Doolan',
        'Sid Ketchum',
        'Slab The Killer',
        'Suzy Lafayette',
        'Vulture Sam',
        'Willy The Kid'
    ].map(name => ({
        id: name.toLowerCase().replace(/\s+/g, ''),  // Convert to lowercase and remove spaces
        name: name
    }));

    const handleOnSearch = (string, results) => {
    }

    const handleOnHover = (result) => {
        try {
            const image = require(`../cards/bang_cards/character/${result.id}.png`);
            setCurrentImage(image);
        } catch (error) {
            setCurrentImage(initialImage);
        }
    }

    const handleOnSelect = (item) => {
        try {
            const image = require(`../cards/bang_cards/character/${item.id}.png`);
            setCurrentImage(image);
        } catch (error) {
            setCurrentImage(initialImage); // or set to a default image
        }
        setSelectedCharacter(item);
    }

    const handleAddPlayer = (event) => {
        event.preventDefault(); // This line prevents the form from being submitted which in turn prevents the page from being refreshed
        addNewPlayer(playerName,selectedCharacter.name);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen">
            <div className="relative flex justify-center max-w-xl py-4 m-auto bg-white shadow-2xl">
                <div className="flex">
                    {currentImage && <img src={currentImage} alt="Character"/>}
                </div>
                <div className="flex flex-col m-4 justify-between w-1/2 px-4 space-y-6 bg-white shadow-lg rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold leading-tight text-gray-800">
                            New Player
                        </h1>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleAddPlayer}>
                            <div className="flex flex-col space-y-4">
                                <input
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                                    type="text" placeholder="Name"
                                />
                                <ReactSearchAutocomplete<Item>
                                    items={items}
                                    onSearch={handleOnSearch}
                                    onHover={handleOnHover}
                                    onSelect={handleOnSelect}
                                    autoFocus
                                    showIcon={false}
                                    styling={{
                                        height: "44px",
                                        border: "1px solid #dfe1e5",
                                        borderRadius: "8px",
                                        backgroundColor: "white",
                                        boxShadow: "rgba(32, 33, 36, 0.1) 0px 1px 6px 0px",
                                        color: "#212121",
                                        hoverBackgroundColor: "#f7f7f7",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        iconColor: "grey",
                                        lineColor: "rgb(232, 234, 237)",
                                        placeholderColor: "grey",
                                        clearIconMargin: '3px 14px 0 0',
                                        searchIconMargin: '0 0 0 16px'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="block w-full py-2 text-black bg-gray-200 shadow rounded hover:shadow-xl outline-5 transition duration-150 ease-in-out">
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

