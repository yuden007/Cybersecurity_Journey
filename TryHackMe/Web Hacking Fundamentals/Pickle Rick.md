# Pickle Rick

---

## TASK: Scan Port

### Nmap Scan Report
```plaintext
*************************************************************************************
* Starting Nmap 7.95 ( https://nmap.org ) at 2025-11-27 16:03 HKT
* Nmap scan report for 10.49.188.177
* Host is up (0.10s latency).
* Not shown: 998 closed tcp ports (reset)
* PORT   STATE SERVICE
* 22/tcp open  ssh
* 80/tcp open  http
*
* Nmap done: 1 IP address (1 host up) scanned in 39.41 seconds
*************************************************************************************
```

---

## TASK: Look for Sub-Domain

### Nikto
Nikto scans web servers for vulnerabilities like outdated software and dangerous files.

#### Usage:
```bash
nikto -h <TARGET>
```
Example:
```bash
nikto -h http://example.com
```

#### Options:
- `-p <PORT>`: Specify port (default: 80).
- `-ssl`: Force HTTPS scanning.
- `-Tuning <OPTIONS>`: Select tests (e.g., 1: Files, 2: Misconfig, 9: All).
- `-o <FILE>`: Save results (e.g., -o results.txt).
- `-Format <FORMAT>`: Output format (txt, html, csv, xml).
- `-timeout <SECONDS>`: Set request timeout.
- `-update`: Update vulnerability database.

#### Example Output:
```plaintext
*************************************************************************************
* root@ip-10-49-101-35:~# nikto -h http://10.49.188.177
* - Nikto v2.1.5
* ---------------------------------------------------------------------------
* + Target IP:          10.49.188.177
* + Target Hostname:    10.49.188.177
* + Target Port:        80
* + Start Time:         2025-11-27 08:35:46 (GMT0)
* ---------------------------------------------------------------------------
* + Server: Apache/2.4.41 (Ubuntu)
* + Server leaks inodes via ETags, header found with file /, fields: 0x426 0x5818ccf125686 
* + The anti-clickjacking X-Frame-Options header is not present.
* + No CGI Directories found (use '-C all' to force check all possible dirs)
* + "robots.txt" retrieved but it does not contain any 'disallow' entries (which is odd).
* + Allowed HTTP Methods: GET, POST, OPTIONS, HEAD 
* + Cookie PHPSESSID created without the httponly flag
* + /login.php: Admin login page/section found.
* + 6544 items checked: 0 error(s) and 6 item(s) reported on remote host
* + End Time:           2025-11-27 08:35:55 (GMT0) (9 seconds)
* ---------------------------------------------------------------------------
* + 1 host(s) tested
*************************************************************************************
```

---

## TASK: Look for Sub-Domain

### ffuf
Fuzz Faster U Fool (ffuf) is a web fuzzer for discovering hidden files, directories, and parameters on web servers.

#### Basic Usage:
```bash
ffuf -u <URL> -w <WORDLIST>
```
Example:
```bash
ffuf -u http://example.com/FUZZ -w /path/to/wordlist.txt
```

#### Options:
- `-u <URL>`: Target URL with FUZZ as the placeholder.
- `-w <WORDLIST>`: Wordlist for fuzzing.
- `-mc <STATUS_CODES>`: Match specific HTTP status codes (e.g., -mc 200,301).
- `-o <OUTPUT_FILE>`: Save results to a file.
- `-recursion`: Enable recursive fuzzing.
- `-t <THREADS>`: Set concurrent threads (e.g., -t 50).

#### Example Output:
```plaintext
*************************************************************************************
* root@ip-10-49-101-35:~# ffuf -u http://10.49.188.177/FUZZ -w /usr/share/wordlists/dirb/common.txt 
* ...
* /htaccess            (Status: 403) [Size: 278]
* /htpasswd            (Status: 403) [Size: 278]
* /assets               (Status: 301) [Size: 315] [--> http://10.49.188.177/assets/]
* /index.html           (Status: 200) [Size: 1062]
* /robots.txt           (Status: 200) [Size: 17]
* /server-status        (Status: 403) [Size: 278]
* Progress: 4614 / 4615 (99.98%)
* ===============================================================
* Finished
* ===============================================================
*************************************************************************************
```

---

## TASK: Login and Explore

1. Go to `login.php`.
2. Login with the password from the index HTML comment and the password from `robots.txt`.
3. Run `ls` to find the first ingredient.
4. Use `tac` instead of `cat` to view files.
5. Explore `/home/rick` to find the second ingredient.
6. Run `sudo -l` to check permissions.
7. Use `sudo tac` to view the third ingredient in the root directory.

---

## Appendix

