import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import socket from './GAME/socket';

import Game from './GAME/Game';
import Start from './START/Start';

function App() {
  
  useEffect(() => {
    // Listen for the disconnect event
    socket.on('disconnect', () => {
      alert("You were disconnected! Please refresh.");
    });

    return () => {
      // Clean up event listener when component unmounts
      socket.off('disconnect');
    };
  }, []);

  return (
      <div className="App">
        <Routes>

            <Route path="/" element={<Start/>}/>
            <Route path="/game/*" element={<Game/>}/>

            {/* <Route path="/" element={<A_EnterName userName={userName} onNameUpdate={handleNameUpdate}/>}/>
            <Route path="/join_game" element={<B_CreateJoinGame userName={userName} roomID={roomID}/>}/>
            <Route path="/enter_room_code" element={<B2_EnterRoomCode userName={userName} roomID={roomID} onRoomIDUpdate={handleRoomIDUpdate} onHostUpdate={handleSetIsHost}/>}/>
            <Route path="/lobby/*" element={<Lobby roomID={roomID} lobby={lobby} isHost={isHost} onLobbyUpdate={handleSetLobby} onHostUpdate={handleSetIsHost} onGameStartUpdate={handleGameStarted} onGameDataUpdate={handleSetGameData} onRoleUpdate={handleSetRole}/>}/>
            <Route path='/game/*' element={<Game userName={userName} roomID={roomID} gameData={gameData} role={role} onClueUpdate={handleSetClue} clue={clue} cluesList={cluesList} onClueSubmit={handleClueSubmit} onClueReset={resetClue} yourTurn={yourTurn}/>}/> */}
        </Routes>
      </div>
  );
}

export default App;
