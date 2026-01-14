# OAuth Vulnerabilities

---

## TASK 4: How OAuth Flow Works

### 1. Authorization Request

Tom visits `http://bistro.thm:8000/oauthdemo` and clicks "Login via OAuth." CoffeeShopApp redirects his browser to the authorization server with an authorization request.

Example URL:

```
http://coffee.thm:8000/accounts/login/?next=/o/authorize/%3Fclient_id%3Dzlurq9lseKqvHabNqOc2DkjChC000QJPQ0JvNoBt%26response_type%3Dcode%26redirect_uri%3Dhttp%3A//bistro.thm%3A8000/oauthdemo/callback
```

### 2. Authentication & Authorization

Tom logs in to the authorization server to verify his identity. After authentication, he consents to grant the bistro app access to his data.

---

## TASK 6: Exploiting OAuth - Stealing OAuth Token

### Vulnerability

An insecure `redirect_uri` can lead to severe security issues. If attackers gain control over any domain or URI listed in the `redirect_uri`, they can manipulate the flow to intercept tokens.

#### Crafted Attack

The attacker initiates an OAuth flow and ensures the `redirect_uri` points to their controlled domain. After the user authorizes the application, the token is sent to the attacker's domain.

---

## TASK 7: Exploiting OAuth - CSRF in OAuth

### Vulnerability of Weak or Missing State Parameter

The `state` parameter ensures the integrity of the OAuth flow by linking requests and responses. If missing or predictable, attackers can exploit this to redirect authorization codes to malicious URIs, enabling CSRF attacks.

---

## TASK 8: Exploiting OAuth Implicit Grant Flow

### Weaknesses

1. **Access Token in URL**: Token is returned in the URL fragment, accessible by scripts on the page.
2. **Weak Redirect URI Validation**: OAuth server allows manipulation of redirection endpoints.
3. **No HTTPS**: Lack of HTTPS enables token interception via man-in-the-middle attacks.
4. **Insecure Token Storage**: Tokens stored insecurely (e.g., `localStorage`) are vulnerable to XSS.

---

## Appendix

---