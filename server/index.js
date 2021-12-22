const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');
const socketIo = require("socket.io");

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

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



// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  const server = http.Server(app);
  var io = socketIo(server);

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  /* Sockets Code */
  //Whenever someone connects this gets executed
  io.on('connection', function(socket) {
    console.log('A User Connected!', socket.id);
    console.log(PLAYER_INFO);
    socket.join('channel-1');
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
        socket.broadcast.in('channel-1').emit('left-channel-notification', {
          color: 'B',
          playerName: PLAYER_INFO['B']['playerName']
        }); 
        resetPlayerInfo('B');
      } else if (PLAYER_INFO['R']['socketId'] === socket.id) {
        socket.broadcast.in('channel-1').emit('left-channel-notification', {
          color: 'R',
          playerName: PLAYER_INFO['B']['playerName']
        }); 
        resetPlayerInfo('R');
      } else {
        // Do Nothing, No Important/Playing players left.
      }
    });

    socket.on('join-channel', function (data) {
      var playerColor = data.color;
      var playerName = data.playerName;
      if (!PLAYER_INFO[playerColor]['joined']) {
        PLAYER_INFO[playerColor] = { joined: true, playerName: playerName, socketId: socket.id }
        socket.broadcast.in('channel-1').emit('join-channel-notification', data); 
        socket.emit('join-channel-notification', data);

        /* Resume Play if second join */
        // if (GAME_MOVES.length > 1) {
        //   console.log(GAME_MOVES);
        //   socket.emit('patch-game-state', { history: GAME_MOVES });
        // } else {
        //   GAME_MOVES = getInitialState();
        // }
      } else {
        socket.leave('channel-1');
        socket.emit('force-offline', {
          'message': `${PLAYER_INFO[playerColor]['playerName']} has already joined as Color: ${PLAYER_INFO[playerColor]['playerName']}`
        });
      }
      console.log(PLAYER_INFO);
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
      socket.leave('channel-1');
    });


  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  server.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
