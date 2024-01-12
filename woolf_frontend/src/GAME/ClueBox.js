import React from 'react';
import socket from './socket';
import { useGameContext } from '../GameContext';
import { useEffect } from 'react';

function ClueBox() {

    const { clue, cluesList, handleSetClue, handleClueSubmit, handleNewClue, resetClue, yourTurn, nextTurn, turnNumber, checkTurn } = useGameContext();

    const handleClueChange = (event) => { handleSetClue(event.target.value); };

    const verifyClueSubmit = () => {

        if (clue.trim() !== '') {
            handleClueSubmit(clue);
            resetClue(); // Clear the input after submitting
        }
    }

    useEffect(() => {
        
        checkTurn(turnNumber);

        socket.on('newClue', (newClue) => {
            handleNewClue(newClue);
            nextTurn();
        });

        return () => {
            socket.off('newClue');  // Clean up any subscriptions or side effects when the component unmounts
        };
        
      }, [cluesList]);

  return (
    <div className='ClueBox'>

        <h3>Clues</h3>
            <ul> {cluesList.map((submittedClue, index) => (
                <li key={index}>{submittedClue}</li>
                ))}
            </ul>

        <input type="text"
        value={clue}
        onChange={handleClueChange}
        disabled={!yourTurn}></input>
        <button disabled={!yourTurn} onClick={verifyClueSubmit}>Send</button>
    </div>
  )
}

export default ClueBox