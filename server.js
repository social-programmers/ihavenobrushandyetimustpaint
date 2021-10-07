const http = require('http');
const app = require('./app');
let myPort = process.env.PORT || 3000;

app.set('port', myPort);

const server = http.createServer(app);

server.on('listening', ()=> {
  console.log('listening on port 3000');
});

server.listen(myPort, "localhost");

const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  io.emit('heartbeat', 'beat');
  socket.on('disconnect', () => {
    io.sockets.emit('disconnect', socket.id);
  });
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }
  socket.on('cursor', cursorMessage);
  function cursorMessage(cursorProps) {
    io.emit('cursor', {
      id: socket.id,
      coords: cursorProps
    });
  }

  socket.on('updateCam', updateBuffer);
  function updateBuffer(updatedCam) {
    if(updatedCam) {
      io.emit('updateCam', updatedCam.toString('base64'));
    }
  }
}
