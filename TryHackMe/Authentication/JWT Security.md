# JWT Security

---

## TASK 4: Sensitive Information Disclosure

### Practical Example

Authenticate to the API using the following cURL request:

```
curl -H 'Content-Type: application/json' -X POST -d '{ "username" : "user", "password" : "password1" }' http://10.49.157.44/api/v1.0/example1
```

This will provide you with a JWT token. Decode the body of the JWT to uncover sensitive information. You can decode the body manually or use a website such as [JWT.io](https://jwt.io) for this process.

### Development Mistake

Sensitive information was added to the claim:

```python
payload = {
    "username" : username,
    "password" : password,
    "admin" : 0,
    "flag" : "[redacted]"
}

access_token = jwt.encode(payload, self.secret, algorithm="HS256")
```

### Fix

Values such as the password or flag should not be added as claims. Instead, securely store these values server-side in the backend. Example:

```python
payload = jwt.decode(token, self.secret, algorithms="HS256")

username = payload['username']
flag = self.db_lookup(username, "flag")
```

---

## TASK 5: Signature Validation Mistakes

### 1. Not Verifying the Signature

#### Issue
If the server does not verify the signature of the JWT, claims in the JWT can be modified.

#### Development Mistake

```python
payload = jwt.decode(token, options={'verify_signature': False})
```

#### Fix

```python
payload = jwt.decode(token, self.secret, algorithms="HS256")
```

---

## TASK 6: JWT Lifetime

### Token Lifetime

Verify the token's lifetime by checking the `exp` claim to ensure it hasn't expired before validating the signature. Example:

```python
lifetime = datetime.datetime.now() + datetime.timedelta(minutes=5)

payload = {
    'username' : username,
    'admin' : 0,
    'exp' : lifetime
}

access_token = jwt.encode(payload, self.secret, algorithm="HS256")
```

---

## TASK 7: Cross-Service Relay Attackers

### Audience Claim

JWTs can include an audience claim to specify the intended application. Example:

```python
payload = jwt.decode(token, self.secret, audience=["appA"], algorithms="HS256")
```

---

## Appendix

---