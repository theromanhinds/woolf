import React from 'react'
import { useGameContext } from '../GameContext'
import { useEffect } from 'react';
import ClueBox from './ClueBox';

function GameBoard({handleNextStep}) {

  const { userName, roomID, role, topic, answer, board } = useGameContext();
    
  if (!board) {
    return (
      <div>
        <h3>GameBoard</h3>
        <p>Loading...</p>
      </div>
    );
  }
 
  return (
    <div className='BoardContainer'>
      <h2 className='GameText'>TOPIC: {topic}</h2>
        <h3 className='GameText'>Role: {role} / Answer: {role == 'WOOLF' ? '???' : answer}</h3>
        <div className="Board">
            {board.map((word, index) => (
            <div key={index} className="BoardWord">
            {word} </div>
            ))}
        </div>
        <ClueBox onNextStep={handleNextStep}/>
    </div>
  )
}

export default GameBoard