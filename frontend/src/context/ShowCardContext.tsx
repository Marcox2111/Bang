import React, {createContext, ReactNode, useContext, useState} from 'react';
import {CardType} from '../../../shared/types';
import {CardComponent} from "../components/CardComponent";
import {TargetMap} from "../components/TargetMap";
import {useGame} from "./Context";
import {motion, useAnimate} from 'framer-motion';

type ShowCardProps = {
    openCard: (card: CardType) => void;
    closeCard: () => void;
};

const ShowCardContext = createContext<ShowCardProps | undefined>(undefined);

type ShowCardProviderProps = { children: ReactNode };


export function ShowCardProvider({children}: ShowCardProviderProps) {
    const {isYourTurn, discardCard, clientPlayer} = useGame()

    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [showTargetMap, setShowTargetMap] = useState<boolean>(false)

    const [scope, animate] = useAnimate()

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

    //TODO: 5 is hardcoded, should be the max HP
    const handleCardAction = (card: CardType) => {
        if (isYourTurn()) {
            // Example: Handle the 'beer' card
            switch (card.name) {
                case 'birra':
                    if (clientPlayer.hp === 5) {
                        // Play an animation or show a message that HP is already full
                        // For example, shake the card to indicate it can't be used
                        animate(scope.current, {rotateZ: [0, 10, -10, 10, 0], transition: {duration: 0.5}})
                    } else {
                        // Open the TargetMap or perform the beer card action
                        setShowTargetMap(true);
                    }
                    break;
                default:
                    // Default action for other cards
                    setShowTargetMap(true);
            }
        }
        else {
            animate(scope.current, {rotateZ: [0, 10, -10, 10, 0], transition: {duration: 0.5}})
        }
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
                            ref={scope}
                            {...bounceAnimation}
                            onClick={e => {
                                e.stopPropagation();
                                handleCardAction(selectedCard);
                            }}
                            className="flex flex-col rounded-xl justify-center align-middle items-center"
                        >
                            <CardComponent cardName={selectedCard.name}/>
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
                                <div/>
                            }
                        </motion.div>}
                </div>
            )}
        </ShowCardContext.Provider>
    );
}

export function useShowCard() {
    return useContext(ShowCardContext);
}
