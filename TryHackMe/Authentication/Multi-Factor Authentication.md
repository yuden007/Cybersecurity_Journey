# Multi-Factor Authentication

---

## TASK 6: Beating the Auto-Logout Feature

### Brute-Force the OTP

In some applications, failing the 2FA challenge can cause the application to revert the user back to the first part of the authentication process. This behavior typically occurs due to security mechanisms designed to prevent brute-force attacks on the 2FA part of the application.

#### Common Reasons for This Behavior

1. **Session Invalidation**: Upon failing the 2FA challenge, the application might invalidate the user's session as a security measure.
2. **Rate-Limiting and Lockout Policies**: To prevent attackers from repeatedly attempting to bypass 2FA, the application may have rate-limiting or lockout mechanisms in place.
3. **Security-Driven Redirection**: Some applications redirect users back to the login page after multiple failed 2FA attempts.

#### Exploitation

The application hosted at `http://mfa.thm/labs/third` automatically logs out the user if they fail the 2FA challenge. For demonstration purposes, the application also generates a 4-digit PIN code every time the user logs in to the application.

---

## Appendix

---