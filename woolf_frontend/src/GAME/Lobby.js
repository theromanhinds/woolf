import React from 'react'
import { useEffect } from 'react';
import socket from './socket';

import { useGameContext } from '../GameContext';

function Lobby({onNextStep}) {

    const { lobby, handleSetLobby, isHost, handleSetIsHost, handleGameStartRequest, gameStarted, handleGameStarted } = useGameContext();

    const handleStartButtonClick = () => {

        //RESET TO 3
        if (lobby.length >= 1){
            handleGameStartRequest();
        } else {
            console.log("not enough players to start");
        }

    }

    // Listen for updates to the lobby
    useEffect(() => {
        
        socket.on('updateRoom', (newRoomData) => {
            try {
                // Your logic here
                handleSetLobby(newRoomData);
            } catch (error) {
                console.error('Error processing initialPlayerList event:', error);
            }
        });

        //confirm host in new lobby
        if (lobby.length > 0){
            const hostPlayer = lobby.find(player => player.host == true);
            if (hostPlayer.id == socket.id) {
                handleSetIsHost(true);
            } else {
                handleSetIsHost(false);
            }
        }
      }, [lobby]);

      // Listen for game start
    useEffect(() => {
        
        socket.on('gameStarted', (gameData) => {
            handleGameStarted(gameData);
            onNextStep();
         });
                           
        return () => {
          socket.off('gameStarted');  // Clean up any subscriptions or side effects when the component unmounts
        };
      }, []);
      

    return (
        <div>
        <h2>Lobby</h2>
            <ul>
            {lobby.map((player) => (
                <li key={player.id}>{player.userName} {player.host && <span>(Host)</span>}</li>
            ))}
            </ul>
            {isHost ? (<button onClick={handleStartButtonClick}>Start Game</button>) : (<p>Waiting for Host...</p>)}
        </div>
    )
}

export default Lobby