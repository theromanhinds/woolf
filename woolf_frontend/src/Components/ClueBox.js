import React from 'react';
import { useGameContext } from '../GameContext';
import { useEffect } from 'react';

function ClueBox({onNextStep}) {

    const { socket, clue, cluesList, handleSetClue, handleClueSubmit, handleNewClue, resetClue, yourTurn, turnNumber, handleSetTurnNumber, checkTurn, currentTurn, handleSetCurrentTurn } = useGameContext();

    const handleClueChange = (event) => { handleSetClue(event.target.value); };

    const verifyClueSubmit = () => {

        if (clue) {
            if (clue.trim() !== '') {
            handleClueSubmit(clue);
            resetClue();
            }
        }
    }

    //check for your turn at start of game
    useEffect(() => {
        checkTurn(turnNumber);
        handleSetCurrentTurn(turnNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
          socket.on('updateTurn', (newTurnNumber) => {
            handleSetTurnNumber(newTurnNumber);
            handleSetCurrentTurn(newTurnNumber);
            checkTurn(newTurnNumber);
          });
        
        return () => {
            socket.off('updateTurn');
        };
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
    //only called for receivers of a clue
    useEffect(() => {
        socket.on('newClue', (newClue) => {
            handleNewClue(newClue);
        });

        return () => {
            socket.off('newClue'); 
        };
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [socket, handleNewClue]);

      useEffect(() => {
        
        socket.on('startVoting', () => {
            onNextStep();
         });
                           
        return () => {
          socket.off('startVoting');  
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

  return (
    <div className='ClueBoxContainer'>
        <div className='ClueBox'>
        
        <h2 className='ClueText'>CLUES</h2>
        <p className='TurnIndicator'>{yourTurn ? "It's YOUR turn!" : `${currentTurn} is typing a clue.`}</p>
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