
// wraps a single websockets/ws socket and provides an easy api supporting on(...) and emit(...)

function WSSocketApi (socket) {
    this.socket = socket;
    this.handlers = {};
    var self = this;
    this.socket.on('message', function (data, flags) {
        var parsed = JSON.parse(data);
        var handler = self.handlers[parsed.event];
        if (typeof handler == 'function') {
            handler(parsed.data);
        }
    });
}

WSSocketApi.prototype.emit = function (event, data) {
    this.socket.send(JSON.stringify({event: event, data: data}));
};

WSSocketApi.prototype.on = function (event, handler) {
    if (event === 'close' || event === 'error') {
        this.socket.on(event, handler);
    } else {
        this.handlers[event] = handler;
    }
};

module.exports = WSSocketApi;
