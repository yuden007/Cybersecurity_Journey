# Red Team Recon

---

## TASK 3: Built-in Tools

### Whois

```
pentester@TryHackMe$ whois thmredteam.com
```

Use `whois` to get domain registration info: registrar, creation/expiry dates, and sometimes contact details.

### Nslookup

```
pentester@TryHackMe$ nslookup cafe.thmredteam.com
```

Use `nslookup` to query DNS records (A, AAAA) for a domain.

### Dig

```
pentester@TryHackMe$ dig cafe.thmredteam.com @1.1.1.1
```

Use `dig` for detailed DNS queries, optionally specifying a DNS server.

### Host

```
pentester@TryHackMe$ host cafe.thmredteam.com
```

Use `host` for a quick lookup of DNS records.

### Traceroute/Tracert

```
pentester@TryHackMe$ traceroute cafe.thmredteam.com
```

Use `traceroute` (Linux/macOS) or `tracert` (Windows) to trace the network path to a host.

### Summary

- `whois`: domain registration info
- `nslookup`/`dig`/`host`: DNS records
- `traceroute`/`tracert`: network path to target

---

## TASK 3: Advanced Searching

| Symbol / Syntax                  | Function                                               |
|-----------------------------------|--------------------------------------------------------|
| "search phrase"                   | Find results with exact search phrase                  |
| OSINT filetype:pdf                | Find files of type PDF related to a certain term.      |
| salary site:blog.tryhackme.com    | Limit search results to a specific site.               |
| pentest -site:example.com         | Exclude a specific site from results                   |
| walkthrough intitle:TryHackMe     | Find pages with a specific term in the page title.     |
| challenge inurl:tryhackme         | Find pages with a specific term in the page URL.       |

### Google Hacking Database (GHDB) Examples

#### Footholds

- **GHDB-ID: 6364** — Query: `intitle:"index of" "nginx.log"`
  Finds exposed Nginx logs that may reveal server misconfigurations.

#### Files Containing Usernames

- **GHDB-ID: 7047** — Query: `intitle:"index of" "contacts.txt"`
  Locates files that may leak sensitive user information.

#### Sensitive Directories

- **GHDB-ID: 6768** — Query: `inurl:/certs/server.key`
  Searches for exposed private RSA keys.

#### Web Server Detection

- **GHDB-ID: 6876** — Query: `intitle:"GlassFish Server - Server Running"`
  Detects GlassFish Server installations.

#### Vulnerable Files

- **GHDB-ID: 7786** — Query: `intitle:"index of" "*.php"`
  Finds directories listing PHP files.

#### Vulnerable Servers

- **GHDB-ID: 6728** — Query: `intext:"user name" intext:"orion core" -solarwinds.com`
  Discovers SolarWinds Orion web consoles.

#### Error Messages

- **GHDB-ID: 5963** — Query: `intitle:"index of" errors.log`
  Finds directories exposing error log files.

---

## TASK: Specialized Search Engines

### ViewDNS.info

ViewDNS.info offers Reverse IP Lookup to find other domains sharing the same IP as a target. Useful for identifying shared hosting.

### Threat Intelligence Platform

Threat Intelligence Platform checks domains or IPs for malware, WHOIS, and DNS info, presenting results in a readable format. Also shows other domains on the same IP.

### Censys

Censys Search gives details about IPs and domains, such as ownership and open ports. Shows if an IP is shared by multiple sites.

### Shodan

Shodan lets you search for info about IPs and open ports from the command line. Set up with `shodan init API_KEY` after creating an account. Example:

```
pentester@TryHackMe$ shodan host 172.67.212.249

172.67.212.249
City:                    San Francisco
Country:                 United States
Organisation:            Cloudflare, Inc.
Updated:                 2021-11-22T05:55:54.787113
Number of open ports:    5

Ports:
     80/tcp  
    443/tcp  
	|-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, TLSv1.2, TLSv1.3
   2086/tcp  
   2087/tcp  
   8080/tcp 
```

---

## TASK 6: Recon-ng

Recon-ng is a framework that automates OSINT tasks using modular components. It saves all collected data in a workspace database, making it useful for red team operations and penetration testing.

### Workflow

1. **Create a Workspace**

```
pentester@TryHackMe$ workspaces create thmredteam
```

2. **Start Recon-ng with a Workspace**

```
pentester@TryHackMe$ recon-ng -w thmredteam
```

3. **Seed the Database**

```
[recon-ng][thmredteam] > db schema
```

Insert the target domain into the domains table:

```
[recon-ng][thmredteam] > db insert domains
domain (TEXT): thmredteam.com
notes (TEXT): 
[*] 1 rows affected.
```

4. **Marketplace Usage**

Search, review, install, or remove modules from the marketplace:

```
[recon-ng][thmredteam] > marketplace search KEYWORD
[recon-ng][thmredteam] > marketplace info MODULE
[recon-ng][thmredteam] > marketplace install MODULE
[recon-ng][thmredteam] > marketplace remove MODULE
```

5. **Working with Modules**

```
[recon-ng][thmredteam] > modules search
[recon-ng][thmredteam] > modules load MODULE
```

6. **Example Output**

```
[recon-ng][thmredteam][google_site_web] > run
--------------
THMREDTEAM.COM
--------------
[*] Searching Google for: site:thmredteam.com
[*] Country: None
[*] Host: cafe.thmredteam.com
[*] Ip_Address: None
[*] Latitude: None
[*] Longitude: None
[*] Notes: None
[*] Region: None
[*] --------------------------------------------------
[*] Country: None
[*] Host: clinic.thmredteam.com
[*] Ip_Address: None
[*] Latitude: None
[*] Longitude: None
[*] Notes: None
[*] Region: None
[*] --------------------------------------------------
[*] 2 total (2 new) hosts found.
```

---

## TASK 7: Maltego

Maltego is a tool for visualizing OSINT data using entities (like domains, emails, IPs) and transforms (automated queries that expand information). You start with a piece of info, apply transforms to discover related data, and build a graph showing connections.

Transforms can be passive or active—know what each does before running it. For example, right-clicking a DNS name and choosing "To IP Address (DNS)" reveals IPs; then, "To DNS Name from passive DNS" can find related domains.

Maltego organizes findings visually, making it easy to track relationships. Many transforms are free in the Community Edition, but some require a paid license. Activation is needed even for the free version.

---

## Appendix

---