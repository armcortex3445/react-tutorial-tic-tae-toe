import {useState} from 'react';

function Square({value, onSquareClick,hilight}) {

  const className = hilight ? "hilight-square" : "square";


  return (
    <button 
    className={className} 
    onClick={onSquareClick} 
    >
      {value}
    </button>
  );
}

function calculateResult(squares,move){
  const ret = {winner : null , squares : null , isDraw : false};
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
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
       ret.winner = squares[a];
       ret.squares = lines[i];
      break;
    }
  }

  if(move === 9 && !ret.winner){
    ret.isDraw = true;
  }

  return ret;
}

function isHilighted(index,winnerSquares){

  if(!winnerSquares) return false;

  for(let i = 0; i < 3; i++){
    if(index === winnerSquares[i]){
      
      return true;
    }
  }

}


function Board({xIsNext , squares, onPlay, currentMove}) {
  const result = calculateResult(squares,currentMove);
  let status;
  const size = 3;
  const array = Array.from({length : size} , (_, index) => index);
  
  if(result.winner) {
    status = "Winner: " + result.winner;
  }else if(result.isDraw){
    status = "Draw";
  }
  else{
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }



  function handleClick(i) {

    if(squares[i] || calculateResult(squares).winner) return;

    const nextSquares = squares.slice();
    const newPosition = { row : parseInt(i/size , 10) , col : i%size};


    if(xIsNext)  nextSquares[i] = "X";
    else nextSquares[i] = "O";
  
    onPlay(nextSquares,newPosition);

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
              hilight={isHilighted(row*size+col,result.squares)}
            />
          ))}
        </div>
    ))}
  </>
  );
}

function MoveHistoryList(moveHistory){

  const ArrHistory = moveHistory.moveHistory;

  if(!Array.isArray(ArrHistory)) {
    return null;
  }

  return (
    ArrHistory.map(ele => {
      if(ele === null) return null;

      const value = `(${ele.row},${ele.col})`

      return <button className="position-history">{value}</button>

    })
  )
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [curMove,setCurMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const displayOrder = ascending ? "ascending" : "descending";
  const currentSquares = history[curMove];
  const xIsNext = (curMove %2 ===0);
  const moveDescription = `You are at move#${curMove}`
  const [moveHistory, setMoveHistory] = useState([]);

  function handlePlay(nextSquares,newPosition) {
    const nextHistory = [...history.slice(0,curMove+1),nextSquares];
    const nextMoveHistory = [ ...moveHistory.slice(0,curMove),newPosition];
    setHistory(nextHistory);
    setCurMove(nextHistory.length - 1);
    console.log(nextMoveHistory);
    setMoveHistory(nextMoveHistory);
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={curMove} />
      </div>
      <div className="game-info">
        <ol>{currMoves}</ol>
        <p>{moveDescription}</p>
      </div>
      <div className="toolbar">
        <button onClick={() => setAscending(!ascending)}>{displayOrder}</button>  
      </div>  
      <div className="toolbar">
        <MoveHistoryList moveHistory={moveHistory} />
      </div>  
    </div>
  )
    
}
