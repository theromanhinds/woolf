import React from 'react'
import { useGameContext } from '../GameContext'
import { useEffect } from 'react';
import ClueBox from './ClueBox';

function GameBoard() {

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
    <div>
        <h3>GameBoard</h3>
        <p>Name: {userName}, Room: {roomID}</p>
        <p>Role: {role}, Topic: {topic}, Answer: {answer}</p>
        <div className="BoardContainer">
            {board.map((word, index) => (
            <div key={index} className="BoardWord">
            {word} </div>
            ))}
        </div>
        <ClueBox/>
    </div>
  )
}

export default GameBoard