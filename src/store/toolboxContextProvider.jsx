import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from "./constants.js";
import ToolboxContext from "./toolboxContext.jsx";

import React, { useReducer } from 'react'

const ToolboxContextProvider = ({ children }) => {

    function toolboxReducer(state, action) {
        switch (action.type) {
            case TOOLBOX_ACTIONS.CHANGE_STROKE: {
                const newState = { ...state };
                newState[action.payload.tool].stroke = action.payload.color;
                return newState;
            }
            case TOOLBOX_ACTIONS.CHANGE_FILL: {
                const newState = { ...state };
                newState[action.payload.tool].fill = action.payload.color;
                return newState;
            }
            case TOOLBOX_ACTIONS.CHANGE_SIZE: {
                const newState = { ...state };
                newState[action.payload.tool].size = action.payload.size;
                return newState;
            }
            default:
                return state;
        }
    }
    const initialToolBoxState = {
        [TOOL_ITEMS.BRUSH]: {
            stroke: COLORS.BLACK,
        },
        [TOOL_ITEMS.LINE]: {
            stroke: COLORS.BLACK,
            size: 1,
        },
        [TOOL_ITEMS.RECTANGLE]: {
            stroke: COLORS.BLACK,
            fill: null,
            size: 1,
        },
        [TOOL_ITEMS.CIRCLE]: {
            stroke: COLORS.BLACK,
            fill: null,
            size: 1,
        },
        [TOOL_ITEMS.ARROW]: {
            stroke: COLORS.BLACK,
            size: 1,
        },
        [TOOL_ITEMS.TEXT]: {
            stroke: COLORS.BLACK,
            size: 32,
        },
    }
    const [toolboxState, dispatchToolboxAction] = useReducer(
        toolboxReducer,
        initialToolBoxState,
    );
    const changeStrokeHandler = (tool, color) => {
        // console.log(tool, color);
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload: {
                tool, color,
            }
        });
    }

    const changeFillHandler = (tool, color) => {
        console.log(tool, color);
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_FILL,
            payload: {
                tool, color,
            }
        });
    }

    const changeSizeHandler = (tool, size) => {
        // console.log(tool, size);
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload: {
                tool, size,
            }
        });
    }

    const toolboxContextValue = {
        toolboxState,
        changeStrokeHandler,
        changeFillHandler,
        changeSizeHandler,
    }
    return (
        <ToolboxContext.Provider value={toolboxContextValue}>
            {children}
        </ToolboxContext.Provider>
    )
}

export default ToolboxContextProvider;