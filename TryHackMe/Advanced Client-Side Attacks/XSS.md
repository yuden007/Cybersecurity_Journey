# XSS

## TASK 4: Reflected XSS

### PHP
#### Vulnerable Code
```php
<?php
$search_query = $_GET['q'];
echo "<p>You searched for: $search_query</p>";
?>
```
This code is vulnerable because user input is output without sanitization, allowing XSS.

#### Fixed Code
```php
<?php
$search_query = $_GET['q'];
$escaped_search_query = htmlspecialchars($search_query);
echo "<p>You searched for: $escaped_search_query</p>";
?>
```
Using `htmlspecialchars()` escapes special characters, preventing XSS.

### JavaScript (Node.js)
#### Vulnerable Code
```javascript
const express = require('express');
const app = express();

app.get('/search', function(req, res) {
    var searchTerm = req.query.q;
    res.send('You searched for: ' + searchTerm);
});

app.listen(80);
```
User input is directly rendered, enabling XSS.

#### Fixed Code
```javascript
const express = require('express');
const sanitizeHtml = require('sanitize-html');

const app = express();

app.get('/search', function(req, res) {
    const searchTerm = req.query.q;
    const sanitizedSearchTerm = sanitizeHtml(searchTerm);
    res.send('You searched for: ' + sanitizedSearchTerm);
});
```
`sanitizeHtml()` removes unsafe elements, mitigating XSS.

### Python (Flask)
#### Vulnerable Code
```python
from flask import Flask, request

app = Flask(__name__)

@app.route("/search")
def home():
    query = request.args.get("q")
    return f"You searched for: {query}!"

if __name__ == "__main__":
    app.run(debug=True)
```
User input is not escaped, so XSS is possible.

#### Fixed Code
```python
from flask import Flask, request
from html import escape

app = Flask(__name__)

@app.route("/search")
def home():
    query = request.args.get("q")
    escaped_query = escape(query)
    return f"You searched for: {escaped_query}!"

if __name__ == "__main__":
    app.run(debug=True)
```
`escape()` converts unsafe characters, preventing XSS.

---

## TASK 6: Stored XSS

### PHP
#### Vulnerable Code
```php
// Storing user comment
$comment = $_POST['comment'];
mysqli_query($conn, "INSERT INTO comments (comment) VALUES ('$comment')");

// Displaying user comment
$result = mysqli_query($conn, "SELECT comment FROM comments");
while ($row = mysqli_fetch_assoc($result)) {
    echo $row['comment'];
}
```
User input is stored and displayed without sanitization, allowing stored XSS.

#### Fixed Code
```php
// Storing user comment
$comment = mysqli_real_escape_string($conn, $_POST['comment']);
mysqli_query($conn, "INSERT INTO comments (comment) VALUES ('$comment')");

// Displaying user comment
$result = mysqli_query($conn, "SELECT comment FROM comments");
while ($row = mysqli_fetch_assoc($result)) {
    $sanitizedComment = htmlspecialchars($row['comment']);
    echo $sanitizedComment;
}
```
`htmlspecialchars()` escapes special characters, preventing XSS.

### JavaScript (Node.js)
#### Vulnerable Code
```javascript
app.get('/comments', (req, res) => {
  let html = '<ul>';
  for (const comment of comments) {
    html += `<li>${comment}</li>`;
  }
  html += '</ul>';
  res.send(html);
});
```
Comments are rendered as HTML without sanitization, enabling XSS.

#### Fixed Code
```javascript
const sanitizeHtml = require('sanitize-html');

app.get('/comments', (req, res) => {
  let html = '<ul>';
  for (const comment of comments) {
    const sanitizedComment = sanitizeHtml(comment);
    html += `<li>${sanitizedComment}</li>`;
  }
  html += '</ul>';
  res.send(html);
});
```
`sanitizeHtml()` removes unsafe HTML, mitigating XSS.

---

## TASK 8: DOM-Based XSS

### Vulnerable Static Site
```html
<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable Page</title>
</head>
<body>
    <div id="greeting"></div>
    <script>
        const name = new URLSearchParams(window.location.search).get('name');
        document.write("Hello, " + name);
    </script>
</body>
</html>
```
The page above expects the user to provide their name after `?name=`. If a malicious script is injected, it will execute.

### Fixed Static Site
```html
<!DOCTYPE html>
<html>
<head>
    <title>Secure Page</title>
</head>
<body>
    <div id="greeting"></div>
    <script>
        const name = new URLSearchParams(window.location.search).get('name');
        const escapedName = encodeURIComponent(name);
        document.getElementById("greeting").textContent = "Hello, " + escapedName;
    </script>
</body>
</html>
```
Instead of `document.write()`, escape user input with `encodeURIComponent()` and use `textContent` to prevent XSS.