import React, {useEffect, useState} from "react";
import {ReactSearchAutocomplete} from 'react-search-autocomplete'

type Item = {
    id: string;
    name: string;
}

// Define the props that PlayerForm component expects to receive
type PlayerFormProps = {
    index: number;
    // onPlayerDataChange is a function prop that will be used to inform the parent component
    // about changes in playerName or playerCharacter.
    onPlayerDataChange: (index: number, data: { name: string, character: string }) => void;
};


export function PlayerForm({index, onPlayerDataChange}: PlayerFormProps) {
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

    const initialImage = require(`../cards/bang_cards/character/${items[Math.floor(Math.random() * items.length)].id}.png`);
    const [currentImage, setCurrentImage] = useState(initialImage);
    // playerName and playerCharacter are local states holding the input values of the form.
    const [playerName, setPlayerName] = useState<string>(''); // State for the player's name
    const [playerCharacter, setPlayerCharacter] = useState<string>(''); // State for the player's character

    // useEffect hook that will be triggered every time playerName or playerCharacter changes.
    useEffect(() => {
        // When playerName or playerCharacter changes, this effect will run and call the
        // onPlayerDataChange function prop, passing the current playerName and playerCharacter as an argument.
        // This informs the parent component of the changes to playerName and playerCharacter.
        onPlayerDataChange(index, {name: playerName, character: playerCharacter});
    }, [playerName, playerCharacter]); // Dependency array: effect runs when values in this array change


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
        setPlayerCharacter(item);
    }

    return (
        <div className="flex flex-row m-4 items-center justify-between p-4 space-y-4 space-x-4 bg-white border rounded-lg sm:shrink-0 sm:flex-col">
            <div className="w-32 h-32 rounded-full overflow-hidden sm:w-auto sm:h-auto sm:rounded-none">
                {currentImage && <img src={currentImage} alt="Character"/>}
            </div>
            <div className="flex flex-col flex-1 space-y-4">
                <input
                    autoComplete="nope"
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-2 border rounded transition duration-150 ease-in-out"
                    type="text" placeholder="Name"
                />
                <ReactSearchAutocomplete<Item>
                    items={items}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    autoFocus
                    showIcon={false}
                    placeholder={'Character'}
                    styling={{
                        height: "44px",
                        border: "1px solid #dfe1e5",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "rgba(32, 33, 36, 0.1) 0px 1px 6px 0px",
                        color: "#212121",
                        hoverBackgroundColor: "#f7f7f7",
                        fontSize: "16px",
                        iconColor: "grey",
                        lineColor: "rgb(232, 234, 237)",
                        placeholderColor: "grey",
                        clearIconMargin: '3px 14px 0 0',
                        searchIconMargin: '0 0 0 16px'
                    }}
                />
            </div>
        </div>
    );
}