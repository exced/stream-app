
function Room() {
    // keep track of all connected clients + socket
    // When user log in, server generates socket id and send it to client to contact him later to receive a call.
    this.connClients = [];
}

Room.prototype.getClient = function (username) {
    for (var i = 0; i < this.connClients.length; i++) {
        if (username == this.connClients[i].username) {
            return this.connClients[i].socket;
        }
    }
    return null;
}

Room.prototype.removeClient = function (username) {
    for (var i = 0; i < this.connClients.length; i++) {
        if (this.connClients[i].username === username) {
            this.connClients.splice(i, 1);
        }
    }
}

Room.prototype.addClient = function (username, socket) {
    let conn = new Connection(username, socket);
    conn.listen();
    this.connClients.push(conn);
}

/**
 * Link 2 users with sockets
 */
function link() {

}