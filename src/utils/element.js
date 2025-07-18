import rough from "roughjs/bin/rough";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "./Getsvg.jsx";
import { TOOL_ITEMS } from "../store/constants.js";
import { getArrowHeadsCoordinates, isPointCloseToLine } from "./math.jsx";

const gen = rough.generator();

export const Element = (id, x1, y1, x2, y2, { type, stroke, fill, size }) => {
    const newEle = {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        fill,
        stroke,
        size,
    }
    let option = {
        seed: id + 1,
        fillStyle: "solid",
    };
    if (stroke) {
        option.stroke = stroke;
    }
    if (fill) {
        option.fill = fill;
    }
    if (size) {
        option.strokeWidth = size;
    }
    // console.log(option);
    switch (type) {
        case TOOL_ITEMS.BRUSH: {
            // console.log("brush");
            // console.log(newEle);
            const BrushEle = {
                id,
                points: [{ x: x1, y: y1 }],
                path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
                type,
                stroke,
            }
            // console.log(BrushEle);
            return BrushEle;
        }
        case TOOL_ITEMS.LINE: {
            newEle.roughEle = gen.line(x1, y1, x2, y2, option);
            // console.log(newEle);
            return newEle;
        }
        case TOOL_ITEMS.RECTANGLE: {
            newEle.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, option);
            // console.log(newEle);
            return newEle;
        }
        case TOOL_ITEMS.CIRCLE: {
            newEle.roughEle = gen.circle(x1, y1, (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))), option);
            // console.log(newEle);
            return newEle;
        }
        case TOOL_ITEMS.ARROW: {
            const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(x1, y1, x2, y2, 20);
            // console.log(x3, y3, x4, y4);
            newEle.roughEle = gen.linearPath(
                [[x1, y1],
                [x2, y2],
                [x3, y3],
                [x2, y2],
                [x4, y4],]
                , option
            )
            // console.log(newEle);
            return newEle;
        }
        case TOOL_ITEMS.TEXT: {
            newEle.text = ""
            console.log(newEle);
            return newEle;
        }
        default:

            break;
    }
}

// Turn the points returned from perfect-freehand into SVG path data.


export const isPointNearElement = (clientX, clientY, element) => {
    const { x1, y1, x2, y2, type } = element;
    const context = document.getElementById("canvas").getContext("2d");
    switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
            return isPointCloseToLine(x1, y1, x2, y2, clientX, clientY);
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
            return (
                isPointCloseToLine(x1, y1, x2, y1, clientX, clientY) ||
                isPointCloseToLine(x2, y1, x2, y2, clientX, clientY) ||
                isPointCloseToLine(x2, y2, x1, y2, clientX, clientY) ||
                isPointCloseToLine(x1, y2, x1, y1, clientX, clientY)
            );
        case TOOL_ITEMS.BRUSH:
            return context.isPointInPath(element.path, clientX, clientY);
        case TOOL_ITEMS.TEXT: {
            context.font = `${element.size}px Caveat`;
            context.fillStyle = element.stroke;
            const textWidth = context.measureText(element.text).width;
            const textHeight = parseInt(element.size);
            context.restore();
            return (
                isPointCloseToLine(x1, y1, x1 + textWidth, y1, clientX, clientY) ||
                isPointCloseToLine(
                    x1 + textWidth,
                    y1,
                    x1 + textWidth,
                    y1 + textHeight,
                    clientX,
                    clientY
                ) ||
                isPointCloseToLine(
                    x1 + textWidth,
                    y1 + textHeight,
                    x1,
                    y1 + textHeight,
                    clientX,
                    clientY
                ) ||
                isPointCloseToLine(x1, y1 + textHeight, x1, y1, clientX, clientY)
            );
        }
        default:
            throw new Error("not type");
    }
};