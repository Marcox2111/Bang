import React, {useState} from 'react';
import {useGame} from "../context/Context";


export function PlayerContainer() {
    const {activePlayerID, players} = useGame()
    const [activeId, setActiveId] = useState(null)


    return (
        // activePlayerID ? (
        //     <div className="grid grid-cols-4 justify-between items-center">
        //         <div className="col-span-3 flex flex-col">
        //             <DndContext
        //                 onDragStart={handleDragStart}
        //                 onDragOver={handleDragOver}
        //                 onDragEnd={handleDragEnd}
        //             >
        //                 <List id={`Player_${activePlayerID}_Hand`} type="Hand" cards={players.find(p => p.id === activePlayerID)?.Hand}/>
        //                 <List id={`Player_${activePlayerID}_Ground`} type="Ground" cards={players.find(p => p.id === activePlayerID)?.Ground}/>
        //
        //                 <DragOverlay dropAnimation={{
        //                     duration: 500,
        //                     easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        //                 }}>
        //                     {activeId ? <DraggableCard cardID={activeId} cardName={activeId}/> : null}
        //                 </DragOverlay>
        //             </DndContext>
        //         </div>
        //         <div className="col-span-1">
        //             <Hero/>
        //         </div>
        //     </div>
        // ) : (
            <div >
            </div>
        // )
    );
}
