import React, {useState} from "react";
import {useGame} from "../context/Context";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

type Card = {
    id: string;
    name: string;
}

export function AddCard({onClose}) {
    const {addCardToPlayerHand} = useGame();
    const initialImage = require("../cards/bang_cards/character/bartcassidy.png");
    const [currentImage, setCurrentImage] = useState(initialImage);
    // const [selectedCharacter, setSelectedCharacter] = useState<CardType | null>(null);



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
        // setSelectedCharacter(item);
    }

    const handleAddPlayer = (event) => {
        event.preventDefault(); // This line prevents the form from being submitted which in turn prevents the page from being refreshed
        const newId = Math.random().toString(36).substring(2, 10);
        const newCard = {id: newId, title: newId}; // Adjust as needed
        // addCardToPlayerHand(type,newCard);
    };

    return (
        <div></div>
    );
    //     <div className="fixed inset-0 flex items-center justify-center min-h-screen">
    //         <div className="relative flex justify-center max-w-xl py-4 m-auto bg-white shadow-2xl">
    //             <span onClick={onClose}
    //                   className="absolute top-0 right-0 block w-10 h-5 -mt-2 -mr-4 text-xs text-center text-gray-600 transform rotate-45 bg-white rounded shadow-md cursor-pointer hover:bg-gray-100">close</span>
    //             <div className="flex">
    //                 {currentImage && <img src={currentImage} alt="Card"/>}
    //             </div>
    //             <div className="flex bg-white shadow-lg rounded-lg">
    //                 <div className="p-4">
    //                     <form onSubmit={handleAddPlayer}>
    //                         <div className="flex flex-col space-y-4">
    //                             <ReactSearchAutocomplete<CardType>
    //                                 items={items}
    //                                 onSearch={handleOnSearch}
    //                                 onHover={handleOnHover}
    //                                 onSelect={handleOnSelect}
    //                                 autoFocus
    //                                 showIcon={false}
    //                                 styling={{
    //                                     height: "44px",
    //                                     border: "1px solid #dfe1e5",
    //                                     borderRadius: "8px",
    //                                     backgroundColor: "white",
    //                                     boxShadow: "rgba(32, 33, 36, 0.1) 0px 1px 6px 0px",
    //                                     color: "#212121",
    //                                     hoverBackgroundColor: "#f7f7f7",
    //                                     fontSize: "16px",
    //                                     fontFamily: "Arial, sans-serif",
    //                                     iconColor: "grey",
    //                                     lineColor: "rgb(232, 234, 237)",
    //                                     placeholderColor: "grey",
    //                                     clearIconMargin: '3px 14px 0 0',
    //                                     searchIconMargin: '0 0 0 16px'
    //                                 }}
    //                             />
    //                             <button
    //                                 type="submit"
    //                                 className="block w-full py-2 text-black bg-gray-200 shadow rounded hover:shadow-xl outline-5 transition duration-150 ease-in-out">
    //                                 Add
    //                             </button>
    //                         </div>
    //                     </form>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}
