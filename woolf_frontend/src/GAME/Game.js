import React from 'react'
import { useState } from 'react';

import Lobby from './Lobby';
import GameBoard from './GameBoard';
import Voting from './Voting';
import Answer from './Answer';

function Game() {

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
      setCurrentStep((prevStep) => prevStep + 1);
  };

  const resetStep = () => {
    setCurrentStep(1);
  }
 
  return (
    <div className='GameContainer'>
      {currentStep === 1 && <Lobby onNextStep={handleNextStep}/>}
      {currentStep === 2 && <GameBoard handleNextStep={handleNextStep} />}
      {currentStep === 3 && <Voting onNextStep={handleNextStep}/>}
      {currentStep === 4 && <Answer resetStep={resetStep}/>}
      {/* <GameHeader roomID={roomID} userName={userName}/>
      <div className='GameContainer'>
        <p>Welcome to the Game!</p>
        <p>Your Topic is: {gameData.topic}</p>
        <p>Your Role is: {role}</p>
        <p>The Answer is: {role == 'woolf' ? '???' : gameData.answer}</p>
        <GameBoard words={gameData.board}/>
      </div>
      <ClueBox clue={clue} cluesList={cluesList} handleClueChange={handleClueChange} handleClueSubmit={handleClueSubmit} handleClueReset={handleClueReset} yourTurn={yourTurn}/> */}
    </div>
  )
}

export default Game