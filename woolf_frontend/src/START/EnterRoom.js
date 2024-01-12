import React from 'react'
import '../App.css'
import { useGameContext } from '../GameContext';
import socket from '../GAME/socket';

function EnterRoom() {

  const { roomID, handleEnterRoomID, handleJoinRoom } = useGameContext();
 
  const handleRoomIDChange = (event) => { handleEnterRoomID(event.target.value); };

  const handleJoinButtonClick =  () => { handleJoinRoom(); };

  return (
    <div className='Container'>
        Enter Room Code:
        <input input="text" value={roomID} maxLength="6" onChange={handleRoomIDChange} />
        <button className='NextButton' onClick={handleJoinButtonClick}>NEXT</button>
    </div>
  )
}

export default EnterRoom