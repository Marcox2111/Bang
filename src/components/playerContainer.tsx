import React, {useState} from 'react';
import {Hero} from './hero';
import {List} from './list';
import {Card} from "./card";
import {useGame} from "../context/context";
import {DndContext, DragOverlay} from '@dnd-kit/core';


export function PlayerContainer() {
    const {activePlayer,moveCardList} = useGame()
    const [activeId, setActiveId] = useState(null)

    const handleDragEnd = (event) => {
        return;
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        if (!event.over) return;
        const activeId = event.active.id;

        if (activeId === event.over.id) return;

        const isActiveCard = event.active.data.current?.type === "Card";
        const isOverCard = event.over.data.current?.type === "Card";
        const isOverList = event.over.data.current?.type === "List";


        const ActiveContainer = event?.active?.data?.current?.sortable?.containerId;
        const OverContainer = event?.over?.data?.current?.sortable?.containerId;
        const ActiveList = ActiveContainer ? ActiveContainer : null;
        const OverList = OverContainer ? OverContainer : null;

        if (isActiveCard && isOverCard) {
            if (!activePlayer[ActiveList] || !activePlayer[OverList]) return;

            const activeIndex = activePlayer[ActiveList].findIndex(card => card.id === activeId);
            const overIndex = activePlayer[OverList].findIndex(card => card.id === event.over.id);

            return moveCardList(ActiveList, OverList, activeIndex, overIndex);
        } else if (isActiveCard && isOverList) {
            const parts = event.over.id.split('_');
            const OverList = parts.slice(2).join('_')
            const activeIndex = activePlayer[ActiveList].findIndex(card => card.id === activeId);
            const endIndex = activePlayer[OverList].length;  // Append at the end of the OverList

            return moveCardList(ActiveList, OverList, activeIndex, endIndex);
        }
    };


    return (
        activePlayer ? (
            <div className="grid grid-cols-4 justify-between items-center">
                <div className="col-span-3 flex flex-col">
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <List id={`Player_${activePlayer.id}_Hand`} type="Hand" cards={activePlayer.Hand}/>
                        <List id={`Player_${activePlayer.id}_Ground`} type="Ground" cards={activePlayer.Ground}/>

                        <DragOverlay dropAnimation={{
                            duration: 500,
                            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                        }}>
                            {activeId ? <Card cardID={activeId} cardName={activeId}/> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                <div className="col-span-1">
                    <Hero/>
                </div>
            </div>
        ) : (
            <div >
            </div>
        )
    );
}
