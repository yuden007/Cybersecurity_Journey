# HTTP Request Smuggling

---

## TASK 4: Request Smuggling CL.TE

### CL.TE = Content-Length/Transfer-Encoding

#### How CL.TE Request Smuggling Works

Craft ambiguous requests interpreted differently by each server. For example, sending a request with both `Content-Length` and `Transfer-Encoding` headers:

- The front-end server uses `Content-Length` and thinks the request ends at a certain point.
- The back-end server uses `Transfer-Encoding` and interprets the request differently, leading to unexpected behavior.

#### Exploiting CL.TE for Request Smuggling

To exploit CL.TE, craft a request with both headers so the front-end and back-end servers interpret boundaries differently.

---

## TASK 5: Request Smuggling TE.CL

### TE.CL = Transfer-Encoding/Content-Length

#### How TE.CL Request Smuggling Works

Craft ambiguous requests interpreted differently by each server. For example, sending a request with both `Content-Length` and `Transfer-Encoding` headers:

- The front-end server uses `Transfer-Encoding` and processes the request as chunked.
- The back-end server uses `Content-Length` and processes only the specified number of bytes, potentially leading to unexpected behavior.

---

## Appendix

---