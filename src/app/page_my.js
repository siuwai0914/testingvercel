"use client"
import Image from "next/image";
import Board from "./Component/Board";
import React, { useEffect, useState } from "react";

export default function Home() {


  const createInitialBoard = () => {
    let board = [];
    for (let i = 0 ; i < 4 ; i++){
      board.push(Array(4).fill(null));
    }
    board = addNewTile(board);
    board = addNewTile(board);
    return board;
  }

  const addNewTile = (board) => {
    const emptyCells = [];
    for (let row = 0 ; row < board.length ; row++){
      for (let col = 0 ; col < board[0].length ; col++){
        if (board[row][col] === null){
          emptyCells.push( {row, col});
        }
      }
    }

    if (emptyCells.length > 0){
      const index = Math.floor(Math.random() * emptyCells.length);
      const {row, col} = emptyCells[index];
      board[row][col] = 2;
    }
    return board;
  }

  const [board, setBoard] = useState(createInitialBoard());
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [topScores, setTopScores] = useState(localStorage.getItem("newTopScores") !== null ?
   JSON.parse(localStorage.getItem("newTopScores")) : []);
  const [nameInput, setNameInput] = useState("");
  const [showInput, setShowInput] = useState(false);


  const moveUp = () => {
    const newBoard = [...board]; 
    const newBoardString = JSON.stringify(newBoard);
    for (let col = 0 ; col < 4 ; col++){
      let newCol = newBoard.map( (row) => row[col]).filter( (val) => val != null);
      
      for (let row = 0 ; row < newCol.length - 1 ; row++){
        if (newCol[row] == newCol[row+1]){
          newCol[row] *= 2;
          setScore(score + newCol[row]);
          newCol.splice(row + 1, 1);
        }
      }
      // newCol = [4] i < 3
      const colLength = newCol.length;
      for (let i = 0 ; i < 4 - colLength ; i++){
        newCol.push(null);
      }
      for (let row = 0 ; row < 4 ; row++){
        newBoard[row][col] = newCol[row];
      }      
    }
    if (newBoardString === JSON.stringify(newBoard)){
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  }

  const moveDown = () => {
    const newBoard = [...board]; 
    const newBoardString = JSON.stringify(newBoard);
    for (let col = 0 ; col < 4 ; col++){
      let newCol = newBoard.map( (row) => row[col]).filter( (val) => val != null);
      
      for (let row = newCol.length - 1 ; row > 0 ; row--){
        if (newCol[row] == newCol[row - 1]){
          newCol[row] *= 2;
          setScore(score + newCol[row]);
          newCol.splice(row - 1, 1);
          row--;
        }
      }
      // newCol = [null, null, null, 8]
      const colLength = newCol.length;
      for (let i = 0 ; i < 4 - colLength ; i++){
        newCol.unshift(null);
      }
      for (let row = 0 ; row < 4 ; row++){
        newBoard[row][col] = newCol[row];
      }      
    }
    if (newBoardString === JSON.stringify(newBoard)){
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  }

  const moveLeft = () => {
    const newBoard = [...board]; 
    const newBoardString = JSON.stringify(newBoard);
    for (let row = 0 ; row < 4 ; row++){
      let newRow = newBoard[row].filter( (val) => val != null);
      
      for (let col = 0 ; col < newRow.length - 1 ; col++){
        if (newRow[col] == newRow[col+1]){
          newRow[col] *= 2;
          setScore(score + newRow[col]);
          newRow.splice(col + 1, 1);
          col++;
        }
      }
      const colLength = newRow.length;
      for (let i = 0 ; i < 4 - colLength ; i++){
        newRow.push(null);
      }
      for (let col = 0 ; col < 4 ; col++){
        newBoard[row][col] = newRow[col];
      }      
    }
    if (newBoardString === JSON.stringify(newBoard)){
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  }

  const moveRight = () => {
    const newBoard = [...board]; 
    const newBoardString = JSON.stringify(newBoard);
    for (let row = 0 ; row < 4 ; row++){
      let newRow = newBoard[row].filter( (val) => val != null);
      
      for (let col = newRow.length - 1 ; col > 0 ; col--){
        if (newRow[col] == newRow[col-1]){
          newRow[col] *= 2;
          setScore(score + newRow[col]);
          newRow.splice(col - 1, 1);
          col--;
        }
      }
      const colLength = newRow.length;
      for (let i = 0 ; i < 4 - colLength ; i++){
        newRow.unshift(null);
      }
      for (let col = 0 ; col < 4 ; col++){
        newBoard[row][col] = newRow[col];
      }      
    }
    if (newBoardString === JSON.stringify(newBoard)){
      return;
    }
    const updatedBoard = addNewTile(newBoard);
    setBoard(updatedBoard);
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp"){
      moveUp();
    }else if (event.key === "ArrowDown"){
      moveDown();
    }else if (event.key === "ArrowLeft"){
      moveLeft();
    }else if (event.key === "ArrowRight"){
      moveRight();
    }
  }

  useEffect( () => {
    window.addEventListener("keydown", handleKeyDown);
    if (checkGameOver()){
      setGameover(true);
      if (score > topScores[topScores.length - 1] || topScores.length < 10){
        setShowInput(true);
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [board]);

  const checkGameOver = () => {
    for (let row = 0 ; row < board.length ; row++){
      for (let col = 0 ; col < board[0].length ; col++){
        if (board[row][col] === null){
          return false;
        }
        // check horizontal and vertical adjacent tiles
        if ((row < board.length - 1 && board[row][col] === board[row+1][col]) || (col < board[0].length - 1 && board[row][col] === board[row][col+1])){
          return false;
        }
      }
    }
    return true;
  }

  const retry = () => {
    setScore(0);
    setGameover(false);
    setBoard(createInitialBoard());
    setShowInput(false);
  }

  const handleNameChange = (event) => {
    setNameInput(event.target.value);
  }

  const submitScore = () => {
    if (nameInput.trim() !== ""){
      const newTopScores = [...topScores];
      newTopScores.push({name: nameInput, score: score});
      newTopScores.sort((a,b) => b.score - a.score);
      newTopScores.splice(10);
      setTopScores(newTopScores);
      setShowInput(false);
      setNameInput("");
      localStorage.setItem("newTopScores", JSON.stringify(newTopScores));
    } 
  }

  return (
    <main className="game-container">
      <header className="header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          <div className="score-label">Score</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="score-container">
          <div className="score-label">Score</div>
          <div className="score-value">{score}</div>
        </div>
      </header>
      
      <div className="game-board-container">
            <Board board={board}/>
            <div className="scoreboard-container">
                <h2 className="scoreboard-title">Leaderboard</h2>
                <ul className="scoreboard">
                    {topScores.map((score, index) => (
                    <li key={index}>
                        <div className="scoreboard-item">
                            <span className="scoreboard-name">{score.name}</span>
                            <span className="scoreboard-score">{score.score}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
      {gameover && (
        <button className="retry-button" onClick={retry}>Retry</button>
      )}

      {showInput && (<div className="name-input-container">
        <input type="text" className="nameInput" placeholder="Enter your name" value={nameInput} onchange={handleNameChange}></input>
        <button className="submit-button" onClick={submitScore}>Submit</button>
      </div>)}
    </main>
  );
}
