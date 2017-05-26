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

var sockets = new Sockets();

module.exports = sockets;