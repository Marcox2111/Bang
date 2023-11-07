import { assign, createMachine } from "xstate";
import { Room } from './room.model';

export const machine = createMachine(
    {
        context: {
            room: null,
            currentPlayerIndex: 0,
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
                entry: 'assignRoles',  // Action to assign roles
                on: {
                    ROLES_ASSIGNED: {
                        target: "DrawingCards",
                        actions: 'distributeCards'  // Action to distribute cards
                    },
                },
            },
            DrawingCards: {
                on: {
                    CARDS_DISTRIBUTED: {
                        target: "PlayingTurn",
                        actions: 'startPlayingTurn'
                    },
                },
            },
            PlayingTurn: {
                initial: "DrawingPhase",
                states: {
                    DrawingPhase: {
                        initial: "Drawing",
                        states: {
                            Drawing: {
                                entry: 'turnDraw',
                                on: {
                                    RESOLVE_FIRST_DRAW: {
                                        target: "#game.PlayingTurn.MainPhase.Action",
                                    },
                                },
                            },
                        },
                    },

                    MainPhase: {
                        initial: "Action",
                        states: {
                            Action: {
                                on: {
                                    PASS_TURN: {
                                        target: "#game.PlayingTurn.EndPhase",
                                    },
                                },
                            },
                        },
                    },
                    EndPhase: {
                        on: {
                            RESOLVE_ENDPHASE: {
                                target: "#game.PlayingTurn",
                                actions: 'nextPlayer',
                            },
                        },
                    },
                },
            },
        },
        schema: {
            events: {} as
                | { type: "START_GAME" }
                | { type: "RESOLVE_FIRST_DRAW" }
                | { type: "ROLES_ASSIGNED" }
                | { type: "CARDS_DISTRIBUTED" }
                | { type: "PASS_TURN" }
                | { type: "RESOLVE_ENDPHASE" },
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {
            assignRoles: assign((context, event) => {
                context.room.assignRoles();
                const startPlayerIndex = context.room.getStartPlayerIndex();
                return {
                    ...context,
                    currentPlayerIndex: startPlayerIndex,
                };
            }),
            distributeCards: (context, event) => {
                context.room.distributeCards();
            },
            startPlayingTurn: (context) => {
                // ... (your logic here)
            },
            turnDraw: (context) => {
                const player = context.room.players[context.currentPlayerIndex]
                context.room.startTurnDraw(player)
            },
            nextPlayer: assign((context) => {
                const nextPlayerIndex = (context.currentPlayerIndex + 1) % context.room.players.length;
                context.room.players[context.currentPlayerIndex].turn = false;
                context.room.players[nextPlayerIndex].turn = true;
                return {
                    ...context,
                    currentPlayerIndex: nextPlayerIndex
                };
            }),
        },
        services: {},
        guards: {},
        delays: {},
    },
);
