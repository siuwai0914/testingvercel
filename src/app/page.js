"use client";
import React, { useState, useEffect } from 'react';
import Board from './Component/Board';
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
    const TIME_LEFT = 60
    const createInitialBoard = () => {
        let board = [];
        for (let i = 0; i < 4; i++) {
          board.push(Array(4).fill(null));
        }
      
        // Call addNewTile twice
        board = addNewTile(board);
        board = addNewTile(board);
      
        return board;
    };

    const addNewTile = (board) => {
        // Find all empty tiles

        const emptyCells = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }
        //If there is an empty tile:
        if (emptyCells.length > 0) {
            // Random pick a empty tile
            const randomIndex = Math.floor(Math.random() * emptyCells.length);

            // Get the corresponding column and row
            const { row, col } = emptyCells[randomIndex];

            //Set the value of picked tile with 2
            board[row][col] = 2;
        }

        return board;
    };

    const moveUp = () => {
        const newBoard = [...board];

        const originalBoardString = JSON.stringify(newBoard);

        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null); // Extract and consolidate non-null values in the column
            for (let row = 0; row < newCol.length - 1; row++) {
                if (newCol[row] === newCol[row + 1]) {
                    // Merge identical tiles
                    newCol[row] *= 2;
                    newCol.splice(row + 1, 1);
                    setScore(score + newCol[row]);
                }
            }
            while (newCol.length < 4) {
                newCol.push(null); // Add nulls to fill the column
            }
            for (let row = 0; row < 4; row++) {
                newBoard[row][col] = newCol[row]; // Update the board with the new column values
            }
        }
        const newBoardString = JSON.stringify(newBoard);
        if (newBoardString === originalBoardString){
          return;
        }
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard); 
        
        
    };
    
    const moveDown = () => {
        const newBoard = [...board];

        const originalBoardString = JSON.stringify(newBoard);
        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null);
            for (let row = newCol.length - 1; row > 0; row--) {
                if (newCol[row] === newCol[row - 1]) {
                    newCol[row] *= 2;
                    setScore(score + newCol[row])
                    newCol.splice(row - 1, 1);
                    row--;
                }
            }
            while (newCol.length < 4) {
                newCol.unshift(null); // Add nulls at the start to push tiles down
            }
            for (let row = 0; row < 4; row++) {
                newBoard[row][col] = newCol[row];
            }
        }
        const newBoardString = JSON.stringify(newBoard);
        if (newBoardString === originalBoardString){
          return;
        }
          const updatedBoard = addNewTile(newBoard);
          setBoard(updatedBoard); 
    }

    const moveLeft = () => {
        const newBoard = [...board];
        const originalBoardString = JSON.stringify(newBoard);

        for (let row = 0; row < 4; row++) {
          let newRow = newBoard[row].filter((val) => val !== null);
          for (let col = 0; col < newRow.length - 1; col++) {
            if (newRow[col] === newRow[col + 1]) {
              newRow[col] *= 2;
              newRow.splice(col + 1, 1);
              setScore(score + newRow[col])
              col++;
            }
          }
          while (newRow.length < 4) {
            newRow.push(null);
          }
          newBoard[row] = newRow;
        }
        const newBoardString = JSON.stringify(newBoard);
        if (newBoardString === originalBoardString){
          return;
        }
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard); 

    };

    const moveRight = () => {
        const newBoard = [...board];
        const originalBoardString = JSON.stringify(newBoard);
        for (let row = 0; row < 4; row++) {
            let newRow = newBoard[row].filter((val) => val !== null); 
            for (let col = newRow.length - 1; col > 0; col--) {
                if (newRow[col] === newRow[col - 1]) {
                    newRow[col] *= 2;
                    setScore(score + newRow[col])
                    newRow.splice(col - 1, 1); // Remove merged tile
                    col--; // Adjust index after merge
                }
            }
            while (newRow.length < 4) {
                newRow.unshift(null);
            }
            newBoard[row] = newRow;
        }
        const newBoardString = JSON.stringify(newBoard);
        if (newBoardString === originalBoardString){
          return;
        }
          const updatedBoard = addNewTile(newBoard);
          setBoard(updatedBoard); 
        
    };

    const [board, setBoard] = useState(createInitialBoard());
    const [score, setScore] = useState(0);
    const [gameover, setGameover] = useState(false);
    const [topScores, setTopScores] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem('topScores')) || [];
        }
        return [];
    });
    const [timeAttackScores, setTimeAttackScores] = useState(() => {
        if (typeof window !== "undefined") {
            return JSON.parse(localStorage.getItem('timeAttackScores')) || [];
        }
        return [];
    });
    const [nameInput, setNameInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [isTimeAttack, setIsTimeAttack] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
        
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        if (checkGameOver()) {
            setGameover(true);
            if ((isTimeAttack && (timeAttackScores.length < 10 || timeAttackScores[timeAttackScores.length - 1].score < score)) ||
                (!isTimeAttack && (topScores.length < 10 || topScores[topScores.length - 1].score < score))) {
                setShowInput(true);
            }
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [board]);

  useEffect( () => {
    let timer;
    if (isTimeAttack && !gameover && timeLeft > 0){
        timer = setInterval( () => {
            setTimeLeft( (prevTime) => prevTime - 1);
        }, 1000);
    }else if (timeLeft === 0){
        setGameover(true);
    }
    return () => clearInterval(timer);
  }, [isTimeAttack, timeLeft, gameover])

  useEffect(() => {
    if (typeof window !== "undefined") {
        localStorage.setItem('topScores', JSON.stringify(topScores));
    }
}, [topScores]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem('timeAttackScores', JSON.stringify(timeAttackScores));
        }
    }, [timeAttackScores]);

  const handleKeyDown = (event) => {
    if (!gameover){
        if (event.key === "ArrowUp") {
            moveUp();
        } else if (event.key === "ArrowDown") {
            moveDown();
        } else if (event.key === "ArrowLeft") {
            moveLeft();
        } else if (event.key === "ArrowRight") {
            moveRight();
        }
    }
  };

  const checkGameOver = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
          if (board[row][col] === null) {
              return false;
          }
          if ((col < 3 && board[row][col] === board[row][col + 1]) || 
            (row < 3 && board[row][col] === board[row + 1][col])){
            return false;
          }
      } 
    }
    return true;
  }

   // add a new function retry()
   const retry = () => {
        setBoard(createInitialBoard());
        setScore(0);
        setGameover(false);
        setShowInput(false);
        if (isTimeAttack) setTimeLeft(TIME_LEFT);
    };

   const handleNameChange = (event) => {
    setNameInput(event.target.value);
   }

   const submitScore = () => {
    if (nameInput.trim() !== "") {
        if (isTimeAttack) {
            const newTimeAttackScores = [...timeAttackScores];
            newTimeAttackScores.push({ name: nameInput, score: score });
            newTimeAttackScores.sort((a, b) => b.score - a.score);
            newTimeAttackScores.splice(10);
            setTimeAttackScores(newTimeAttackScores);
        } else {
            const newTopScores = [...topScores];
            newTopScores.push({ name: nameInput, score: score });
            newTopScores.sort((a, b) => b.score - a.score);
            newTopScores.splice(10);
            setTopScores(newTopScores);
        }
        setNameInput("");
        setShowInput(false);
    }
};

   const handleTimeAttackClick = () => {
    setIsTimeAttack(true);
    retry();
    setTimeLeft(60);
   }

   const handleNormalModeClick = () => {
    setIsTimeAttack(false);
    retry();
   }

    return (
        <main className="game-container">
        <header className="header">
            <h1 className="title">2048</h1>
            <div className="score-container">
                <div className="score-box">SCORE</div>
                <div className="score-value">{score}</div>
            </div>
            {isTimeAttack && (
                <div className="timer-container">
                    <div className="timer-box">TIME LEFT</div>
                    <div className="timer-value">{timeLeft}</div>
                </div>
            )}
        </header>
        <div className="game-board-container">
            <Board board={board}/>
            <div className="scoreboard-container">
                <h2 className="scoreboard-title">Leaderboard</h2>
                <ul className="scoreboard">
                    {(isTimeAttack ? timeAttackScores : topScores).map((score, index) => (
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
        {!isTimeAttack && (
            <button className="time-attack-button" onClick={handleTimeAttackClick}>
                Time Attack Mode
            </button>
        )}
        {isTimeAttack && (
            <button className="normal-mode-button" onClick={handleNormalModeClick}>
                Normal Mode
            </button>
        )}
        {showInput && (
            <div className="name-input-container">
                <input
                    type="text"
                    className="name-input"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={handleNameChange}
                />
                <button className="submit-button" onClick={submitScore}>
                    Submit
                </button>
            </div>
        )}
        {gameover && (
            <button className="retry-button" onClick={retry}>
            Retry
            </button>
        )}
      </main>
    );
}