import React from 'react'
import '../App.css';
import Name from '../Components/Name';
import { useNavigate } from 'react-router-dom';
import socket from '../Components/socket';

function B_CreateJoinGame({userName, roomID}) {

  const navigate = useNavigate();

  const handleJoinButtonClick = () => {
    navigate('/enter_room_code');
  };

  const createGame = () => {
    
    // Connect to the server with the generated room ID
    socket.emit('createRoom', roomID, userName);

    if(roomID){
      navigate(`/lobby/${roomID}`);
    }
    
  };

  return (
    <div className='Container'>
        Woolf
        <Name userName={userName}/>
        <button onClick={createGame}>Create Game</button>
        <button onClick={handleJoinButtonClick}>Join Game</button>
    </div>
  )
}

export default B_CreateJoinGame
