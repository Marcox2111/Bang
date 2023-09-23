import React, {useState} from 'react';
import {Hero} from './hero';
import {List} from './list';
import {Card} from "./card";
import {useGame} from "../context/context";
import {DndContext, DragOverlay} from '@dnd-kit/core';
import {arrayMove} from "@dnd-kit/sortable";

export function PlayerContainer() {
    const {activePlayer, removeCardActivePlayer, addCardToPlayerHand,moveCardList} = useGame()
    const [activeId, setActiveId] = useState(null)
    const handleDragEnd = (event) => {
        if (!event.over) return;
        const activeId = event.active.id;
        const overId = event.over.id;

        if (activeId === overId) return;

        const isActiveAList = event.active.data.current?.type === "List";
        console.log(event.active.data.current.type);

        if (!isActiveAList) return;

        // setColumns((columns) => {
        //     const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        //
        //     const overColumnIndex = columns.findIndex((col) => col.id === overId);
        //
        //     return arrayMove(columns, activeColumnIndex, overColumnIndex);

    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };
    const handleDragOver = (event) => {
        if (!event.over) return;
        const activeId = event.active.id;
        const overId = event.over.id;


        if (activeId == overId) return;

        const isActiveCard = event.active.data.current?.type === "Card";
        const isOverCard = event.over.data.current?.type === "Card";

        if (isActiveCard && isOverCard) {
            const ActiveList = event.active.data.current.sortable.containerId
            const OverList = event.over.data.current.sortable.containerId

            const activeIndex = (activePlayer[ActiveList] as Card[]).findIndex(card => card.id === activeId);
            const overIndex = (activePlayer[OverList] as Card[]).findIndex(card => card.id === overId);


            if (ActiveList === OverList) {
                return arrayMove(activePlayer[ActiveList], activeIndex, overIndex - 1);
            }

            return moveCardList(ActiveList,OverList,activeIndex,overIndex);
        }
    };

    return (
        <div className="grid grid-cols-4 justify-between items-center">
            <div className="col-span-3 flex flex-col">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <List id={`Player_${activePlayer.id}_Hand`} type="Hand" cards={activePlayer.hand}/>
                    <List id={`Player_${activePlayer.id}_Ground`} type="Ground" cards={activePlayer.ground}/>
                    <DragOverlay>{activeId ? <Card cardID={activeId} cardName={activeId}/> : null}</DragOverlay>
                </DndContext>
            </div>
            <div className="col-span-1">
                <Hero/>
            </div>
        </div>
    )
        ;
}
