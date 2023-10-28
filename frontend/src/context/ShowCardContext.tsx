import React, {createContext, ReactNode, useContext, useState} from 'react';
import {CardType} from '../../../shared/types';
import {CardComponent} from "../components/CardComponent";
import {TargetMap} from "../components/TargetMap";
import {useGame} from "./Context";

type ShowCardProps = {
    openCard: (card: CardType) => void;
    closeCard: () => void;
};

const ShowCardContext = createContext<ShowCardProps | undefined>(undefined);

type ShowCardProviderProps = { children: ReactNode };


export function ShowCardProvider({children}: ShowCardProviderProps) {
    const {isYourTurn} = useGame()
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [showTargetMap, setShowTargetMap] = useState<boolean>(false)
    const openCard = (card: CardType) => setSelectedCard(card);

    const closeCard = (() => {
        setSelectedCard(null);
        setShowTargetMap(false)
    })


    return (
        <ShowCardContext.Provider value={{openCard, closeCard}}>
            {children}
            {selectedCard && (
                <div
                    className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50"
                    onClick={closeCard} // close modal when background is clicked
                >
                    <div
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent click event from bubbling up to outer div
                            setShowTargetMap(true);
                        }}
                        className="flex flex-col rounded-xl justify-center align-middle items-center"
                    >
                        {(showTargetMap && isYourTurn()) ? <TargetMap card={selectedCard} onCloseCard={closeCard}/> :
                            <CardComponent card={selectedCard}/>}
                    </div>
                </div>

            )}
        </ShowCardContext.Provider>
    );
}

export function useShowCard() {
    return useContext(ShowCardContext);
}
