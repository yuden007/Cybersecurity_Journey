# El Bandito

---

## TASK

### Nmap Scan

```
root@ip-10-82-97-239:~# nmap 10.82.181.53 -sS -Pn -p- -T4 -sV
Starting Nmap 7.80 ( https://nmap.org ) at 2026-01-12 12:12 GMT
Nmap scan report for 10.82.181.53
Host is up (0.0033s latency).
Not shown: 65531 closed ports
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)
80/tcp   open  ssl/http El Bandito Server
631/tcp  open  ipp      CUPS 2.4
8080/tcp open  http     nginx
```

### FFUF Scan

```
root@ip-10-82-97-239:~# ffuf -u https://10.82.181.53:80/FUZZ -w /usr/share/wordlists/dirb/common.txt
...
access                  [Status: 200, Size: 4817, Words: 289, Lines: 116]
login                   [Status: 405, Size: 153, Words: 16, Lines: 6]
logout                  [Status: 302, Size: 189, Words: 18, Lines: 6]
...
```

### Gobuster Scan

```
root@ip-10-82-97-239:~# gobuster dir -u http://10.82.181.53:8080/ -w /usr/share/wordlists/dirb/big.txt -b 300-500
...
/assets               (Status: 200) [Size: 0]
/favicon.ico          (Status: 200) [Size: 946]
/health               (Status: 200) [Size: 150]
/info                 (Status: 200) [Size: 2]
/token                (Status: 200) [Size: 7]
...
```

---

## TASK: Curl Requests

### HTTP Request

```
root@ip-10-82-97-239:~# curl -v http://10.82.181.53:80
...
* Recv failure: Connection reset by peer
...
```

### HTTPS Request

```
root@ip-10-82-97-239:~# curl -k https://10.82.181.53:80
nothing to see <script src='/static/messages.js'></script>
```

---

## TASK: Observations

- `https://10.82.181.53:80/access`: A HTTPS login page.
- `http://10.82.181.53:8080/assets`: A HTTP link to download an empty file.
- `http://10.82.181.53:8080/health`: A Spring Boot Actuator endpoint.
- `http://10.82.181.53:8080/token`: A HTTP page containing token `3273.254`.

---

## Appendix

---