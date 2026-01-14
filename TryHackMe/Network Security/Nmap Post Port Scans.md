# Nmap Post Port Scans

## Task 2: Service Detection

Use `-sV` to detect service and version info on open ports. Adjust intensity with `--version-intensity LEVEL` (0-9). `--version-light` is level 2, and `--version-all` is level 9.

Using `-sV` forces Nmap to complete the TCP 3-way handshake to fully establish a connection, as version detection requires communication with the service. Stealth SYN scan (`-sS`) is not possible with `-sV`.

```bash
sudo nmap -sV 10.49.133.92
```

---

## Task 3: OS Detection and Traceroute

### OS Detection

Nmap can detect the Operating System (OS) based on its behavior and any telltale signs in its responses. OS detection can be enabled using `-O` (uppercase O as in OS).

```bash
sudo nmap -sS -O 10.49.133.92
```

### Traceroute

To find routers between you and the target, use `--traceroute`. Nmap appends traceroute results to its scan. Unlike standard traceroute, Nmap starts with a high TTL and decreases it.

```bash
sudo nmap -sS --traceroute 10.49.133.92
```

---

## Task 4: Nmap Scripting Engine (NSE)

Nmap Scripting Engine (NSE) uses Lua scripts to extend Nmap's functionality. Run default scripts with `--script=default` or `-sC`. Some scripts launch brute-force attacks against services, while others launch DoS attacks and exploit systems.

### Example:

```bash
sudo nmap -sS -sC 10.49.131.100
```

### Script Categories:

| Category       | Description                                      |
|----------------|--------------------------------------------------|
| `auth`         | Authentication-related scripts                  |
| `broadcast`    | Discover hosts by sending broadcast messages    |
| `brute`        | Performs brute-force password auditing          |
| `default`      | Default scripts, same as `-sC`                  |
| `discovery`    | Retrieve accessible information                 |
| `dos`          | Detects servers vulnerable to Denial of Service |
| `exploit`      | Attempts to exploit various vulnerable services |
| `external`     | Checks using a third-party service              |
| `fuzzer`       | Launch fuzzing attacks                          |
| `intrusive`    | Intrusive scripts like brute-force attacks      |
| `malware`      | Scans for backdoors                             |
| `safe`         | Safe scripts that won’t crash the target        |
| `version`      | Retrieve service versions                       |
| `vuln`         | Checks for vulnerabilities                      |

---

## Task 5: Saving the Output

Save Nmap scan results to a file using formats like Normal, Grepable, or XML.

### Normal:

Save scan results in normal format using `-oN FILENAME`.

```bash
nmap -sS -sV -O -oN MACHINE_IP_scan 10.48.152.80
```

### Grepable:

The grepable format (`-oG FILENAME`) condenses results for easy filtering with tools like grep.

```bash
nmap -sS -sV -O -oG MACHINE_IP_scan 10.48.152.80
```

### XML:

Save results in XML format using `-oX FILENAME`. Use `-oA FILENAME` to save in all three formats: normal, grepable, and XML.

---

## Appendix

### Options

| Option                  | Meaning                                   |
|-------------------------|-------------------------------------------|
| `-sV`                  | Determine service/version info on open ports |
| `-sV --version-light`  | Try the most likely probes (2)           |
| `-sV --version-all`    | Try all available probes (9)             |
| `-O`                   | Detect OS                                |
| `--traceroute`         | Run traceroute to target                 |
| `--script=SCRIPTS`     | Nmap scripts to run                      |
| `-sC` or `--script=default` | Run default scripts                  |
| `-A`                   | Equivalent to `-sV -O -sC --traceroute`  |
| `-oN`                  | Save output in normal format             |
| `-oG`                  | Save output in grepable format           |
| `-oX`                  | Save output in XML format                |
| `-oA`                  | Save output in normal, XML, and grepable formats |