// track current sockets
var sockets = new Sockets();

// Sockets and streaming methods
function Sockets() {
    // keep track of all connected clients + socket
    // When user log in, server generates socket id and send it to client to contact him later to receive a call.
    this.sockets = [];
}

Sockets.prototype.getToken = function (username) {
    for (var i = 0; i < this.sockets.length; i++) {
        if (username == this.sockets[i].username) {
            return this.sockets[i].socketid;
        }
    }
    return null;
}

Sockets.prototype.getUsername = function (socketid) {
    for (var i = 0; i < this.sockets.length; i++) {
        if (socketid == this.sockets[i].socketid) {
            return this.sockets[i].username;
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
    this.sockets.push(conn);
}

// Connection
function Connection(username, socketid) {
    this.username = username;
    this.socketid = socketid;
}

module.exports = sockets;