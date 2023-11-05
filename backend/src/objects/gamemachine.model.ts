import { createMachine, assign } from "xstate";

export const machine = createMachine(
    {
        context: {
            currentCard: "null",
        },
        id: "game",
        initial: "Lobby",
        states: {
            Lobby: {
                on: {
                    START_GAME: {
                        target: "AssigningRoles",
                    },
                },
            },
            AssigningRoles: {
                on: {
                    ROLES_ASSIGNED: {
                        target: "DrawingCards",
                    },
                },
            },
            DrawingCards: {
                on: {
                    CARDS_DISTRIBUTED: {
                        target: "PlayingTurn",
                    },
                },
            },
            PlayingTurn: {
                initial: "DrawingPhase",
                states: {
                    DrawingPhase: {
                        initial: "PreDrawing",
                        states: {
                            PreDrawing: {
                                on: {
                                    PRE_DRAWING_RESOLVED: {
                                        target: "Drawing",
                                    },
                                },
                            },
                            Drawing: {
                                on: {
                                    CARDS_DRAWN: {
                                        target: "#game.PlayingTurn.MainPhase.PreAction",
                                    },
                                },
                            },
                        },
                    },
                    MainPhase: {
                        initial: "PreAction",
                        states: {
                            PreAction: {
                                on: {
                                    PRE_ACTION_RESOLVED: {
                                        target: "Action",
                                    },
                                },
                            },
                            Action: {
                                initial: "PlayingCard",
                                states: {
                                    PlayingCard: {
                                        on: {
                                            CARD_PLAYED: {
                                                target: "CardEffect",
                                                actions: assign({ currentCard: (context, event) => event.card }),
                                            },
                                        },
                                    },
                                    CardEffect: {
                                        initial: "HandlingEffect",
                                        states: {
                                            HandlingEffect: {
                                                invoke: {
                                                    src: "handleCardEffect",
                                                },
                                            },
                                            AwaitingReaction: {
                                                invoke: {
                                                    src: "handleCardEffect",
                                                    onDone: [
                                                        {
                                                            target: "CheckGameOver",
                                                            actions: assign({
                                                                allPlayersReacted: (context, event) => event.data.allPlayersReacted,
                                                            }),
                                                        },
                                                    ],
                                                },
                                            },
                                            CheckGameOver: {
                                                invoke: {
                                                    src: "checkGameOver",
                                                    id: "gameover",
                                                    onDone: [
                                                        {
                                                            target: "#game.PlayingTurn.GameOver",
                                                        },
                                                    ],
                                                    onError: [
                                                        {
                                                            target: "#game.PlayingTurn.MainPhase.Action.PlayingCard",
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    GameOver: {},
                },
            },
        },
        schema: {
            events: {} as
                | { type: "START_GAME" }
                | { type: "CARDS_DRAWN" }
                | { type: "CARD_PLAYED" }
                | { type: "ROLES_ASSIGNED" }
                | { type: "CARDS_DISTRIBUTED" }
                | { type: "PRE_ACTION_RESOLVED" }
                | { type: "PRE_DRAWING_RESOLVED" },
            context: {} as { currentCard: string },
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {},
        services: {
            handleCardEffect: createMachine({
                /* ... */
            }),

            checkGameOver: createMachine({
                /* ... */
            }),
        },
        guards: {},
        delays: {},
    },
);