import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './GAME/socket';

const GameContext = createContext();

export const GameProvider = ({ children }) => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const handleNameUpdate = (newName) => {
    setUserName(newName);
  }

  const [roomID, setRoomID] = useState('');
  
  const handleCreateRoomID = () => {
    const newRoomID = Math.random().toString(36).substr(2, 6).toUpperCase();
    setRoomID(newRoomID);
    setIsHost(true);
    socket.emit('createRoom', newRoomID, userName);
    navigate(`/game/${newRoomID}`);
  }

  const handleEnterRoomID = (newRoomID) => { setRoomID(newRoomID); };

  const handleJoinRoom = async () => {

    try {
      const response = await new Promise((resolve, reject) => {
        socket.emit('checkRoomExistence', roomID, (exists) => {
          resolve(exists);
        });
      });
      
      if (response) {
        // Room exists, join it
        setIsHost(false);
        socket.emit('joinRoom', roomID, userName);
        navigate(`/game/${roomID}`);
      } else {
        console.error('Please enter a valid room ID.');
      }
    } catch (error) {
      console.error('Error checking room existence:', error);
    }

  };

  const [isHost, setIsHost] = useState(false);
  const handleSetIsHost = (boolean) => {
    setIsHost(boolean);
  }

  const [lobby, setLobby] = useState([]);
  const handleSetLobby = (newLobby) => {
    setLobby(newLobby);
  }

  const handleGameStartRequest = () => {
    socket.emit('startGame', roomID);
  }

  const [gameStarted, setGameStarted] = useState(false);

  const [role, setRole] = useState();

  const [board, setBoard] = useState();

  const handleGameStarted = (newGameData) => {

    setGameStarted(true);
    setBoard(newGameData.board);
    setTopic(newGameData.topic);
    setAnswer(newGameData.answer);
    setOrder(newGameData.players);

    console.log("player order: ", newGameData.players)

    for(var obj of newGameData.players) {
      if (obj.id == socket.id) {
        setRole(obj.role);
      }
    }

  };

  const [topic, setTopic] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState([]);

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
    nextTurn();
  };

  const handleNewClue = (newClue) => {
    setCluesList((prevClues) => [...prevClues, newClue]);
  }

  const [yourTurn, setYourTurn] = useState(false);
  const handleSetYourTurn = (boolean) => {
    setYourTurn(boolean);
  }

  const [turnNumber, setTurnNumber] = useState(0);

  const checkTurn = (turnCount) => {

    //if all turns done
    if (turnCount == order.length){
      socket.emit('allTurnsComplete', roomID);
      console.log('turns complete');
    } else { //else keep going
      if (socket.id === order[turnCount].id) {
        handleSetYourTurn(true);
      } else {
        handleSetYourTurn(false);
      }
    }
    
  };

  const nextTurn = () => {
    
    setTurnNumber(prevCount => {
      
      let newCount = prevCount + 1;
      console.log("last turn: ", prevCount, " curr turn: ", newCount);

      if (order && order[prevCount]) {
        socket.emit('nextTurn', prevCount + 1, roomID);
        checkTurn(newCount);
      }

      return newCount;

      });
  }

  const contextValue = {
    userName,
    roomID,
    handleNameUpdate,
    handleCreateRoomID,
    handleEnterRoomID,
    handleJoinRoom,
    isHost,
    handleSetIsHost,
    lobby, 
    handleSetLobby,
    gameStarted,
    handleGameStartRequest,
    handleGameStarted,
    role,
    board,
    topic,
    answer,
    order, 
    clue,
    handleSetClue,
    resetClue,
    cluesList,
    handleClueSubmit,
    handleNewClue,
    yourTurn,
    nextTurn,
    turnNumber,
    checkTurn,
    // other function declarations...
  };


  


  

  


  //other functions definitions

  
  return (
  <GameContext.Provider value={contextValue}>
      {children}
  </GameContext.Provider>
  );
};

export const useGameContext = () => {
    return useContext(GameContext);
};