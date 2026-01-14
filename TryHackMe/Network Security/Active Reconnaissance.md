# Active Reconnaissance

## Task 3: Ping

```bash
ping -c 5 IP_ADDRESS
```

- `-c`: Number of packets to send.

---

## Task 4: Traceroute

Traceroute is a network diagnostic tool used to track the path packets take to reach a destination. It uses ICMP.

```bash
traceroute -m 20 IP_ADDRESS PORT
```

- `-m`: Sets the maximum number of hops.

---

## Task 5: Telnet

Telnet is a network protocol used to provide a command-line interface for communication with a remote device over a network. The default port used by Telnet is 23. The secure alternative is SSH.

### Example:

```plaintext
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

---

## Task 6: Netcat

Netcat (nc) is a versatile networking tool used for reading from and writing to network connections using TCP or UDP protocols.

### Example:

```plaintext
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

### Common Options:

- `-l`: Listen mode.
- `-p`: Specify the port number.
- `-n`: Numeric only; no resolution of hostnames via DNS.
- `-v`: Verbose output (useful for debugging).
- `-vv`: Very verbose.
- `-k`: Keep listening after client disconnects.

---

## Appendix

### Command Examples:

| Purpose                          | Commandline Example                          |
|----------------------------------|----------------------------------------------|
| Lookup WHOIS record              | `whois tryhackme.com`                        |
| Lookup DNS A records             | `nslookup -type=A tryhackme.com`             |
| Lookup DNS MX records at DNS     | `nslookup -type=MX tryhackme.com 1.1.1.1`    |
| Lookup DNS TXT records           | `nslookup -type=TXT tryhackme.com`           |
| Lookup DNS A records             | `dig tryhackme.com A`                        |
| Lookup DNS MX records at DNS     | `dig @1.1.1.1 tryhackme.com MX`              |
| Lookup DNS TXT records           | `dig tryhackme.com TXT`                      |