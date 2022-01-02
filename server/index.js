const express = require('express');
const path = require('path');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const http = require('http');
const socketIo = require("socket.io");
const { MongoClient } = require('mongodb');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const GAME_LOGGING = process.env.GAME_LOGGING || false;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || "gobbler";
const MONGO_COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || "games";

var PLAYER_INFO = {
  "B": {
    joined: false,
    socketId: null,
    playerName: null
  },
  "R": {
    joined: false,
    socketId: null,
    playerName: null
  }
}

// Not being Used Right now
function getInitialState() {
  return [{
    move: "GAME START",
    squares: { 
      'A3' : [], 'B3' : [], 'C3' : [],
      'A2' : [], 'B2' : [], 'C2' : [],
      'A1' : [], 'B1' : [], 'C1' : [],
      'RED_GROUND': ['RS1', 'RM1', 'RL1', 'RS2', 'RM2', 'RL2'],
      'BLUE_GROUND': ['BS1', 'BM1', 'BL1', 'BS2', 'BM2', 'BL2'],
    }
  }];
}

var GAME_MOVES = getInitialState();

function resetPlayerInfo(playerColor) {
  PLAYER_INFO[playerColor] = {
    joined: false,
    socketId: null,
    playerName: null
  }
}

var GAME_STATS = []


/* Database */
function saveGame(game) {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  // Use connect method to connect to the server
  client.connect(err => {
    const db = client.db(MONGO_DATABASE_NAME);
    const gobblerGamesCollection = db.collection(MONGO_COLLECTION_NAME);

    try {
      // Insert Game State
      gobblerGamesCollection.insertOne(game);
    } catch (error) {
      console.log(`Error : ${error}`); // Log Error and Ignore
      return "SAVE_FAILURE";
    }
  });

  return "DONE";
}

const app = express();

const server = http.Server(app);
var io = socketIo(server);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.get('/api/game-stats', function (req, res) {
  res.set('Content-Type', 'application/json');
  var responseString = `{"message":"Hello from Server!", "gamesPlayed": ${GAME_STATS.length}, "gameStats": ${JSON.stringify(GAME_STATS)} }`;
  res.send(responseString);
});

/* Sockets Code */
//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A User Connected!', socket.id);
  // console.log(PLAYER_INFO);
  socket.join('global-channel');
  if (PLAYER_INFO['B']['joined']) {
    socket.emit('join-channel-notification', {
      'color': 'B',
      'playerName': PLAYER_INFO['B']['playerName']
    }); 
  }

  if (PLAYER_INFO['R']['joined']) {
    socket.emit('join-channel-notification', {
      'color': 'R',
      'playerName': PLAYER_INFO['R']['playerName']
    }); 
  }

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A User Disconnected!', socket.id);
    var colorLeft = null; var leftPlayerName = null;
    if (PLAYER_INFO['B']['socketId'] === socket.id) {
      socket.broadcast.in('global-channel').emit('left-channel-notification', {
        color: 'B',
        playerName: PLAYER_INFO['B']['playerName']
      }); 
      resetPlayerInfo('B');
    } else if (PLAYER_INFO['R']['socketId'] === socket.id) {
      socket.broadcast.in('global-channel').emit('left-channel-notification', {
        color: 'R',
        playerName: PLAYER_INFO['B']['playerName']
      }); 
      resetPlayerInfo('R');
    } else {
      // Do Nothing, No Important/Playing players left.
    }
  });

  /* Whenever someone join as a player */
  socket.on('join-channel', function (data) {
    var playerColor = data.color;
    var playerName = data.playerName;
    if (!PLAYER_INFO[playerColor]['joined']) {
      PLAYER_INFO[playerColor] = { joined: true, playerName: playerName, socketId: socket.id }
      socket.broadcast.in('global-channel').emit('join-channel-notification', data); 
      socket.emit('join-channel-notification', data);

      // Auto-Join to Channel-1 for now
      socket.join('channel-1');

      /* Resume Play if second join */
      // if (GAME_MOVES.length > 1) {
      //   console.log(GAME_MOVES);
      //   socket.emit('patch-game-state', { history: GAME_MOVES });
      // } else {
      //   GAME_MOVES = getInitialState();
      // }
    } else {
      socket.leave('global-channel');
      socket.emit('force-offline', {
        'message': `${PLAYER_INFO[playerColor]['playerName']} has already joined as Color: ${PLAYER_INFO[playerColor]['playerName']}`
      });
    }
    // console.log(PLAYER_INFO);
  });

  socket.on('move-piece', function (data) {
    // GAME_MOVES.push(data.moveObject);
    socket.broadcast.in('channel-1').emit('move-piece', data); 
  });

  socket.on('channel-leave-request', function(data) {
    var playerColor = data.color;
    if (PLAYER_INFO[playerColor][socketId] === socket.id) {
      resetPlayerInfo(playerColor);
    }
    socket.leave('global-channel');
  });

  socket.on('game-restart-request', function(data) {
    socket.broadcast.in('channel-1').emit('game-restart-request', data); 
  });

  socket.on('game-restart-request-accepted', function(data) {
    // I know this can be one-liner :\
    socket.broadcast.in('channel-1').emit('game-restart-request-accepted', data); 
    socket.emit('game-restart-request-accepted', data); 
  });

  socket.on('game-restart-request-rejected', function(data) {
    socket.broadcast.in('channel-1').emit('game-restart-request-rejected', data); 
    socket.emit('game-restart-request-rejected', data); 
  });

  socket.on('game-over', function(data) {
    var gameResult = { playerNames: data.playerNames, winnerPlayer: data.winnerPlayer }
    GAME_STATS.push(gameResult);
    console.log(gameResult);
    if (GAME_LOGGING === true) saveGame(data);
  });


});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

server.listen(PORT, function () {
  console.error(`Node ${isDev ? 'dev server' : 'Production worker '+process.pid}: listening on port ${PORT}`);
});
