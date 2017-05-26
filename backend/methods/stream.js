let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('add-message', (message) => {
        io.emit('message', { type: 'new-message', text: message });
    });
});