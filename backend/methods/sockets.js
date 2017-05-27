let uuid = require('uuid');

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

// Stream
function Stream() {
    this.socketid = uuid.v4();
}

Stream.prototype.listenAndServe = function () {
    let nsp = io.of(this.socketid);
    nsp.on('connection', function (socket) {
        // stream
        socket.on('emit', function (id, msg) {
            socket.broadcast.emit('emit', msg);
        });

        socket.on('disconnect', function () {

        });
    });
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
                // serve a new stream
                let stream = new Stream();
                stream.listenAndServe();
                // send to caller and callee
                socket.broadcast.to(calleeSocketId).emit('notify', JSON.stringify({ from: this.username, socketid: stream.socketid }));
                socket.broadcast.to(this.socketid).emit('notify', JSON.stringify({ from: callee, socketid: stream.socketid }));
            }
        });

        // remove connection from listening sockets
        socket.on('disconnect', function () {
            sockets.remove(this.username);
        });
    });
}

module.exports = sockets;