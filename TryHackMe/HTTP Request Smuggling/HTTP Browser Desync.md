# HTTP Browser Desync

---

## TASK 2: HTTP Features

### HTTP Keep-Alive

HTTP keep-alive allows multiple HTTP requests over a single TCP connection, improving performance. However, it can introduce risks like cache poisoning if desync issues are exploited.

### HTTP Pipelining

HTTP pipelining allows sending multiple requests without waiting for responses. The server uses the `Content-Length` header to separate requests. For static files, `Content-Length` is often not needed.

---

## TASK 3: HTTP Browser Desync

### Attack Overview

In a Browser Desync attack, an attacker exploits vulnerabilities in a web application's connection handling to hijack user requests. The attack typically involves two steps:

1. The attacker sends a crafted request (often using HTTP keep-alive) that disrupts the request queue by injecting an arbitrary request.
2. The next legitimate user request is replaced or intercepted by the attacker's injected request.

---

## TASK 4: HTTP Browser Desync Identification

For a better understanding of HTTP Browser Desynchronization, we will use a web application vulnerable to CVE-2022-29361. The web app will serve a single route.

---

## Appendix

---