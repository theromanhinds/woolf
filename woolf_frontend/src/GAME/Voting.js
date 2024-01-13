import React from 'react'
import { useEffect } from 'react';
import { useGameContext } from '../GameContext'
import socket from './socket';

function Voting({onNextStep}) {

  const { order, cluesList, voted, handleVoted, handleSetMostVoted, } = useGameContext();

  const handleVoteButtonClick = (index) => {
    handleVoted(order[index].userName);
    console.log("you voted for :", order[index].userName);
  }

  useEffect(() => {
        
    socket.on('revealAnswer', (mostVoted) => {
        handleSetMostVoted(mostVoted);
        onNextStep();
     });
                       
    return () => {
      socket.off('revealAnswer');  
    };
  }, []);

  return (
    <div>
      <h3>Voting</h3>
            <ul> {cluesList.map((submittedClue, index) => (
                <li key={index}>
                  {submittedClue}
                  <button onClick={() => handleVoteButtonClick(index)} disabled={voted}>VOTE</button>
                </li>
                ))}
            </ul>
    </div>
  )
}

export default Voting