import React from "react";
import Tile from "./Tile";

const Board = ({board}) => {
    return (
        <div className="board">
            {board.flat().map((value, index) => (
                <Tile key={index} value={value}></Tile>
            ))}
        </div>
    );
}
export default Board;