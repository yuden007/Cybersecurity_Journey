# Protocols and Servers 2

## Task 2: Sniffing Attack

A sniffing attack can be performed using an Ethernet network card with proper permissions (root/admin). Tools include:

- **Tcpdump**: Open-source CLI tool for packet capture.
- **Wireshark**: Open-source GUI tool for multiple OS.
- **Tshark**: CLI alternative to Wireshark.

To capture a user's email credentials using POP3, we used the command:

```bash
sudo tcpdump port 110 -A
```

This requires access to network traffic, which can be achieved via a wiretap, port mirroring, or a successful Man-in-the-Middle (MITM) attack.

---

## Task 3: Man-in-the-Middle Attack (MITM)

HTTP browsing is vulnerable to MITM attacks, often undetectable. Tools like Ettercap and Bettercap facilitate such attacks. Cleartext protocols (FTP, SMTP, POP3) are also at risk. Mitigation involves encryption (e.g., TLS) and proper authentication using PKI and trusted certificates.

---

## Task 4: Transport Layer Security (TLS)

Encryption can be added at the presentation layer of the ISO/OSI model, ensuring data is transmitted as ciphertext.

### Layers:

- **Application Layer**: HTTP, FTP, SMTP, POP3, IMAP, etc.
- **Presentation Layer**: SSL, TLS.

TLS has replaced SSL due to improved security. While SSL is still widely mentioned, modern servers predominantly use TLS.

### Protocols and Ports:

| Protocol    | Default Port | Secured Protocol | Default Port with TLS |
|-------------|--------------|------------------|------------------------|
| HTTP        | 80           | HTTPS            | 443                    |
| FTP         | 21           | FTPS             | 990                    |
| SMTP        | 25           | SMTPS            | 465                    |
| POP3        | 110          | POP3S            | 995                    |
| IMAP        | 143          | IMAPS            | 993                    |

---

## Task 5: SSH and SCP

SCP (Secure Copy Protocol) uses SSH to transfer files.

### Examples:

- Copy `archive.tar.gz` from the remote `/home/mark` to the local home directory:

  ```bash
  scp mark@10.49.133.132:/home/mark/archive.tar.gz ~
  ```

- Upload `backup.tar.bz2` to the remote `/home/mark`:

  ```bash
  scp backup.tar.bz2 mark@10.49.133.132:/home/mark/
  ```

---

## Task 6: Password Attack

THC Hydra automates password attacks for protocols like FTP, POP3, IMAP, SMTP, SSH, and HTTP.

### Syntax:

```bash
hydra -l username -P wordlist.txt server service
```

### Options:

- `-l username`: Target username.
- `-P wordlist.txt`: Password list file.
- `server`: Target hostname/IP.
- `service`: Target service.

### Examples:

- Use `mark` as the username and iterate over passwords against the FTP server:

  ```bash
  hydra -l mark -P /usr/share/wordlists/rockyou.txt 10.49.133.132 ftp
  ```

- Use `frank` as the username and try SSH login:

  ```bash
  hydra -l frank -P /usr/share/wordlists/rockyou.txt 10.49.133.132 ssh
  ```

### Additional Arguments:

- `-s PORT`: Specify a non-default port for the service.
- `-V` or `-vV`: Enable verbose mode to show attempted username/password combinations.
- `-t n`: Set the number of parallel connections (e.g., `-t 16` for 16 threads).
- `-d`: Enable debugging for detailed output, useful for troubleshooting.

---

## Appendix

### Protocols and Ports

| Protocol    | TCP Port | Application(s)              | Data Security |
|-------------|----------|-----------------------------|---------------|
| FTP         | 21       | File Transfer               | Cleartext     |
| FTPS        | 990      | File Transfer               | Encrypted     |
| HTTP        | 80       | Worldwide Web               | Cleartext     |
| HTTPS       | 443      | Worldwide Web               | Encrypted     |
| IMAP        | 143      | Email (MDA)                 | Cleartext     |
| IMAPS       | 993      | Email (MDA)                 | Encrypted     |
| POP3        | 110      | Email (MDA)                 | Cleartext     |
| POP3S       | 995      | Email (MDA)                 | Encrypted     |
| SFTP        | 22       | File Transfer               | Encrypted     |
| SSH         | 22       | Remote Access/File Transfer | Encrypted     |
| SMTP        | 25       | Email (MTA)                 | Cleartext     |
| SMTPS       | 465      | Email (MTA)                 | Encrypted     |
| Telnet      | 23       | Remote Access               | Cleartext     |