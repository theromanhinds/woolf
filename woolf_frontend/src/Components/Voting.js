import React from 'react'
import { useEffect } from 'react';
import { useGameContext } from '../GameContext'

function Voting({onNextStep}) {

  const { socket, board, order, cluesList, voted, handleVoted, myVote, handleSetMostVoted, } = useGameContext();

  //FIX VOITING BUTTON FOR MISSING PLAYERS
  const handleVoteButtonClick = (index) => { handleVoted(order[index].userName); };

  useEffect(() => {
    socket.on('revealAnswer', (mostVoted) => {
        handleSetMostVoted(mostVoted);
        onNextStep();
     });
                       
    return () => {
      socket.off('revealAnswer');  
    };
  });

  return (
    <div className='VotingContainer'>
      <h1 className='VoteText'>VOTING</h1>
        <div className="Board">
              {board.map((word, index) => (
              <div key={index} className="BoardWord">
              {word} </div>
              ))}
          </div>
          <p className='VoteIndicator'>{voted ? `You voted for ${myVote}` : "Vote out the Woolf!"}</p>
          <hr className='Divider'></hr>
            <ul className='ClueList'> {cluesList.map((submittedClue, index) => (
                <li key={index}>
                  {submittedClue}
                  <button className='VoteButton' onClick={() => handleVoteButtonClick(index)} disabled={voted}>VOTE</button>
                </li>
                ))}
            </ul>
    </div>
  )
}

export default Voting