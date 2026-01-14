# SSRF

## TASK 3: Types of SSRF - Basic

### Scenario I: SSRF Against a Local Server
In this attack, the attacker exploits the server's ability to make requests to itself using a loopback IP or localhost. Example:
```url
http://hrms.thm/?url=localhost/config
```

---

## TASK 5: Types of SSRF - Blind

### Blind SSRF With Out-Of-Band
Blind SSRF occurs when attackers send requests to a server but cannot directly see the responses. Exploitation often involves out-of-band (OOB) techniques.

---

## TASK 7: Remedial Measures

### Mitigation
- Input Validation: Validate and sanitize all user input.
- Use Allowlists: Use allowlists of trusted URLs/domains.
- Network Segmentation: Isolate sensitive internal resources from external access.

---

## Appendix

Refer to the TryHackMe room for more details.