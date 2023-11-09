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
                                    PASS_TURN: {
                                        target: "#game.PlayingTurn.EndPhase",
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

            },
            turnDraw: (context) => {

            },
            nextPlayer: (context, event) => {

            },
        },
        services: {},
        guards: {},
        delays: {},
    },
);
