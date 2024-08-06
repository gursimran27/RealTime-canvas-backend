const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
const isDev = app.settings.env === 'development'
const URL = isDev ? 'http://localhost:3000' : 'https://sketchbook-sigma.vercel.app'
app.use(cors({origin: URL}))
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: URL });

io.on("connection", (socket) => {
  console.log("server connected")

  socket.on('join-room', (roomId) => {//userId is peerID i.e SDP
    console.log(`a new user joined room ${roomId}`)
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('joined-room')
})

  socket.on('beginPath', (arg) => {
    socket.join(arg.roomId)
    socket.broadcast.to(arg.roomId).emit('beginPath', arg)
  })

  socket.on('drawLine', (arg) => {
    socket.join(arg.roomId)
    socket.broadcast.to(arg.roomId).emit('drawLine', arg)
  })

  socket.on('changeConfig', (arg) => {
    socket.join(arg.roomId)
    socket.broadcast.to(arg.roomId).emit('changeConfig', arg)
  })

  socket.on('updateMenuItem', (itemName, roomId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('updateMenuItem', itemName)
  })

  socket.on('updateMenuAction', (itemName, roomId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('updateMenuAction', itemName)
  })

  socket.on('mouseUp', (roomId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('captureCanvasOnMouseUp')
  })

  socket.on('end', (roomId) => {
    // console.log('bye')
    socket.leave(roomId);
    socket.disconnect(0);
    console.log('diconnecting from socket server and roomId ',roomId)
  })
});

httpServer.listen(5000);