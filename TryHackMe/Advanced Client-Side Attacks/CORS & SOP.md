# CORS & SOP

## TASK 2: Understanding SOP

The Same-Origin Policy (SOP) blocks scripts from accessing data on another page unless protocol, hostname, and port all match.

### Examples of SOP
- Same domain, different port: `https://test.com:80` can access `https://test.com:80/about`, but not `https://test.com:8080`.
- HTTP/HTTPS: `http://test.com` cannot access `https://test.com` due to different protocols.

### Common Misconceptions
- SOP applies to more than just scripts—it affects images, stylesheets, and frames too.
- SOP doesn't block all cross-origin actions; techniques like CORS and postMessage allow some.
- Same domain ≠ same origin; protocol and port must also match.

### SOP Decision Process
Browsers check protocol, hostname, and port. If all match, access is allowed; otherwise, it's blocked.

---

## TASK 3: Understanding CORS

Cross-Origin Resource Sharing (CORS) is a system using HTTP headers that lets servers specify which origins can access their resources. While the Same-Origin Policy (SOP) blocks cross-origin requests by default, CORS allows controlled exceptions. The server sends CORS headers in its response, and the browser enforces access based on these rules.

### Different HTTP Headers Involved in CORS
- `Access-Control-Allow-Origin`: Specifies allowed domains.
- `Access-Control-Allow-Methods`: Allowed HTTP methods.
- `Access-Control-Allow-Headers`: Allowed request headers.
- `Access-Control-Max-Age`: Caches preflight response.
- `Access-Control-Allow-Credentials`: Allows credentials (cookies, etc.) if true; cannot use `*` for origin.

### Common Scenarios Where CORS is Applied
- APIs: Frontend on one domain accessing an API on another.
- CDNs: Loading scripts, fonts, or assets from external sources.
- Web Fonts: Sharing fonts across domains.
- Third-Party Widgets: Embedding social buttons or chat plugins.
- Cross-domain Authentication: SSO or OAuth flows.

### Simple Requests vs. Preflight Requests
- **Simple Requests**: Use `GET`, `HEAD`, or `POST` with standard Content-Types and no custom headers.