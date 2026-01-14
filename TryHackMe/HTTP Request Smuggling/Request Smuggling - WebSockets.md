# Request Smuggling - WebSockets

---

## TASK 2: WebSockets

### What is a WebSocket?

When using HTTP, the client must make a request before the server can send any information. This complicates the implementation of some application features that require bidirectional communications. For example, suppose you are implementing a web application that needs to send real-time notifications to the user. Since the server can't push information to the user at will, the client would need to constantly poll the server for notifications, requiring lots of wasted requests.

The WebSocket protocol allows the creation of two-way communication channels between a browser and a server by establishing a long-lasting connection that can be used for full-duplex communications.

---

## TASK n: Abusing WebSockets for Request Smuggling

### Smuggling HTTP Requests Through Broken WebSocket Tunnels

To exploit vulnerable proxies, send a WebSocket upgrade request with an invalid `Sec-WebSocket-Version` header (e.g., not 13). The backend will reject the upgrade (426 error), but the proxy may still tunnel subsequent HTTP requests, allowing you to bypass proxy restrictions and access protected resources.

---

## Appendix

---