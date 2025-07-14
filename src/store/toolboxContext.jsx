import { createContext } from "react";

const ToolboxContext = createContext({
    changeStrokeHandler: () => { },
    changeFillHandler: () => { },
    changeSizeHandler: () => { },
    toolboxState: {},
});

export default ToolboxContext;