# Nmap Advanced Port Scans

## Task 2: TCP Null Scan, FIN Scan, and Xmas Scan

### Null Scan

A null scan (`-sN`) sets no flags in the TCP packet. Open ports do not respond, while closed ports send an RST packet. Lack of an RST indicates the port is open or filtered.

```bash
sudo nmap -sN 10.49.173.173
```

### FIN Scan

The FIN scan (`-sF`) sends a TCP packet with the FIN flag set. Open ports do not respond, while closed ports send an RST. Firewalls may drop traffic silently, making ports appear open|filtered.

```bash
sudo nmap -sF 10.49.173.173
```

### Xmas Scan

The Xmas scan (`-sX`) sets the FIN, PSH, and URG flags. Open ports do not respond, while closed ports send an RST. Ports are reported as open|filtered if no RST is received.

```bash
sudo nmap -sX 10.49.173.173
```

---

## Task 3: TCP Maimon Scan

The TCP Maimon scan (`-sM`) sets the FIN and ACK flags. Open ports on certain BSD-derived systems drop the packet, exposing them, while closed ports respond with an RST. This scan is rarely effective on modern networks but helps illustrate port scanning techniques.

```bash
sudo nmap -sM 10.10.252.27
```

---

## Appendix

### Port Scan Types and Commands

| Port Scan Type          | Example Command                          |
|-------------------------|------------------------------------------|
| TCP Null Scan           | `sudo nmap -sN MACHINE_IP`              |
| TCP FIN Scan            | `sudo nmap -sF MACHINE_IP`              |
| TCP Xmas Scan           | `sudo nmap -sX MACHINE_IP`              |
| TCP Maimon Scan         | `sudo nmap -sM MACHINE_IP`              |
| TCP ACK Scan            | `sudo nmap -sA MACHINE_IP`              |
| TCP Window Scan         | `sudo nmap -sW MACHINE_IP`              |
| Custom TCP Scan         | `sudo nmap --scanflags URGACKPSHRSTSYNFIN MACHINE_IP` |
| Spoofed Source IP       | `sudo nmap -S SPOOFED_IP MACHINE_IP`    |
| Spoofed MAC Address     | `sudo nmap --spoof-mac SPOOFED_MAC`     |
| Decoy Scan              | `sudo nmap -D DECOY_IP,ME MACHINE_IP`   |
| Idle (Zombie) Scan      | `sudo nmap -sI ZOMBIE_IP MACHINE_IP`    |
| Fragment IP (8 bytes)   | `sudo nmap -f MACHINE_IP`               |
| Fragment IP (16 bytes)  | `sudo nmap -ff MACHINE_IP`              |

### Options

| Option                  | Purpose                                  |
|-------------------------|------------------------------------------|
| `--source-port`         | Specify source port number               |
| `--data-length`         | Append random data to reach the given length |
| `--reason`              | Explains how Nmap made its conclusion    |
| `-v`                    | Verbose                                 |
| `-vv`                   | Very verbose                            |
| `-d`                    | Debugging                               |
| `-dd`                   | More details for debugging              |