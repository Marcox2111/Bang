import React, {createContext, ReactNode, useContext, useState} from 'react';
import {CardType} from '../../../shared/types';
import {CardComponent} from "../components/CardComponent";
import {TargetMap} from "../components/TargetMap";
import {useGame} from "./Context";
import {motion} from 'framer-motion';

type ShowCardProps = {
    openCard: (card: CardType) => void;
    closeCard: () => void;
};

const ShowCardContext = createContext<ShowCardProps | undefined>(undefined);

type ShowCardProviderProps = { children: ReactNode };


export function ShowCardProvider({children}: ShowCardProviderProps) {
    const {isYourTurn, discardCard} = useGame()

    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [showTargetMap, setShowTargetMap] = useState<boolean>(false)
    const openCard = (card: CardType) => setSelectedCard(card);

    const closeCard = (() => {
        setSelectedCard(null);
        setShowTargetMap(false)
    })

    const bounceAnimation = {
        initial: {scale: 0},
        animate: {scale: 1},
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    };

    const handleDiscardCard = () => {
        discardCard(selectedCard)
        closeCard()
        setSelectedCard(null);
        setShowTargetMap(false);
    };


    return (
        <ShowCardContext.Provider value={{openCard, closeCard}}>
            {children}
            {selectedCard && (
                <div
                    className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50"
                    onClick={e => {
                        e.stopPropagation();
                        closeCard();
                    }}
                >
                    {(showTargetMap && isYourTurn()) ?
                        <TargetMap card={selectedCard} onCloseCard={closeCard}/> :
                        <motion.div
                            {...bounceAnimation}
                            onClick={e => {
                                e.stopPropagation();
                                setShowTargetMap(true);
                            }}
                            className="flex flex-col rounded-xl justify-center align-middle items-center"
                        >
                            <CardComponent card={selectedCard}/>
                            {isYourTurn() ?
                                <div
                                    className="flex align-middle justify-center items-center bg-white bg-opacity-80 m-4 h-14 w-14 rounded-full p-4 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDiscardCard();
                                    }}
                                >
                                    <span className="text-xl font-bold">X</span>
                                </div> :
                                <div/>}
                        </motion.div>}
                </div>
            )}
        </ShowCardContext.Provider>
    );
}

export function useShowCard() {
    return useContext(ShowCardContext);
}
