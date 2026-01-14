# HTTP/2 Request Smuggling

---

## TASK 2: HTTP/2 Explained

HTTP/2 is a binary protocol that improves on HTTP/1.1 by making communication more efficient and less error-prone for machines. Unlike HTTP/1.1, which is text-based, HTTP/2 uses binary framing, making it faster and easier for computers to parse.

### Key Differences

- Uses pseudo-headers (e.g., `:method`, `:path`) for required fields.
- All headers are lowercase, and each part of the request (headers, body) is prefixed with its size, removing ambiguity.
- `Content-Length` and `Transfer-Encoding` headers are not needed, as sizes are explicit.

Request smuggling is much harder in HTTP/2 because of these clear boundaries. However, issues can still arise when HTTP/2 traffic is converted to HTTP/1.1 by proxies or load balancers, which may reintroduce ambiguities.

---

## TASK 3: HTTP/2 Desync

When a reverse proxy uses HTTP/2 on the frontend and HTTP/1.1 on the backend, HTTP/2 downgrading can occur. This may reintroduce HTTP request smuggling vulnerabilities.

### H2.CL (Content-Length)

Adding a `Content-Length` header to an HTTP/2 request (which is ignored by HTTP/2 but used by HTTP/1.1) can desync the backend connection if the proxy passes it through. For example, setting `Content-Length: 0` tricks the backend into treating the body as a new request.

### H2.TE (Transfer-Encoding)

Similarly, adding a `Transfer-Encoding: chunked` header can cause desync if the backend honors it.

### CRLF Injection

Injecting `\r\n` (CRLF) into HTTP/2 headers can create new headers or requests when translated to HTTP/1.1, enabling request smuggling.

---

## Appendix

---