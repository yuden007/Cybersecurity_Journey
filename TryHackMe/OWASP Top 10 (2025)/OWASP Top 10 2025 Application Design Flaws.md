# OWASP Top 10 2025: Application Design Flaws

## Task 2: AS02: Security Misconfigurations

Given `/api/process`, try to access `/api/process/admin` to retrieve the flag.

---

## Task 3: AS03: Software Supply Chain Failures

Given the `app.py`, we notice that we can POST with JSON:

```json
{
    "data": "debug",
    "debug": "true"
}
```

The response shows the flag.

---

## Task 4: AS04: Cryptography Failures

When visiting the page, a `decrypt.js` file is included. It shows the decryption information. Use CyberChef to decrypt and retrieve the flag.

---

## Task 5: AS06: Insecure Design

Given an AI chatbot mobile app download link, use `ffuf` to find further paths:

```bash
ffuf -u http://10.201.2.122:5005/FUZZ -w /usr/share/wordlists/dirb/common.txt
ffuf -u http://10.201.2.122:5005/api/FUZZ -w /usr/share/wordlists/dirb/common.txt
```

This reveals the path:

```plaintext
http://10.201.2.122:5005/api/messages/user1
```

---

## Appendix

