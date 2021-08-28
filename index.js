const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
var favicon = require('serve-favicon');

var users_online = 0;

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use(express.static('public'));
app.use(express.static('files'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    users_online += 1;
    socket.emit('users_online',{'users_online': io.engine.clientsCount});
    socket.broadcast.emit('hi');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        users_online -= 1;
        socket.emit('users_online',{'users_online': io.engine.clientsCount});
        socket.broadcast.emit('bye');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});