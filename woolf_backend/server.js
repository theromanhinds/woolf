const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors module

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your client's origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's origin
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204,
}));

const gameRooms = new Map();

const gameBoards = new Map();
gameBoards.set('Countries', ['America', 'England', 'Jamaica', 'Canada', 'France', 'Spain', 'Mexico', 'Italy', 'Argentina']);

app.get('/', (req, res) => {
  res.send('Server is running.');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle events from clients here

  // create a lobby
  socket.on('createRoom', (roomID, userName) => {

    if (gameRooms.has(roomID)) {
      console.log("error: room already exists");
      return;
    }

    const room = [{id: socket.id, name: userName, room: roomID, host: true}]
    gameRooms.set(roomID, room);

    socket.join(roomID);
    socket.emit('updateRoom', room);  

    console.log(`Player ${userName} created room ${roomID}`);      
  });

  // Join a lobby
  socket.on('joinRoom', (roomID, userName) => {

    if (!gameRooms.has(roomID)) {
      gameRooms.set(roomID, []);
    }

    const room = gameRooms.get(roomID);

    if (room.length >= 8) {
      console.log(`Player ${userName} faiiled to join full room ${roomID}`);
      socket.emit('roomFull'); //ADD FRONTEND FXN TO CATCH THIS ERROR
      return;
    }
    
    socket.join(roomID);
    room.push({id: socket.id, name: userName, room: roomID, host: false});
    gameRooms.set(roomID, room);

    console.log(`Player ${userName} joined room ${roomID}`);

    // Emit updated player list to all clients in the lobby
    console.log('Emitting updatedRoom:', room);
    socket.emit('updateRoom', room);
    io.to(roomID).emit('updateRoom', room);
    console.log("All players received updated room.");
    
  });

  socket.on('disconnect', () => {

    console.log("user disconnecting");

    //find room of socket that disconnected
    for (const [room, players] of gameRooms) {
      const disconnectedPlayer = players.find(player => player.id === socket.id);

      if (disconnectedPlayer) {
        const updatedRoom = players.filter(player => player.id !== socket.id);

        //if room now empty
        if (updatedRoom.length == 0){
          gameRooms.delete(disconnectedPlayer.room)
          console.log(`Room ${disconnectedPlayer.room} empty, deleting room.`);
          return;
        }

        if (disconnectedPlayer.host){
          updatedRoom[0].host = true;
          console.log(`New host in room: ${disconnectedPlayer.room}`);
        }

        gameRooms.set(disconnectedPlayer.room, updatedRoom);
        //update all players in room with new list
        io.to(disconnectedPlayer.room).emit('updateRoom', updatedRoom);

        console.log(`Player ${disconnectedPlayer.name} disconnected from room: ${disconnectedPlayer.room}`);
      }
    }

   
    
    
  });

  socket.on('startGame', (roomID) => {

    console.log(`Game ${roomID} is starting!`);
    
    gameData = {
      order: null,
      topic: null,
      board: null,
      answer: null,
      roles: null
    };

    //SET PLAYER ORDER
    let playerOrder = gameRooms.get(roomID).slice(0);
    for (var i = playerOrder.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = playerOrder[i];
      playerOrder[i] = playerOrder[j];
      playerOrder[j] = temp;
    }

    console.log("--------------");

    gameData.order = playerOrder;
    console.log("new player order is: ", gameData.order);

    console.log("--------------");

    gameData.topic = 'Countries';
    console.log("your topic is: ", gameData.topic);

    console.log("--------------");

    //SET GAME BOARD AND CHOOSE ANSWER
    gameData.board = gameBoards.get('Countries'); //randomize in future
    console.log("game board is ", gameData.board);

    //shuffle and select answer from board
    let boardWords = gameBoards.get('Countries').slice(0);
    for (var i = boardWords.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = boardWords[i];
      boardWords[i] = boardWords[j];
      boardWords[j] = temp;
    }

    console.log("--------------");

    gameData.answer = boardWords[0];
    console.log("answer is: ", gameData.answer);

    console.log("--------------");

    //SET PLAYER ROLES
    let woolfIndex = Math.floor(Math.random() * (playerOrder.length));
    console.log("woolf index is: ", woolfIndex)
    let playerRoles = playerOrder.slice(0);
    for (let i = 0; i < playerRoles.length; i++) {
      if (i == woolfIndex){
        playerRoles[i].role = 'woolf';
        console.log("this player is woolf", playerRoles[i])
      } else {
        playerRoles[i].role = 'sheep';
      }
    }
    
    gameData.roles = playerRoles;
    console.log("Here are the updated player roles: ", playerRoles);
    io.to(roomID).emit('gameStarted', gameData);
    console.log("here's all the data", gameData);

  });
  
  socket.on('clueSubmitted', (clue, roomID) => {
    console.log(`sending clue: ${clue} to room: ${roomID}`);
    socket.to(roomID).emit("newClue", clue);
  });

  socket.on('nextTurn', (turn) => {
    console.log("it's turn number,", turn);
  })

  socket.on('allTurnsComplete', (roomID) => {
    console.log("all turns completed in room: ", roomID);
  })

});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
