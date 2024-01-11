import React from 'react'
import GameHeader from './GameHeader'
import ClueBox from './ClueBox';
import GameBoard from './GameBoard';


function Game({roomID, userName, gameData, role, onClueUpdate, clue, cluesList, onClueSubmit, onClueReset, yourTurn}) {

  const handleClueChange = (event) => { onClueUpdate(event.target.value); };

  const handleClueSubmit = (newClue) => {
    onClueSubmit(newClue);
  }

  const handleClueReset = () => {
    onClueReset();
  }

  return (
    <div className='Game'>
      <GameHeader roomID={roomID} userName={userName}/>
      <div className='GameContainer'>
        <p>Welcome to the Game!</p>
        <p>Your Topic is: {gameData.topic}</p>
        <p>Your Role is: {role}</p>
        <p>The Answer is: {role == 'woolf' ? '???' : gameData.answer}</p>
        <GameBoard words={gameData.board}/>
      </div>
      <ClueBox clue={clue} cluesList={cluesList} handleClueChange={handleClueChange} handleClueSubmit={handleClueSubmit} handleClueReset={handleClueReset} yourTurn={yourTurn}/>
    </div>
  )
}

export default Game