# CSRF

## TASK 2: Overview of CSRF Attack

CSRF (Cross-Site Request Forgery) is a vulnerability where an attacker causes a user's browser to send authenticated requests to a trusted site (the browser includes cookies automatically), letting the attacker perform actions on the user's behalf via malicious HTML or JavaScript.

### A CSRF Attack Typically Follows Three Steps:
1. Attacker learns the target request format and crafts a malicious link/page.
2. Victim, already authenticated to the target site, interacts (click, image load, etc.).
3. Browser sends credentials; the server accepts the forged request due to missing CSRF checks.

### Phases of CSRF
Server-side checks are insufficient, so the application can't distinguish forged requests from legitimate ones.

### Effects of CSRF
- Unauthorized actions: change passwords, email, or perform transactions.
- Exploits trust: uses the site's trust in the user's browser state.
- Stealthy: operates via normal browser behavior and is often unnoticed.

### Mitigation
Use CSRF tokens, SameSite cookies, and validate Origin/Referer headers.

---

## TASK 3: Types of CSRF Attack

### Traditional CSRF
Conventional CSRF tricks an authenticated user's browser into submitting state-changing requests (e.g., money transfer, change account settings) by forging form submissions or links. The browser includes credentials so the server executes the action if CSRF protections are missing.

#### Example Steps:
1. Victim is logged into a site (e.g., bank).
2. Attacker crafts a malicious link/form and lures the victim to trigger it.
3. Victim's browser sends the authenticated request; the server performs the action.

### XMLHttpRequest CSRF
Asynchronous CSRF uses AJAX (XMLHttpRequest/Fetch) to send forged requests without full page reloads. It exploits the same trust in browser credentials but via script-driven calls.

#### Example Steps:
1. Victim is authenticated to a web app using cookies.
2. Attacker hosts a page with script that issues an AJAX POST/GET to the target API.
3. The browser includes session cookies; the target processes the request if no CSRF defenses exist.

### Flash-based CSRF
Legacy technique where malicious Flash (.swf) files issue cross-site requests using the victim's browser context. With Flash deprecated, this mainly affects older systems still running Flash components.