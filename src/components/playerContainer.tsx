import React, {useState} from 'react';
import {Hero} from './hero';
import {List} from './list';
import {Card} from "./card";
import {useGame} from "../context/Context";
import {DndContext, DragOverlay} from '@dnd-kit/core';
import {DraggableCard} from "./DraggableCard";


export function PlayerContainer() {
    const {activePlayerID, players, moveCardList} = useGame()
    const [activeId, setActiveId] = useState(null)

    const handleDragEnd = (event) => {
        return;
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        if (!event.over || event.active.id === event.over.id) return;
    
        const activeId = event.active.id;
        const activePlayer = players.find(p => p.id === activePlayerID);
        if (!activePlayer) return;
    
        const ActiveList = event.active.data.current?.sortable?.containerId;
        const OverList = event.over.data.current?.sortable?.containerId || event.over.id.split('_').slice(2).join('_');
    
        const isActiveCard = event.active.data.current?.type === "Card";
        const isOverCard = event.over.data.current?.type === "Card";
    
        if (!ActiveList || !OverList) return;
    
        const activeIndex = activePlayer[ActiveList]?.findIndex(card => card.id === activeId);
        if (activeIndex === -1) return;
    
        const endIndex = isOverCard ? activePlayer[OverList]?.findIndex(card => card.id === event.over.id) : activePlayer[OverList]?.length;
    
        if (endIndex !== undefined) {
            return moveCardList(ActiveList, OverList, activeIndex, endIndex);
        }
    };
    


    return (
        activePlayerID ? (
            <div className="grid grid-cols-4 justify-between items-center">
                <div className="col-span-3 flex flex-col">
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <List id={`Player_${activePlayerID}_Hand`} type="Hand" cards={players.find(p => p.id === activePlayerID)?.Hand}/>
                        <List id={`Player_${activePlayerID}_Ground`} type="Ground" cards={players.find(p => p.id === activePlayerID)?.Ground}/>

                        <DragOverlay dropAnimation={{
                            duration: 500,
                            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                        }}>
                            {activeId ? <DraggableCard cardID={activeId} cardName={activeId}/> : null}
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
