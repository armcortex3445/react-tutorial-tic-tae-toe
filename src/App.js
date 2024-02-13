import {useState} from 'react';

function Square({value, onSquareClick}) {

  return (
    <button 
    className="square" onClick={onSquareClick} >
      {value}
    </button>
  );
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
}


function Board({xIsNext , squares, onPlay}) {
  const winner = calculateWinner(squares);
  let status;
  const size = 3;
  const array = Array.from({length : size} , (_, index) => index);
  
  if(winner) {
    status = "Winner: " + winner;
  }else{
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }



  function handleClick(i) {

    if(squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    if(xIsNext)  nextSquares[i] = "X";
    else nextSquares[i] = "O";
  
    onPlay(nextSquares);

  }


  return(
  <>
    <div className="status"> {status} </div>
    {array.map(row => (
        <div key={row} className="board-row">
          {array.map( col => (
            <Square 
              key={col}
              value={squares[row*size+col]}
              onSquareClick={() => handleClick(row*size + col)}
            />
          ))}
        </div>
    ))}
  </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [curMove,setCurMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const displayOrder = ascending ? "ascending" : "descending";
  const currentSquares = history[curMove];
  const xIsNext = (curMove %2 ===0);
  const moveDescription = `You are at move#${curMove}`

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0,curMove+1),nextSquares];
    setHistory(nextHistory);
    setCurMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurMove(nextMove);
  }



  const moves = history.map((squares,move) => {
    let description ='';
    if(move > 0){
      description = `Go to move #${move}`;
    }
    else{
      description = `Go to game start`
    }

    return (
      <li key="{move}">
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>  
    )

  })

  const reverseMoves = [...moves].reverse();
  const currMoves = ascending ? moves : reverseMoves;



  return (
    <div className="game"> 
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{currMoves}</ol>
        <p>{moveDescription}</p>
      </div>
      <div className="toolbar">
        <button onClick={() => setAscending(!ascending)}>{displayOrder}</button>  
      </div>  
    </div>
  )
    
}

