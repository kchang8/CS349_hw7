var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];
var topicCmd = false;

console.log('websockets server started');

ws.on('connection', function (socket) {
    console.log('client connection established');

    messages.forEach(function (msg) {
        socket.send(msg);
    });

    socket.on('message', function (data) {
        console.log('message received: ' + data);
        //checks if the /topic command is used
        if (data.substring(0, 6) === '/topic') {
            topicName = data.substring(7);
            messages.push(data);
            ws.clients.forEach(function(clientSocket) {
              clientSocket.send("*** Topic has changed to '" + topicName + "'");
            });

            if (topicCmd) {
              messages[0] = "*** Topic is '" + topicName + "'";
            } else {
              messages.unshift("*** Topic is '" + topicName + "'");
            }
            topicCmd = true;
      
        } else {
            messages.push(data);
            ws.clients.forEach(function(clientSocket) {
              clientSocket.send(data);
            });
        }
    });
});