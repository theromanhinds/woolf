import React from 'react';
import socket from './socket';
import { useGameContext } from '../GameContext';
import { useEffect } from 'react';

function ClueBox({onNextStep}) {

    const { clue, cluesList, handleSetClue, handleClueSubmit, handleNewClue, resetClue, yourTurn, nextTurn, turnNumber, checkTurn } = useGameContext();

    const handleClueChange = (event) => { handleSetClue(event.target.value); };

    const verifyClueSubmit = () => {

        if (clue) {
            if (clue.trim() !== '') {
            handleClueSubmit(clue);
            resetClue(); // Clear the input after submitting
            }
        }
    }

    //check for your turn at start of game
    useEffect(() => {
        console.log("reset turn num ", turnNumber);
        checkTurn(turnNumber);
    })
    
    //only called for receivers of a clue
    useEffect(() => {

        socket.on('newClue', (newClue) => { 
            handleNewClue(newClue);
            nextTurn(); 
        });

        return () => {
            socket.off('newClue');  // Clean up any subscriptions or side effects when the component unmounts
        };
        
      }, [handleNewClue, nextTurn, cluesList]);

      useEffect(() => {
        
        socket.on('startVoting', () => {
            onNextStep();
         });
                           
        return () => {
          socket.off('startVoting');  
        };
      });


  return (
    <div className='ClueBoxContainer'>
        <div className='ClueBox'>
        
        <h2 className='BoardText'>CLUES</h2>
        <p>{yourTurn ? "It's YOUR turn!" : "It's NOT your turn!"}</p>
            <ul> {cluesList.map((submittedClue, index) => (
                <li key={index}>{submittedClue}</li>
                ))}
            </ul>
        <div className='ClueSubmitContainer'>
            <input type="text"
            value={clue}
            onChange={handleClueChange}
            disabled={!yourTurn}
            maxLength="16"
            className='ClueInput'></input>
            <button className='ClueSubmit' disabled={!yourTurn} onClick={verifyClueSubmit}>SEND</button>
        </div>
    </div>
    </div>
  )
}

export default ClueBox