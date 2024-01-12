import React from 'react'
import '../App.css';
import { useGameContext } from '../GameContext';

function CreateJoin({onNextStep}) {

  const { handleCreateRoomID } = useGameContext();

  const handleJoinButtonClick = () => { onNextStep(); };

  const handleCreateButtonClick = () => { handleCreateRoomID(); };

  return (
    <div className='Container'>
        Woolf
        <button onClick={handleCreateButtonClick}>Create Game</button>
        <button onClick={handleJoinButtonClick}>Join Game</button>
    </div>
  )
}

export default CreateJoin
