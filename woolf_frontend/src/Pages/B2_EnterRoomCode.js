import React from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import Name from '../Components/Name';
import socket from '../Components/socket';

function B2_EnterRoomCode({userName, roomID, onRoomIDUpdate, onHostUpdate}) {

  const navigate = useNavigate();

  const handleRoomIDChange = (event) => { onRoomIDUpdate(event.target.value); };

  const joinGame = () => {
    if (roomID) {
      onHostUpdate(false);
      // Connect to the server with the entered room ID
      socket.emit('joinRoom', roomID, userName);

      navigate(`/lobby/${roomID}`);

    } else { //FIX THIS TO SEARCH SERVER MAP FOR ROOM ID
      console.error('Please enter a valid room ID.');
    }
  };

  return (
    <div className='Container'>
        Woolf
        <Name userName={userName}/>
        <input input="text" value={roomID} maxLength="6" onChange={handleRoomIDChange} />
        <button className='NextButton' onClick={joinGame}>NEXT</button>
    </div>
  )
}

export default B2_EnterRoomCode