import React from "react";
import {Card} from "./card";
import {useGame} from "../context/context";
import {useDroppable} from '@dnd-kit/core';
import {SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable";


type ListProps = {
    id: string
    type: string;
    cards: { id: string, title: string }[];
};


export function List({id, type, cards}: ListProps) {
    const {addCardToPlayerHand} = useGame();
    const {setNodeRef} = useDroppable({
        id: id,
        data: {
            type: "List"
        }
    });

    const addCard = (type : string) => {
        const newId = Math.random().toString(36).substring(2, 10);
        const newCard = {id: newId, title: newId}; // Adjust as needed
        addCardToPlayerHand(type,newCard);
    };



    return (
        <SortableContext
            id={type}
            items={cards}
        >
            <div
                ref={setNodeRef}
                className="flex flex-grow overflow-x-scroll overflow-y-visible hide-scroll-bar">
                {cards.map((card, index) => (
                    <Card
                        cardName={card.title}
                        cardID={card.id}
                        key={card.id}
                    />
                ))}
                {/*{type === "Hand" && (*/}
                    <button onClick={() => addCard(type)} className="inline-block px-4 py-8 cursor-pointer select-none">
                        <div className="card-button"></div>
                    </button>
                {/*)}*/}

            </div>
        </SortableContext>
    );
}
