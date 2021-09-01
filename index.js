const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
var favicon = require('serve-favicon');

var users_online = 0;
var counter = 0; // valor inicial del contador

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

    // on user connected sends the current click count
    socket.emit('click_count', counter);

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

    // when user click the button
    socket.on('clicked', function() {
        counter += 1; // increments global click count
        io.emit('click_count', counter);//send to all users new counter value
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});