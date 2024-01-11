import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useState, useEffect } from 'react';
import A_EnterName from './Pages/A_EnterName';
import B2_EnterRoomCode from './Pages/B2_EnterRoomCode';
import B_CreateJoinGame from './Pages/B_CreateJoinGame';
import Lobby from './Pages/Lobby';
import Game from './Components/Game';

import socket from './Components/socket';

function App() {

  //I WANT TO ROLL UP ALL THESE STATES INTO ONE OBJECT
  const [userName, setUserName] = useState('');
  const handleNameUpdate = (newName) => {
    setUserName(newName);
  }

  const generateRoomID = () => { return Math.random().toString(36).substr(2, 6).toUpperCase(); };
  const [roomID, setRoomID] = useState(generateRoomID);
  const handleRoomIDUpdate = (newRoomID) => {
    setRoomID(newRoomID);
  }

  const [lobby, setLobby] = useState([]);
  const handleSetLobby = (newLobby) => {
    setLobby(newLobby);
  }

  //NEED TO PREVENT MULTIPLE HOST (IF SOMEONE CREATES, GOES BACK AND JOINS)
  const [isHost, setIsHost] = useState(false);
  const handleSetIsHost = (boolean) => {
    setIsHost(boolean);
  }

  const [gameStarted, setGameStarted] = useState(false);
  const handleGameStarted = () => {

    //RESET TO 3
    if (lobby.length >= 1){
      setGameStarted(true);
      socket.emit('startGame', roomID);
    }
  }

  const [gameData, setGameData] = useState({});
  const handleSetGameData = (newGameData) => {
    setGameStarted(true);
    setGameData(newGameData);

    //SET FIRST TURN FOR ORDER[0]
    if (socket.id == newGameData.order[turnNumber].id) {
      handleSetYourTurn(true);
    }

  }

  const [role, setRole] = useState();
  const handleSetRole = (newRole) => {
    setRole(newRole);
  }

  const [yourTurn, setYourTurn] = useState(false);
  const handleSetYourTurn = (boolean) => {
    setYourTurn(boolean);
  }

  const [turnNumber, setTurnNumber] = useState(0);

  const nextTurn = () => {
    
    setTurnNumber(prevCount => {

      let newCount = prevCount + 1;

      if (gameData.order && gameData.order[prevCount]) {
        socket.emit('nextTurn', prevCount + 1);
        
        //if all turns done
        if (newCount == gameData.order.length){
          socket.emit('allTurnsComplete', roomID);
          return newCount;
    
        } else { //else keep going
          if (socket.id === gameData.order[newCount].id) {
            handleSetYourTurn(true);
          } else {
            handleSetYourTurn(false);
          }

        }
      }

      return newCount;

      });
  }

  const resetClue = () => {
    setClue('');
  }

  const [clue, setClue] = useState();
  const handleSetClue = (newClue) => {
    setClue(newClue);
  }

  const [cluesList, setCluesList] = useState([]);

  const handleClueSubmit = (clue) => {
    socket.emit("clueSubmitted", clue, roomID);
    setCluesList((prevClues) => [...prevClues, clue]);
    handleSetYourTurn(false);
  };

  useEffect(() => {
    socket.on('newClue', (newClue) => {
      nextTurn();
      try {
        setCluesList((prevClues) => [...prevClues, newClue]);
      } catch (error) {
      console.error('Error processing initialPlayerList event:', error);
      }
    });
    
    return () => {
      socket.off('newClue');
    };
  }, []);

  
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
            <Route path="/" element={<A_EnterName userName={userName} onNameUpdate={handleNameUpdate}/>}/>
            <Route path="/join_game" element={<B_CreateJoinGame userName={userName} roomID={roomID}/>}/>
            <Route path="/enter_room_code" element={<B2_EnterRoomCode userName={userName} roomID={roomID} onRoomIDUpdate={handleRoomIDUpdate} onHostUpdate={handleSetIsHost}/>}/>
            <Route path="/lobby/*" element={<Lobby roomID={roomID} lobby={lobby} isHost={isHost} onLobbyUpdate={handleSetLobby} onHostUpdate={handleSetIsHost} onGameStartUpdate={handleGameStarted} onGameDataUpdate={handleSetGameData} onRoleUpdate={handleSetRole}/>}/>
            <Route path='/game/*' element={<Game userName={userName} roomID={roomID} gameData={gameData} role={role} onClueUpdate={handleSetClue} clue={clue} cluesList={cluesList} onClueSubmit={handleClueSubmit} onClueReset={resetClue} yourTurn={yourTurn}/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
