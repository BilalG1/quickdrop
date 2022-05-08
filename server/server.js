
const state = {};
const clientRooms = {};

const expectedOrigin = process.env.NODE_ENV === 'production' ? 'https://quickdrop.bruinclubs.com' : 'http://localhost:8080';
console.log(expectedOrigin);
const io = require('socket.io')({
  cors: {
    origin: expectedOrigin
  }
})

io.on('connection', client => {
  client.on('newSession', () => handleNewSession(client));
  client.on('joinSession', code => handleJoinSession(client, code))
  client.on('sendImage', imgData => receiveAndDistributeData(client, imgData))
})

function handleNewSession(client){
  const roomName = makeid(4);
  clientRooms[client.id] = roomName;
  client.emit('sessionCode', roomName);

  // state[roomName] = createGameState();

  client.join(roomName);
  client.number = 0;
  // client.emit('init', client.number);
}

function handleJoinSession(client, code){
  const room = io.sockets.adapter.rooms.get(code);

  let numClients = 0;
  if (room)
    numClients = room.size

  console.log(room, numClients);
  if (numClients === 0){
    client.emit('unknownSession');
    return;
  }

  clientRooms[client.id] = code;
  client.join(code);
  client.number = numClients;
  client.emit('initReceiver', client.number);
}


function makeid(len){
  let result = ''
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  for(let i = 0; i < len - 1; i++){
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += (Math.floor(Math.random() * 10)).toString();
  return result;
}

function receiveAndDistributeData(client, imgData) {
  const roomName = clientRooms[client.id]
  // console.log(clientRooms, roomName)
  client.broadcast.to(roomName).emit('receiveImage', imgData)
}

io.listen(process.env.PORT || '3000')