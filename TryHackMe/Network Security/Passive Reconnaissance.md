# Passive Reconnaissance

## Task 1: Introduction

We use `whois` to query WHOIS records, while we use `nslookup` and `dig` to query DNS database records.

- `whois`: Query WHOIS servers.
- `nslookup`: Query DNS servers.
- `dig`: Query DNS servers.

---

## Task 2: Passive vs Active

### Passive Reconnaissance

In passive reconnaissance, you rely on publicly available knowledge, such as:

- Looking up DNS records of a domain from a public DNS server.
- Checking job ads related to the target website.
- Reading news articles about the target company.

### Active Reconnaissance

Active reconnaissance requires direct engagement with the target, such as:

- Connecting to one of the company servers such as HTTP, FTP, and SMTP.
- Calling the company in an attempt to get information (social engineering).
- Entering company premises pretending to be a repairman.

---

## Task 3: WHOIS

WHOIS is a protocol (RFC 3912) that listens on TCP port 43. It provides domain-related information such as:

- **Registrar**: Domain registrar details.
- **Registrant contact**: Name, organization, address, etc. (unless hidden).
- **Dates**: Creation, update, and expiration.
- **Name Server**: Resolves the domain name.

Use a WHOIS client or an online service to get domain info. On Linux (e.g., Kali, Parrot), use the terminal command:

```bash
whois DOMAIN_NAME
```

Example:

```bash
whois tryhackme.com
```

---

## Task 4: nslookup and dig

### nslookup

Use `nslookup` to find the IP of a domain:

```bash
nslookup DOMAIN_NAME
```

You can also specify options and servers:

```bash
nslookup OPTIONS DOMAIN_NAME SERVER
```

- **OPTIONS**: Query type (e.g., A for IPv4, AAAA for IPv6).
- **DOMAIN_NAME**: The domain to look up.
- **SERVER**: DNS server to query (e.g., Cloudflare 1.1.1.1, Google 8.8.8.8).

Examples:

```bash
nslookup -type=A tryhackme.com 1.1.1.1
nslookup -type=MX tryhackme.com
```

### dig

Use `dig` (Domain Information Groper) for advanced DNS queries. To specify a record type, use:

```bash
dig DOMAIN_NAME TYPE
```

Optionally, query a specific server with:

```bash
dig @SERVER DOMAIN_NAME TYPE
```

Examples:

```bash
dig tryhackme.com MX
dig @1.1.1.1 tryhackme.com MX
```

---

## Task 5: DNSDumpster

DNS lookup tools like `nslookup` and `dig` cannot find subdomains directly. Subdomains, such as `wiki.tryhackme.com` or `webmail.tryhackme.com`, may reveal valuable information about a target. These subdomains might host outdated or vulnerable services.

To discover subdomains, you can use search engines or brute-force DNS queries, but these methods are time-consuming. Instead, tools like DNSDumpster provide detailed DNS information, including subdomains, in an easy-to-read format.

---

## Task 6: Shodan.io

Shodan.io helps in passive reconnaissance by providing information about a client’s network without direct interaction. It scans and indexes online devices, creating a searchable database of connected "things."

Example:

Searching `tryhackme.com` reveals details like:

- IP address.
- Hosting company.
- Geographic location.
- Server type/version.

---

## Appendix

### Command Summary Table

| Task                          | Command                                      | Description                                                                 |
|-------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| Lookup WHOIS record           | `whois tryhackme.com`                        | Retrieves WHOIS information for the domain.                                |
| Lookup DNS A records          | `nslookup -type=A tryhackme.com`             | Finds all IPv4 addresses for the domain.                                   |
| Lookup DNS MX records         | `nslookup -type=MX tryhackme.com 1.1.1.1`    | Finds email servers and configurations for the domain using a DNS server.  |
| Lookup DNS TXT records        | `nslookup -type=TXT tryhackme.com`           | Retrieves TXT records for the domain.                                      |
| Lookup DNS A records          | `dig tryhackme.com A`                        | Retrieves IPv4 addresses for the domain.                                   |
| Lookup DNS MX records         | `dig @1.1.1.1 tryhackme.com MX`              | Finds email servers using a specific DNS server.                           |
| Lookup DNS TXT records        | `dig tryhackme.com TXT`                      | Retrieves TXT records for the domain.                                      |