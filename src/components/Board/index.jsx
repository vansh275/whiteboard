import { useContext, useEffect, useRef } from "react"
import rough from "roughjs"
import BoardContext from "../../store/board-context.jsx";
import ToolboxContext from "../../store/toolboxContext.jsx";
import classes from "./index.module.css";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../store/constants.js";

function Board() {
    const canvaRef = useRef();
    const { elements, boardMouseDownHandler, boardMouseMoveHandler, toolActionType, boardMouseUpHandler, textAreaBlurHandler, UndoHandler, RedoHandler } = useContext(BoardContext);
    const { toolboxState } = useContext(ToolboxContext);
    const textAreaRef = useRef();
    // console.log(toolboxState);
    useEffect(() => {
        const canva = canvaRef.current;
        canva.width = window.innerWidth;
        canva.height = window.innerHeight;


    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey && event.key === "z") {
                UndoHandler();
            } else if (event.ctrlKey && event.key === "y") {
                RedoHandler();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [UndoHandler, RedoHandler]);

    useEffect(() => {
        const canva = canvaRef.current;
        const context = canva.getContext("2d");
        context.save();
        let roughCanvas = rough.canvas(canva);
        // console.log("changed ", elements);

        elements.forEach((element) => {
            if (element.type === TOOL_ITEMS.TEXT) {
                console.log("type text ", element);
                context.textBaseline = "top";
                context.font = `${element.size}px Caveat`;
                context.fillStyle = element.stroke;
                context.fillText(element.text, element.x1, element.y1);
                context.restore();
            }
            else if (element.type === TOOL_ITEMS.BRUSH) {
                // console.log("drawing brush");
                context.fillStyle = element.stroke;
                context.fill(element.path);
                context.restore();
            }
            else {
                // console.log("drawing not brush");
                roughCanvas.draw(element.roughEle);
            }
        })

        return () => {
            context.clearRect(0, 0, canva.width, canva.height);
        }
    }, [elements]);

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
            setTimeout(() => {
                textArea.focus();
            }, 0);
        }
    }, [toolActionType])

    const handleMouseDown = (event) => {
        boardMouseDownHandler(event, toolboxState);
    }
    const handleMouseMove = (event) => {
        boardMouseMoveHandler(event);
    }
    const handleMouseUp = () => {
        boardMouseUpHandler();
    }
    return (
        <>
            {toolActionType === TOOL_ACTION_TYPES.WRITING && (
                <textarea
                    type="text"
                    className={classes.textElementBox}
                    ref={textAreaRef}
                    style={{
                        top: elements[elements.length - 1].y1,
                        left: elements[elements.length - 1].x1,
                        fontSize: `${elements[elements.length - 1]?.size}px`,
                        color: elements[elements.length - 1]?.stroke,
                    }}
                    onBlur={(event) => textAreaBlurHandler(event.target.value)}

                />
            )}

            <canvas id="canvas" ref={canvaRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ></canvas>
        </>
    )
}

export default Board
