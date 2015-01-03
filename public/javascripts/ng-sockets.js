var module = angular.module('ngSockets', []);

module.provider('$socket', function $socketProvider() {
  
  var ioUrl = '';
  var ioConfig = {};

  this.$get = function $socketFactory($rootScope) {
    
    //var socket = io(ioUrl, ioConfig);
    var socket = io();
    return {
        on: function on(event, callback) {
            socket.on(event, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                  callback.apply(socket, args);
                });
            });
        },
        off: function off(event, callback) {
             if (typeof callback == 'function') {
                socket.removeListener(event, callback);
             } else {
                socket.removeAllListeners(event);
             }
        },
        emit: function emit(event, data, callback) {
            if (typeof callback == 'function') {
                socket.emit(event, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            } else {
                socket.emit(event, data);
            }
        }                
    };
  };

});