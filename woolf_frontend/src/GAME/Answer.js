import React from 'react'
import { useGameContext } from '../GameContext'
import { useEffect } from 'react';
import socket from './socket';

function Answer({resetStep}) {

    const { woolf, answer, mostVoted, ready, handleReady, resetGame } = useGameContext();
    
    const handleReadyButtonClick = () => {
        handleReady();
        console.log("this player is ready");
    };

    useEffect(() => {
        
        socket.on('newRound', () => {
            resetStep();
            resetGame();
         });
                           
        return () => {
          socket.off('newRound');  
        };
      }, []);

  return (
    <div>
        <h3>Answer</h3>
        <p>most voted: {mostVoted}</p>
        <p>woolf: {woolf}</p>
        <p>answer: {answer}</p>
        <button disabled={ready} onClick={handleReadyButtonClick}>Ready</button>
    </div>
  )
}

export default Answer