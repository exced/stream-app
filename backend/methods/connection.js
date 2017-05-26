// {username: string, socketid: string}
function Connection(username, socketid) {
    this.username = username;
    this.socketid = socketid;
}

Connection.prototype.listenAndServe = function () {
    let nsp = io.of(this.namespace);
    nsp.on('connection', function (socket) {

        socket.on('emit', function (id, msg) {
            socket.broadcast.to(id).emit('emit', msg);
        });

        socket.on('notify', function (id, msg) {
            socket.broadcast.to(id).emit('emit', msg);
        });

    });
}

module.exports = Connection;
