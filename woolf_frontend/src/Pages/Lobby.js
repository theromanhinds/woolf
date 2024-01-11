import React from 'react'
import { useEffect } from 'react';
import socket from '../Components/socket';
import { useNavigate } from 'react-router-dom';

function Lobby({roomID, lobby, onLobbyUpdate, isHost, onHostUpdate, onGameStartUpdate, onGameDataUpdate, onRoleUpdate}) {

    const navigate = useNavigate();

    socket.on('gameStarted', (gameData) => {
        onGameDataUpdate(gameData);
        
        for(var obj of gameData.roles) {
            if (obj.id == socket.id) {
                onRoleUpdate(obj.role);
            }
        }

        navigate(`/game/${roomID}`);
    });

    useEffect(() => {
        // Listen for updates to the player list
        socket.on('updateRoom', (newRoomData) => {
            try {
                // Your logic here
                onLobbyUpdate(newRoomData);
            } catch (error) {
                console.error('Error processing initialPlayerList event:', error);
            }
        });

        if (lobby.length > 0){
            const hostPlayer = lobby.find(player => player.host == true);
            if (hostPlayer.id == socket.id) {
                onHostUpdate(true);
            }
        }

                           
        return () => {
          //socket.disconnect(); // Clean up the socket connection when the component unmounts
          // OR
          //socket.off();  // Clean up any subscriptions or side effects when the component unmounts
        };
      }, [lobby]);

      

    return (
        <div>
        <h2>Lobby</h2>
            <ul>
            {lobby.map((player) => (
                <li key={player.id}>{player.name} {player.host && <span>(Host)</span>}</li>
            ))}
            </ul>
            {isHost ? (<button onClick={onGameStartUpdate}>Start Game</button>) : (<p>Waiting for Host...</p>)}
        </div>
    )
}

export default Lobby