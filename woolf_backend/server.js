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
      socket.emit('roomFull'); //ADD FRONTEND FXN TO CATCH THIS ERROR
      return;
    }
    
    socket.join(roomID);
    room.push({id: socket.id, name: userName, room: roomID, host: false});
    gameRooms.set(roomID, room);

    console.log(`Player ${userName} joined room ${roomID}`);

    // Emit updated player list to all clients in the lobby
    socket.emit('updateRoom', room);
    io.to(roomID).emit('updateRoom', room);
    
  });

  socket.on('disconnect', () => {


    //find room of socket that disconnected
    for (const [room, players] of gameRooms) {
      const disconnectedPlayer = players.find(player => player.id === socket.id);

      if (disconnectedPlayer) {
        const updatedRoom = players.filter(player => player.id !== socket.id);

        //if room now empty
        if (updatedRoom.length == 0){
          gameRooms.delete(disconnectedPlayer.room)
          return;
        }

        if (disconnectedPlayer.host){
          updatedRoom[0].host = true;
        }

        gameRooms.set(disconnectedPlayer.room, updatedRoom);
        //update all players in room with new list
        io.to(disconnectedPlayer.room).emit('updateRoom', updatedRoom);

        console.log(`Player ${disconnectedPlayer.name} disconnected from room: ${disconnectedPlayer.room}`);
      }
    }

   
    
    
  });

  socket.on('startGame', (roomID) => {

    
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


    gameData.order = playerOrder;


    gameData.topic = 'Countries';


    //SET GAME BOARD AND CHOOSE ANSWER
    gameData.board = gameBoards.get('Countries'); //randomize in future

    //shuffle and select answer from board
    let boardWords = gameBoards.get('Countries').slice(0);
    for (var i = boardWords.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = boardWords[i];
      boardWords[i] = boardWords[j];
      boardWords[j] = temp;
    }

    gameData.answer = boardWords[0];


    //SET PLAYER ROLES
    let woolfIndex = Math.floor(Math.random() * (playerOrder.length));
    let playerRoles = playerOrder.slice(0);
    for (let i = 0; i < playerRoles.length; i++) {
      if (i == woolfIndex){
        playerRoles[i].role = 'woolf';
      } else {
        playerRoles[i].role = 'sheep';
      }
    }
    
    gameData.roles = playerRoles;
    io.to(roomID).emit('gameStarted', gameData);

  });
  
  socket.on('clueSubmitted', (clue, roomID) => {
    socket.to(roomID).emit("newClue", clue);
  });

  socket.on('nextTurn', (turn) => {
    console.log("turn number: ", turn);
  })

  socket.on('allTurnsComplete', (roomID) => {
    console.log("all turns completed in room: ", roomID);
  })

});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
