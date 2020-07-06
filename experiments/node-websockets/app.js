const WebSocketServer = require('websocket').server;
const http = require('http');
const winston = require('winston')

const PORT = 3000;


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


const server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  logger.log('info', 'A request was recieved over HTTP')
  response.end('Hello world')
});
server.listen(PORT, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  connection.sendUTF("Client has connected to websocket");
  logger.log('info', 'A client has connected to the websocket')

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      logger.log('info', 'Message recieved: ', message)
    }
  });

  connection.on('close', function(connection) {
    // close user connection
    logger.log('info', 'A client has disconnected')
  });
});