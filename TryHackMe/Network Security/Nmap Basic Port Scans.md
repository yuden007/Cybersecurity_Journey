# Nmap Basic Port Scans

## Task 2: TCP and UDP Ports

### Port States

- **Open**: A service is listening on the specified port.
- **Closed**: No service is listening, but the port is accessible.
- **Filtered**: Nmap cannot determine if the port is open or closed due to a firewall.
- **Unfiltered**: Nmap cannot determine if the port is open or closed, but the port is accessible.
- **Open|Filtered**: Nmap cannot determine whether the port is open or filtered.
- **Closed|Filtered**: Nmap cannot determine whether the port is closed or filtered.

---

## Task 4: Connect Scan

If you are not a privileged user (root or sudoer), a TCP connect scan is the only possible option to discover open TCP ports. By default, Nmap will attempt to connect to the 1000 most common ports.

```bash
nmap -sT 10.48.132.110
```

- Use `-F` to enable fast mode and decrease the number of scanned ports from 1000 to 100 most common ports.
- Use the `-r` option to scan ports in consecutive order instead of random.

---

## Task 5: TCP SYN Scan

Unprivileged users can only perform connect scans, while SYN scans (default) require root or sudo privileges. SYN scans avoid completing the TCP 3-way handshake, reducing the chance of detection. Use the `-sS` option to perform a SYN scan.

```bash
sudo nmap -sS 10.48.142.27
```

---

## Task 6: UDP Scan

Sending a UDP packet to an open port won’t tell us anything. The UDP ports that don’t generate any unreachable response are the ones that Nmap will state as open.

```bash
sudo nmap -sU 10.49.147.23
```

---

## Task 7: Fine-Tuning Scope and Performance

- Scan specific ports with `-p22,80,443`, a range with `-p1-1023`, or all ports with `-p-`.
- Use `-F` for the top 100 ports or `--top-ports <n>` for the top `<n>` ports.
- Control scan timing with `-T<0-5>`, where `-T0` is the slowest (paranoid) and `-T5` is the fastest (insane).
- Adjust rates with `--min-rate <num>` and `--max-rate <num>`.
- Control parallelism with `--min-parallelism <num>` and `--max-parallelism <num>`.

---

## Appendix

### Scan Types

| Scan Type              | Example Command                          |
|------------------------|------------------------------------------|
| TCP Connect Scan       | `nmap -sT MACHINE_IP`                   |
| TCP SYN Scan           | `sudo nmap -sS MACHINE_IP`              |
| UDP Scan               | `sudo nmap -sU MACHINE_IP`              |

### Options

| Option                  | Purpose                                  |
|-------------------------|------------------------------------------|
| `-p-`                  | Scan all ports                          |
| `-p1-1023`             | Scan ports 1 to 1023                    |
| `-F`                   | Scan 100 most common ports              |
| `-r`                   | Scan ports in consecutive order         |
| `-T<0-5>`              | Timing template (0 = slowest, 5 = fastest) |
| `--max-rate 50`        | Limit rate to <= 50 packets/sec          |
| `--min-rate 15`        | Limit rate to >= 15 packets/sec          |
| `--min-parallelism 100`| Ensure at least 100 probes in parallel   |