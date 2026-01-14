# Nmap Live Host Discovery

## Task 1: Introduction

Nmap uses various approaches to discover live hosts:

- **ARP Scan**: Uses ARP requests to discover live hosts.
- **ICMP Scan**: Uses ICMP requests to identify live hosts.
- **TCP/UDP Ping Scan**: Sends packets to TCP and UDP ports to determine live hosts.

---

## Task 3: Enumerating Targets

### Target Specification:

- **List**: `MACHINE_IP scanme.nmap.org example.com` will scan 3 IP addresses.
- **Range**: `10.11.12.15-20` will scan 6 IP addresses: `10.11.12.15`, `10.11.12.16`, …, and `10.11.12.20`.
- **Subnet**: `MACHINE_IP/30` will scan 4 IP addresses.

### Commands:

- List hosts without scanning them:

  ```bash
  nmap -sL TARGETS
  ```

- Perform reverse-DNS resolution to get hostnames:

  ```bash
  nmap -n TARGETS
  ```

- Host discovery only:

  ```bash
  nmap -sn TARGETS
  ```

---

## Task 5: ARP

- Discover online hosts without port-scanning:

  ```bash
  sudo nmap -sn TARGETS
  ```

- Send ARP queries to all valid IPs on the local network:

  ```bash
  sudo arp-scan --localhost
  sudo arp-scan -l
  ```

- Send ARP queries for all valid IPs on the `eth0` interface:

  ```bash
  sudo arp-scan -I eth0 -l
  ```

---

## Task 6: ICMP

- Use ICMP echo request to discover live hosts:

  ```bash
  sudo nmap -PE -sn MACHINE_IP/24
  ```

- Use ICMP timestamp requests:

  ```bash
  sudo nmap -PP -sn MACHINE_IP/24
  ```

- Use ICMP address mask queries:

  ```bash
  sudo nmap -PM -sn MACHINE_IP/24
  ```

---

## Task 7: TCP and UDP

- **TCP SYN Ping**:

  ```bash
  sudo nmap -PS -sn MACHINE_IP/24
  ```

- **TCP ACK Ping**:

  ```bash
  sudo nmap -PA -sn MACHINE_IP/24
  ```

- **UDP Ping**:

  ```bash
  sudo nmap -PU -sn MACHINE_IP/24
  ```

- **Masscan**:

  ```bash
  masscan MACHINE_IP/24 -p443
  masscan MACHINE_IP/24 -p80,443
  masscan MACHINE_IP/24 -p22-25
  masscan MACHINE_IP/24 --top-ports 100
  ```

---

## Task 8: Reverse-DNS Lookup

- Use reverse-DNS to gather hostnames:

  ```bash
  nmap -R TARGETS
  ```

- Query a specific DNS server:

  ```bash
  nmap --dns-servers DNS_SERVER TARGETS
  ```

---

## Appendix

### Scan Types

| Scan Type              | Example Command                          |
|------------------------|------------------------------------------|
| ARP Scan               | `sudo nmap -PR -sn MACHINE_IP/24`       |
| ICMP Echo Scan         | `sudo nmap -PE -sn MACHINE_IP/24`       |
| ICMP Timestamp Scan    | `sudo nmap -PP -sn MACHINE_IP/24`       |
| ICMP Address Mask Scan | `sudo nmap -PM -sn MACHINE_IP/24`       |
| TCP SYN Ping Scan      | `sudo nmap -PS22,80,443 -sn MACHINE_IP/30` |
| TCP ACK Ping Scan      | `sudo nmap -PA22,80,443 -sn MACHINE_IP/30` |
| UDP Ping Scan          | `sudo nmap -PU53,161,162 -sn MACHINE_IP/30` |