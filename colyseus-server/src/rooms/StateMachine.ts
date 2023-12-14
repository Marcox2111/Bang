import {createMachine} from "xstate";

export const machine = createMachine(
    {
        context: {
            room: null,
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
                    },
                },
            },
            DrawingCards: {
                entry: 'distributeCards',
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
                        initial: "Drawing",
                        states: {
                            Drawing: {
                                entry: 'turnDraw',
                                on: {
                                    RESOLVE_FIRST_DRAW: {
                                        target: "#game.PlayingTurn.MainPhase",
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
                                    BANG_PLAYED: {
                                        target: 'WaitForMissReaction',
                                    },
                                    BEER_PLAYED:{
                                        target: 'Action',
                                    },
                                    PASS_TURN: {
                                        cond: 'canPassTurn',
                                        target: "#game.PlayingTurn.EndPhase",
                                    },
                                    INDIANI_PLAYED: {
                                        target: 'WaitForBangReaction',
                                    }
                                },
                            },
                            WaitForMissReaction: {
                                on: {
                                    MISSED_REACTED: {
                                        target: 'Action',
                                    },
                                },
                            },
                            WaitForBangReaction: {
                                on: {
                                    BANG_REACTED: {
                                        target: 'Action',
                                    },
                                },
                            },
                        },
                    },
                    EndPhase: {
                        entry: 'nextPlayer',
                        on: {
                            RESOLVE_ENDPHASE: {
                                target: "#game.PlayingTurn",
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
                | { type: "BANG_PLAYED" }
                | { type: "INDIANI_PLAYED" }
                | { type: "BEER_PLAYED" }
                | { type: "MISSED_REACTED" }
                | { type: "BANG_REACTED" }
                | { type: "RESOLVE_ENDPHASE" },

        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {
            assignRoles: (context, event) => {
                context.room.assignRolesToPlayers();
            },
            distributeCards: (context, event) => {
                context.room.distributeCardsToPlayer();
            },
            turnDraw: (context) => {
                context.room.turnDraw();
            },
            nextPlayer: (context, event) => {
                context.room.nextPlayer();
            },
        },
        services: {},
        guards: {
            canPassTurn: (context, event) => {
                return context.room.canPlayerPassTurn();
            }
        },
        delays: {},
    },
);
