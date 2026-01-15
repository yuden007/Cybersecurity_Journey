# Active Reconnaissance

## TASK 3: ping

ping -c 5 IP_ADDRESS

-c number of packet

## TASK 4: traceroute

traceroute is a network diagnostic tool used to track the path packets take to reach a destination. 
It uses ICMP.

traceroute -m 20 IP_ADDRESS PORT

-m option sets the maximum number of hops

## TASK 5: telnet

A network protocol used to provide a command-line interface for communication with a remote device over a network.
The default port used by telnet is 23. The secure alternative is SSH.

```

pentester@TryHackMe$ telnet 10.48.159.72 80
Trying 10.48.159.72...
Connected to 10.48.159.72.
Escape character is '^]'.
GET / HTTP/1.1
host: telnet

HTTP/1.1 200 OK
Server: nginx/1.6.2
Date: Tue, 17 Aug 2021 11:13:25 GMT
Content-Type: text/html
Content-Length: 867
Last-Modified: Tue, 17 Aug 2021 11:12:16 GMT
Connection: keep-alive
ETag: "611b9990-363"
Accept-Ranges: bytes

```

## TASK 6: netcat

Netcat (nc) is a versatile networking tool used for reading from and writing to network connections using TCP or UDP protocols.

```

pentester@TryHackMe$ nc 10.48.159.72 80
GET / HTTP/1.1
host: netcat

HTTP/1.1 200 OK
Server: nginx/1.6.2
Date: Tue, 17 Aug 2021 11:39:49 GMT
Content-Type: text/html
Content-Length: 867
Last-Modified: Tue, 17 Aug 2021 11:12:16 GMT
Connection: keep-alive
ETag: "611b9990-363"
Accept-Ranges: bytes

```

-l 	Listen mode
-p 	Specify the Port number
-n 	Numeric only; no resolution of hostnames via DNS
-v 	Verbose output (optional, yet useful to discover any bugs)
-vv Very Verbose (optional)
-k 	Keep listening after client disconnects

## Appendix:

Purpose                          Commandline Example
-------------------------------- --------------------------------------------------------
Lookup WHOIS record              whois tryhackme.com
Lookup DNS A records             nslookup -type=A tryhackme.com
Lookup DNS MX records at DNS     nslookup -type=MX tryhackme.com 1.1.1.1
server
Lookup DNS TXT records           nslookup -type=TXT tryhackme.com
Lookup DNS A records             dig tryhackme.com A
Lookup DNS MX records at DNS     dig @1.1.1.1 tryhackme.com MX
server
Lookup DNS TXT records           dig tryhackme.com TXT