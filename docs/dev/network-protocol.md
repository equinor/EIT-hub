# Eit Hubs Networks Protocol

## Definitions

* **Client** The one starting the network connection.
* **Server** The one receive the connection request.
* **Sender** Sender of a single message. Can be both server or client.
* **Receiver** The one that needs to process a message. 


## Base layer
The base of most Eit Hub network communication is Web Socket over SSL.
Authentication is done using the HTTPS request that initiates the websocket connection.

The server must not accept connections that is not encrypted and authenticated.
Exceptions can be made for development environment. But only if there is code that makes sure its always enabled in production.

For the MVP all websocket messages are JSON strings.

## Connection layer
The job of the connection layer is:
* Detect errors and reconnect.
* Cycle connections periodically to fight time to live issues.

Connection layer gives api that:
* Tells of there is currently an active connection: `isConnected(): boolean`
* Send a string to the server: `send(msg:string): bool`
  * Returns the same result as is connected.
* Place to put a callback on new message: `onMessage: (msg: string): void`

Handling of network events.
* The other side closes the connection:
  * Server can wait for reconnection attempts based on authentications headers. (Not Implemented.)
  * The client should try to reconnect. (Not Implemented.)
    * Should use exponential back off. (Not Implemented)
    * Should use randomized delays. (Not Implemented)
* If have not received message in some time. Default 5 sec (Not Implemented)
  * Server should close the connection with a `timeout` error. (Not Implemented)
  * The client should start a reconnection process. (Not Implemented)

Reconnection process (Not Implemented)
* Once in a while. (Default every 10-15 min) The client should reconnect to the server.
  1. Create a new connection to se server while the old one is active.
  2. Close the existing connection when the new is enabled.
  3. Send all new messages on the new connection.
  4. Clean up the old one when the disconnection is completed.

Known problems:
* If the browser open multiple tabs the server may become very confused on when there is a new connection. And if the server closes duplicate connections it results in a fight of the clients.

## Back off layer
The job of the back off layer is:
* Makes sure that connection is responsive by not sending more than the receiver can handle.
* Send periodic keep alive messages if there is no traffic on the wire.