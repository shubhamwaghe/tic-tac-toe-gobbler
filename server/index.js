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
    name: null
  },
  "R": {
    joined: false,
    name: null
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

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
      console.log('A User Disconnected!');
    });

    socket.on('join-channel', function (data) {
      socket.join('channel-1');
      socket.broadcast.in('channel-1').emit('join-channel-notification', data); 
    });

    socket.on('move-piece', function (data) {
      socket.broadcast.in('channel-1').emit('move-piece', data); 
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
