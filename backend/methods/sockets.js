let uuid = require('uuid'),
    app = require('../app'),
    http = require('http').Server(app),
    io = require('socket.io')(http);

// track current sockets
var sockets = new Sockets();

// Sockets and streaming methods
function Sockets() {
    // keep track of all connected clients + socket
    // When user log in, server generates socket id and send it to client to contact him later to receive a call.
    this.sockets = [];
}

Sockets.prototype.get = function (username) {
    for (var i = 0; i < this.sockets.length; i++) {
        if (username == this.sockets[i].username) {
            return this.sockets[i].socket;
        }
    }
    return null;
}

Sockets.prototype.remove = function (username) {
    for (var i = 0; i < this.connClients.length; i++) {
        if (this.sockets[i].username === username) {
            this.sockets.splice(i, 1);
        }
    }
}

Sockets.prototype.add = function (username, socketid) {
    let conn = new Connection(username, socketid);
    conn.listenAndServe();
    this.sockets.push(conn);
}

// Connection
function Connection(username, socketid) {
    this.username = username;
    this.socketid = socketid;
}

/**
 * Listen on call from this and forward it to callee.
 */
Connection.prototype.listenAndServe = function () {
    let nsp = io.of(this.socketid);
    nsp.on('connection', function (socket) {

        // forward the call to the callee
        socket.on('notify', function (id, callee) {
            //TODO: Check contact
            let calleeSocketId = sockets.get(callee);
            if (callee) {
                // new stream
                let streamId = uuid.v4();
                // send to caller and callee
                socket.broadcast.to(calleeSocketId).emit('notify', JSON.stringify({ from: this.username, socketid: streamId }));
                socket.broadcast.to(this.socketid).emit('notify', JSON.stringify({ from: callee, socketid: streamId }));
            }
        });

        // remove connection from listening sockets
        socket.on('disconnect', function () {
            sockets.remove(this.username);
        });
    });
}

module.exports = sockets;