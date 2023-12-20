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
                                    INDIANI_PLAYED: {
                                        target: 'WaitForBangReaction',
                                    },
                                    DUELLO_PLAYED: {
                                        target: 'WaitForDuelReaction',
                                    },
                                    EMPORIO_PLAYED: {
                                        target: 'Emporio',
                                        actions: 'revealEmporioCards',
                                    },
                                    PASS_TURN: {
                                        cond: 'canPassTurn',
                                        target: "#game.PlayingTurn.EndPhase",
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
                            WaitForDuelReaction: {
                                on: {
                                    DUELLO_REACTED: {
                                        target: 'WaitForDuelReaction',
                                    },
                                    NO_DUELLO_REACTED: {
                                        target: 'Action',
                                    }
                                },
                            },
                            Emporio: {
                                on: {
                                    CARD_CHOSEN: {
                                        target: 'Emporio',
                                        cond: 'areThereMorePlayers',
                                    },
                                    ALL_CARDS_CHOSEN: {
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
                | { type: "DUELLO_PLAYED" }
                | { type: "EMPORIO_PLAYED" }
                | { type: "CARD_CHOSEN" }
                | { type: "NEXT_PLAYER_CHOOSE" }
                | { type: "ALL_CARDS_CHOSEN" }
                | { type: "BEER_PLAYED" }
                | { type: "MISSED_REACTED" }
                | { type: "BANG_REACTED" }
                | { type: "DUELLO_REACTED" }
                | { type: "NO_DUELLO_REACTED" }
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
            revealEmporioCards: (context, event) => {
                context.room.revealEmporioCards();
            }
        },
        services: {},
        guards: {
            canPassTurn: (context, event) => {
                return context.room.canPlayerPassTurn();
            },
            areThereMorePlayers: (context, event) => {
                return context.room.areThereMorePlayers();
            }
        },
        delays: {},
    },
);
