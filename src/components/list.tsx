import React from "react";
import {DraggableCard} from "./DraggableCard";
import {useGame} from "../context/Context";
import {useDroppable} from '@dnd-kit/core';
import {SortableContext} from "@dnd-kit/sortable";


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

    function addCard()
    {

    }


    return (
        <SortableContext
            id={type}
            items={cards}
        >
            <div
                ref={setNodeRef}
                className="flex flex-grow overflow-x-scroll overflow-y-visible hide-scroll-bar">
                {cards.map((card, index) => (
                    <DraggableCard
                        cardName={card.title}
                        cardID={card.id}
                        key={card.id}
                    />
                ))}
                {/*{type === "Hand" && (*/}
                    <button onClick={() => addCard()} className="inline-block px-4 py-8 cursor-pointer select-none">
                        <div className="card-button"></div>
                    </button>
                {/*)}*/}

            </div>
        </SortableContext>
    );
}
