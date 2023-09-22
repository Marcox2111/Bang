import React, {useState, useContext} from "react";
import {Card} from "./card";
import GlobalIdContext from "./context";

const elemPrefix = "Card_";
const getId = (index: number) => `${elemPrefix}${index}`;

export function List() {
    const { globalIdCounter, incrementGlobalId } = useContext(GlobalIdContext);
    const [items, setItems] = useState([]);


    const addCard = () => {
        incrementGlobalId();
        const newId = getId(globalIdCounter);
        setItems([...items, {id: newId}]);
    };

    return (
        <div className="flex overflow-x-scroll hide-scroll-bar">
            {items.map(({id}) => (
                <Card
                    title={id}
                    itemId={id} // NOTE: itemId is required for track items
                    key={id}
                />
            ))}
            <button onClick={addCard} className="inline-block px-4 py-8 cursor-pointer select-none">
                <div className="card-button">
                </div>
            </button>
        </div>
    );
}
