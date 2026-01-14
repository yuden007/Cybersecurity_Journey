# Protocols and Servers

## Task 2: Telnet

Telnet is an application layer protocol for connecting to a virtual terminal on another computer. It uses port 23, but communication is unencrypted.

---

## Task 3: Hypertext Transfer Protocol (HTTP)

HTTP transmits data in cleartext, allowing tools like Telnet or Netcat to interact with web servers as browsers. Popular HTTP servers include Apache, IIS, and nginx.

### Example:

```plaintext
pentester@TryHackMe$ telnet 10.48.144.215 80
Trying 10.48.144.215...
Connected to 10.48.144.215.
Escape character is '^]'.
GET /index.html HTTP/1.1
host: telnet

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 15 Sep 2021 08:56:20 GMT
Content-Type: text/html
Content-Length: 234
Last-Modified: Wed, 15 Sep 2021 08:53:59 GMT
Connection: keep-alive
ETag: "6141b4a7-ea"
Accept-Ranges: bytes
```

---

## Task 4: File Transfer Protocol (FTP)

FTP enables file transfers between systems efficiently but transmits data in cleartext. It uses port 21 by default, and tools like Telnet or Netcat can interact with FTP servers.

### Example:

```plaintext
pentester@TryHackMe$ telnet 10.48.144.215 21
Trying 10.48.144.215...
Connected to 10.48.144.215.
Escape character is '^]'.
220 (vsFTPd 3.0.3)
USER frank
331 Please specify the password.
PASS D2xc9CgD
230 Login successful.
SYST
215 UNIX Type: L8
PASV
227 Entering Passive Mode (10,10,0,148,78,223).
TYPE A
200 Switching to ASCII mode.
STAT
211-FTP server status:
    Connected to ::ffff:10.10.0.1
    Logged in as frank
    TYPE: ASCII
    No session bandwidth limit
    Session timeout in seconds is 300
    Control connection is plain text
    Data connections will be plain text
    At session startup, client count was 1
    vsFTPd 3.0.3 - secure, fast, stable
211 End of status
QUIT
221 Goodbye.
Connection closed by foreign host.
```

---

## Task 5: Simple Mail Transfer Protocol (SMTP)

SMTP operates in cleartext, allowing Telnet to simulate an email client (MUA) for sending messages. SMTP servers typically listen on port 25.

### Example:

```plaintext
pentester@TryHackMe$ telnet 10.48.144.215 25
Trying 10.48.144.215...
Connected to 10.48.144.215.
Escape character is '^]'.
220 bento.localdomain ESMTP Postfix (Ubuntu)
helo telnet
250 bento.localdomain
mail from: 
250 2.1.0 Ok
rcpt to: 
250 2.1.5 Ok
data
354 End data with .
subject: Sending email with Telnet
Hello Frank,
I am just writing to say hi!
.
250 2.0.0 Ok: queued as C3E7F45F06
quit
221 2.0.0 Bye
Connection closed by foreign host.
```

---

## Task 6: Post Office Protocol 3 (POP3)

POP3 is a protocol for downloading emails from an MDA server. The client connects, authenticates, retrieves messages, and optionally deletes them.

### Example:

```plaintext
pentester@TryHackMe$ telnet 10.48.144.215 110
Trying 10.48.144.215...
Connected to 10.48.144.215.
Escape character is '^]'.
+OK 10.48.144.215 Mail Server POP3 Wed, 15 Sep 2021 11:05:34 +0300 
USER frank
+OK frank
PASS D2xc9CgD
+OK 1 messages (179) octets
STAT
+OK 1 179
LIST
+OK 1 messages (179) octets
1 179
.
RETR 1
+OK
From: Mail Server 
To: Frank 
subject: Sending email with Telnet
Hello Frank,
I am just writing to say hi!
.
QUIT
+OK 10.48.144.215 closing connection
Connection closed by foreign host.
```

---

## Task 7: Internet Message Access Protocol (IMAP)

IMAP synchronizes emails across devices, unlike POP3. The default port is 143. Changes like marking an email as read are saved on the IMAP server and reflected on all devices.

### Example:

```plaintext
pentester@TryHackMe$ telnet 10.48.144.215 143
Trying 10.48.144.215...
Connected to 10.48.144.215.
Escape character is '^]'.
* OK [CAPABILITY IMAP4rev1 UIDPLUS CHILDREN NAMESPACE THREAD=ORDEREDSUBJECT THREAD=REFERENCES SORT QUOTA IDLE ACL ACL2=UNION STARTTLS ENABLE UTF8=ACCEPT] Courier-IMAP ready. Copyright 1998-2018 Double Precision, Inc.  See COPYING for distribution information.
c1 LOGIN frank D2xc9CgD
* OK [ALERT] Filesystem notification initialization error -- contact your mail administrator (check for configuration errors with the FAM/Gamin library)
c1 OK LOGIN Ok.
c2 LIST "" "*"
* LIST (\HasNoChildren) "." "INBOX.Trash"
* LIST (\HasNoChildren) "." "INBOX.Drafts"
* LIST (\HasNoChildren) "." "INBOX.Templates"
* LIST (\HasNoChildren) "." "INBOX.Sent"
* LIST (\Unmarked \HasChildren) "." "INBOX"
c2 OK LIST completed
c3 EXAMINE INBOX
* FLAGS (\Draft \Answered \Flagged \Deleted \Seen \Recent)
* OK [PERMANENTFLAGS ()] No permanent flags permitted
* 0 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 631694851] Ok
* OK [MYRIGHTS "acdilrsw"] ACL
c3 OK [READ-ONLY] Ok
c4 LOGOUT
* BYE Courier-IMAP server shutting down
c4 OK LOGOUT completed
Connection closed by foreign host.
```

---

## Appendix

### Protocols and Ports

| Protocol    | TCP Port | Application(s)       | Data Security |
|-------------|----------|----------------------|---------------|
| FTP         | 21       | File Transfer        | Cleartext     |
| HTTP        | 80       | Worldwide Web        | Cleartext     |
| IMAP        | 143      | Email (MDA)          | Cleartext     |
| POP3        | 110      | Email (MDA)          | Cleartext     |
| SMTP        | 25       | Email (MTA)          | Cleartext     |
| Telnet      | 23       | Remote Access        | Cleartext     |