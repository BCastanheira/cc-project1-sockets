import { Server } from "socket.io";
import { createServer } from 'http';
import axios from 'axios';

const server = createServer();

var api_uri = process.env.API_URI+':3000' || 'localhost:3000';

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log(io)

io.on('connection', async (socket) => {
  axios.get(api_uri+'/messages')
    .then((r) => {
      r.data.forEach((msg) => {
        socket.emit('chat message', msg.text)
      })
    })

  console.log('a user connected');

  socket.on('chat message', (msg) => {
    let obj = {'text': msg, 'date': new Date().toISOString()}

    axios.post(api_uri+'/messages', obj)
      .then((r) => console.log('Chat message stored: ', r.data))

    io.emit('chat message', msg)
  });

  socket.on('reset', () => {
    axios.delete(api_uri+'/messages')
      .then(() => console.log('Chat messages deleted'))

    io.emit('reset')
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});