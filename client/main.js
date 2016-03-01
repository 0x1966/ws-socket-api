
define([], function() {

    'use strict';

    var _invokeIfDefined = function (handler /*, any arguments provided will be passed to the handler function */) {
        if (typeof handler == 'function') {
            handler.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    };

    function WSSocketAPI(socket) {

        this.socket = socket;
        this.handlers = {};

        var self = this;

        this.socket.onmessage = function (raw) {
            var parsed = JSON.parse(raw.data);
            var handler = self.handlers[parsed.event];
            _invokeIfDefined(self.handlers[parsed.event], parsed.data);
        };

        this.socket.onopen = function () {
            _invokeIfDefined(self.handlers['open']);
        };

        this.socket.onclose = function () {
            _invokeIfDefined(self.handlers['close']);
        };

        this.socket.onerror = function () {
            _invokeIfDefined(self.handlers['error']);
        };
    }

    WSSocketAPI.prototype.emit = function(event, data) {
        this.socket.send(JSON.stringify({event: event, data: data}));
    };

    WSSocketAPI.prototype.on = function(event, handler) {
        this.handlers[event] = handler;
    };

    return WSSocketAPI;

});