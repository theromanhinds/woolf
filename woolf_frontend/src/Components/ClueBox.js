import React from 'react';
import socket from './socket';

function ClueBox({clue, cluesList, handleClueChange, handleClueSubmit, handleClueReset, yourTurn}) {

    const verifyClueSubmit = () => {

        if (clue.trim() !== '') {
            handleClueSubmit(clue);
            handleClueReset(''); // Clear the input after submitting
        }
    }

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