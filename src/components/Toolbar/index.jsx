import React from 'react'
import classes from "./index.module.css"
import cn from "classnames"
import { useContext } from 'react'
import boardContext from '../../store/board-context.jsx'
import {
    FaSlash,
    FaRegCircle,
    FaArrowRight,
    FaPaintBrush,
    FaEraser,
    FaUndoAlt,
    FaRedoAlt,
    FaFont,
    FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from '../../store/constants'



const Toolbar = () => {
    const { activeToolItem, changeToolHandler, UndoHandler, RedoHandler } = useContext(boardContext);
    // console.log(boardContext);
    const handleDownloadClick = () => {
        const canva = document.getElementById("canvas");
        const data = canva.toDataURL("image/jpg");
        const anchor = document.createElement("a");
        anchor.href = data;
        anchor.download = "whiteBoard.jpg";
        anchor.click();
    }

    return (
        <>
            <div className={cn(classes.container)} >
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.BRUSH })} onClick={() => { changeToolHandler("BRUSH") }}>
                    <FaPaintBrush />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.LINE })} onClick={() => { changeToolHandler("LINE") }}>
                    <FaSlash />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.RECTANGLE })} onClick={() => { changeToolHandler("RECTANGLE") }}>
                    <LuRectangleHorizontal />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.CIRCLE })} onClick={() => { changeToolHandler("CIRCLE") }}>
                    <FaRegCircle />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.ARROW })} onClick={() => { changeToolHandler("ARROW") }}>
                    <FaArrowRight />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.ERASER })} onClick={() => { changeToolHandler("ERASER") }}>
                    <FaEraser />
                </div>
                <div className={cn(classes.toolItem, { [classes.toolItemActive]: activeToolItem === TOOL_ITEMS.TEXT })} onClick={() => { changeToolHandler("TEXT") }}>
                    <FaFont />
                </div>
                <div className={classes.toolItem} onClick={UndoHandler}>
                    <FaUndoAlt />
                </div>
                <div className={classes.toolItem} onClick={RedoHandler} >
                    <FaRedoAlt />
                </div>
                <div className={classes.toolItem} onClick={handleDownloadClick} >
                    <FaDownload />
                </div>
            </div >
            {/* {console.log(activeToolItem)} */}
        </>
    )
}

export default Toolbar