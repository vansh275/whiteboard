import React, { useCallback, useReducer } from 'react';
import BoardContext from './board-context';
import { Element } from '../utils/element';
import { getSvgPathFromStroke } from '../utils/Getsvg';
import getStroke from 'perfect-freehand';
import { isPointNearElement } from '../utils/element';
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from './constants';

const BoardContextProvider = ({ children }) => {
    const boardReducer = (state, action) => {
        switch (action.type) {
            case BOARD_ACTIONS.CHANGE_TOOL:
                return {
                    ...state,
                    activeToolItem: action.payload.tool,
                };

            case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
                return {
                    ...state,
                    toolActionType: action.payload.actionType,
                };

            case BOARD_ACTIONS.DRAW_DOWN: {
                const { clientX, clientY, stroke, fill, size } = action.payload;
                const newEle = Element(
                    state.elements.length,
                    clientX,
                    clientY,
                    clientX,
                    clientY,
                    { type: state.activeToolItem, stroke, fill, size }
                );
                return {
                    ...state,
                    toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
                    elements: [...state.elements, newEle],
                };
            }

            case BOARD_ACTIONS.DRAWN_MOVE: {
                const Elements = [...state.elements];
                const index = state.elements.length - 1;

                if (state.activeToolItem === TOOL_ITEMS.BRUSH) {
                    const { clientX, clientY } = action.payload;
                    Elements[index].points = [...Elements[index].points, { x: clientX, y: clientY }];
                    Elements[index].path = new Path2D(getSvgPathFromStroke(getStroke(Elements[index].points)));
                } else {
                    const { clientX, clientY } = action.payload;
                    const { x1, y1, type, stroke, fill, size } = Elements[index];
                    const tempElement = Element(index, x1, y1, clientX, clientY, { type, stroke, fill, size });
                    Elements[index] = tempElement;
                }

                return {
                    ...state,
                    elements: Elements,
                };
            }

            case BOARD_ACTIONS.DRAW_UP: {
                const elementsCopy = [...state.elements];
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(elementsCopy);
                return {
                    ...state,
                    history: newHistory,
                    index: state.index + 1,
                };
            }

            case BOARD_ACTIONS.ERASE: {
                const { clientX, clientY } = action.payload;
                let newElements = [...state.elements].filter(
                    (element) => !isPointNearElement(clientX, clientY, element)
                );
                if (newElements.length == state.elements.length) return state;
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(newElements);
                return {
                    ...state,
                    elements: newElements,
                    history: newHistory,
                    index: state.index + 1,
                };
            }

            case BOARD_ACTIONS.CHANGE_TEXT: {
                const index = state.elements.length - 1;
                const newElements = [...state.elements];
                newElements[index].text = action.payload.text;
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(newElements);
                return {
                    ...state,
                    toolActionType: TOOL_ACTION_TYPES.NONE,
                    elements: newElements,
                    history: newHistory,
                    index: state.index + 1,
                };
            }

            case BOARD_ACTIONS.UNDO:
                if (state.index <= 0) return state;
                return {
                    ...state,
                    elements: state.history[state.index - 1],
                    index: state.index - 1,
                };

            case BOARD_ACTIONS.REDO:
                if (state.index >= state.history.length - 1) return state;
                return {
                    ...state,
                    elements: state.history[state.index + 1],
                    index: state.index + 1,
                };

            default:
                return state;
        }
    };

    const initialBoardState = {
        activeToolItem: TOOL_ITEMS.BRUSH,
        elements: [],
        toolActionType: TOOL_ACTION_TYPES.NONE,
        history: [[]],
        index: 0,
    };

    const [boardState, dispatchBoardActions] = useReducer(
        boardReducer,
        initialBoardState
    );

    const changeToolHandler = (tool) => {
        dispatchBoardActions({
            type: BOARD_ACTIONS.CHANGE_TOOL,
            payload: { tool },
        });
    };

    const boardMouseDownHandler = (event, toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        const { clientX, clientY } = event;

        if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
            dispatchBoardActions({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload: { actionType: TOOL_ACTION_TYPES.ERASING },
            });
            return;
        }

        dispatchBoardActions({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload: {
                clientX,
                clientY,
                stroke: toolboxState[boardState.activeToolItem]?.stroke,
                fill: toolboxState[boardState.activeToolItem]?.fill,
                size: toolboxState[boardState.activeToolItem]?.size,
            },
        });
    };

    const boardMouseMoveHandler = (event) => {
        const { clientX, clientY } = event;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
            dispatchBoardActions({
                type: BOARD_ACTIONS.ERASE,
                payload: { clientX, clientY },
            });
        } else if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardActions({
                type: BOARD_ACTIONS.DRAWN_MOVE,
                payload: { clientX, clientY },
            });
        }
    };

    const boardMouseUpHandler = () => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;

        if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardActions({ type: BOARD_ACTIONS.DRAW_UP });
        }

        dispatchBoardActions({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload: { actionType: TOOL_ACTION_TYPES.NONE },
        });
    };

    const textAreaBlurHandler = (text) => {
        dispatchBoardActions({
            type: BOARD_ACTIONS.CHANGE_TEXT,
            payload: { text },
        });
    };

    const UndoHandler = useCallback(() => {
        dispatchBoardActions({ type: BOARD_ACTIONS.UNDO });
    }, []);

    const RedoHandler = useCallback(() => {
        dispatchBoardActions({ type: BOARD_ACTIONS.REDO });
    }, []);

    const boardValue = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        toolActionType: boardState.toolActionType,
        changeToolHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        UndoHandler,
        RedoHandler,
    };

    return (
        <BoardContext.Provider value={boardValue}>
            {children}
        </BoardContext.Provider>
    );
};

export default BoardContextProvider;
