# Whats Your Name

## TASK: Port

### Nmap Scan
```bash
nmap 10.82.172.180 -sV -Pn -p- -T4
```
#### Output:
```
Starting Nmap 7.98 ( https://nmap.org ) at 2026-01-06 10:33 +0800
Nmap scan report for 10.82.172.180
Host is up (0.26s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))
8081/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

---

## TASK: Directory of worldwap.thm

### Gobuster Scan
```bash
gobuster dir -u 'http://worldwap.thm/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
```
#### Output:
```
/api                  (Status: 301) [Size: 310] [--> http://worldwap.thm/api/]
/index.php            (Status: 302) [Size: 0] [--> /public/html/]
/javascript           (Status: 301) [Size: 317] [--> http://worldwap.thm/javascript/]
/logs.txt             (Status: 200) [Size: 0]
/phpmyadmin           (Status: 301) [Size: 317] [--> http://worldwap.thm/phpmyadmin/]
/public               (Status: 301) [Size: 313] [--> http://worldwap.thm/public/]
Progress: 143283 / 143290 (100.00%)
Finished
```

### Further Directory Enumeration
```bash
gobuster dir -u 'http://worldwap.thm/public/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
```