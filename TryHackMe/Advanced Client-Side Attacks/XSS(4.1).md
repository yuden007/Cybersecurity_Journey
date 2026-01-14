# TASK 4: Reflected XSS

## PHP
**Vulnerable code:**
```
<?php
$search_query = $_GET['q'];
echo "<p>You searched for: $search_query</p>";
?>
```
This code is vulnerable because user input is output without sanitization, allowing XSS.

**Fixed code:**
```
<?php
$search_query = $_GET['q'];
$escaped_search_query = htmlspecialchars($search_query);
echo "<p>You searched for: $escaped_search_query</p>";
?>
```
Using `htmlspecialchars()` escapes special characters, preventing XSS.

## JavaScript (Node.js)
**Vulnerable code:**
```
const express = require('express');
const app = express();

app.get('/search', function(req, res) {
    var searchTerm = req.query.q;
    res.send('You searched for: ' + searchTerm);
});

app.listen(80);
```
User input is directly rendered, enabling XSS.

**Fixed code:**
```
const express = require('express');
const sanitizeHtml = require('sanitize-html');

const app = express();

app.get('/search', function(req, res) {
    const searchTerm = req.query.q;
    const sanitizedSearchTerm = sanitizeHtml(searchTerm);
    res.send('You searched for: ' + sanitizedSearchTerm);
});

app.listen(80);
```
`sanitizeHtml()` removes unsafe elements, mitigating XSS.

## Python (Flask)
**Vulnerable code:**
```
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

**Fixed code:**
```
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

## ASP.NET
**Vulnerable code:**
```
public void Page_Load(object sender, EventArgs e)
{
    var userInput = Request.QueryString["q"];
    Response.Write("User Input: " + userInput);
}
```
Direct output of user input allows XSS.

**Fixed code:**
```
using System.Web;

public void Page_Load(object sender, EventArgs e)
{
    var userInput = Request.QueryString["q"];
    var encodedInput = HttpUtility.HtmlEncode(userInput);
    Response.Write("User Input: " + encodedInput);
}
```
`HtmlEncode()` encodes special characters, blocking XSS.

---

# TASK 6: Stored XSS

## PHP
**Vulnerable code:**
```
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

**Fixed code:**
```
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

## JavaScript (Node.js)
**Vulnerable code:**
```
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

**Fixed code:**
```
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

## Python (Flask)
**Vulnerable code:**
```
from flask import Flask, request, render_template_string
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)

@app.route('/comment', methods=['POST'])
def add_comment():
    comment_content = request.form['comment']
    comment = Comment(content=comment_content)
    db.session.add(comment)
    db.session.commit()
    return 'Comment added!'

@app.route('/comments')
def show_comments():
    comments = Comment.query.all()
    return render_template_string(''.join(['<div>' + c.content + '</div>' for c in comments]))
```
Comments are displayed without escaping, allowing XSS.

**Fixed code:**
```
from flask import Flask, request, render_template_string
from flask_sqlalchemy import SQLAlchemy
from markupsafe import escape

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)

@app.route('/comment', methods=['POST'])
def add_comment():
    comment_content = request.form['comment']
    comment = Comment(content=comment_content)
    db.session.add(comment)
    db.session.commit()
    return 'Comment added!'

@app.route('/comments')
def show_comments():
    comments = Comment.query.all()
    sanitized_comments = [escape(c.content) for c in comments]
    return render_template_string(''.join(['<div>' + comment + '</div>' for comment in sanitized_comments]))
```
`escape()` converts unsafe characters, preventing XSS.

## ASP.NET
**Vulnerable code:**
```
public void SaveComment(string userComment)
{
    var command = new SqlCommand("INSERT INTO Comments (Comment) VALUES ('" + userComment + "')", connection);
    // Execute the command
}

public void DisplayComments()
{
    var reader = new SqlCommand("SELECT Comment FROM Comments", connection).ExecuteReader();
    while (reader.Read())
    {
        Response.Write(reader["Comment"].ToString());
    }
}
```
User input is output directly, enabling XSS.

**Fixed code:**
```
using System.Web;

public void SaveComment(string userComment)
{
    var command = new SqlCommand("INSERT INTO Comments (Comment) VALUES (@comment)", connection);
    command.Parameters.AddWithValue("@comment", userComment);
}

public void DisplayComments()
{
    var reader = new SqlCommand("SELECT Comment FROM Comments", connection).ExecuteReader();
    while (reader.Read())
    {
        var comment = reader["Comment"].ToString();
        var sanitizedComment = HttpUtility.HtmlEncode(comment);
        Response.Write(sanitizedComment);
    }
    reader.Close();
}
```
`HtmlEncode()` encodes special characters, blocking XSS.

---

# TASK 8: DOM-Based XSS

DOM-based XSS is less common today due to improved browser security, as it occurs entirely on the client side without server interaction. The Document Object Model (DOM) represents a web page as a tree structure, allowing JavaScript to access and modify elements. Understanding the DOM is key to recognizing how DOM-based XSS can occur.

The DOM tree shown above is like the following list with sublists:

```
document
    <!DOCTYPE html>
    html
        head
            title
            meta
            meta
            meta
            style
        body
            div
                h1
                p
                p
                    a
```
The DOM tree starts at document, branching into DOCTYPE and html, which contains head and body. The head includes title, meta tags, and style; the body contains a div with h1 and p elements.

```
let div = document.createElement("div");
let p = document.createElement("p");
div.append(p);

console.log(div.childNodes); // NodeList [ <p> ]
```
The code above creates a div and a p element, then appends the p to the div.

## Vulnerable “Static” Site
DOM-based XSS happens in the browser, not on the server. Attackers inject scripts (e.g., via the URL) that execute on the client side. Here’s a minimal static site example:

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
The page above expects the user to provide their name after ?name=. In the screenshot below:
- The user has entered Web Tester after ?name in the URL.
- The greeting worked as expected and displayed “Hello, Web Tester”.
- Finally, the DOM structure on the right is left intact; the <body> has three direct children.

The user might try to inject a malicious script. In the screenshot below, we see the following:
- The user added `<script>alert("XSS")</script>` instead of only Web Tester as their name.
- The script was executed, and an alert dialogue box was displayed.
- Most importantly, we can see how the DOM tree got a new element. <body> has four children now.

This basic example illustrates a couple of things:
- The server has no direct role in DOM-based vulnerabilities. In this demonstration, everything took place on the client’s browser without using a back end.
- The DOM was insecurely modified using `document.write()`.

## Fixed “Static” Site

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
        // Escape the user input to prevent XSS attacks
        const escapedName = encodeURIComponent(name);
        document.getElementById("greeting").textContent = "Hello, " + escapedName;
    </script>
</body>
</html>
```
Instead of `document.write()`, escape user input with `encodeURIComponent()` and use `textContent`.

The previous attempt does not work now. We can see that:
- The user has added JavaScript as part of their input.
- The JavaScript code is displayed as encoded characters and presents no threat in the current context.
- The DOM structure is no longer affected when the user attempts to add code as part of their submitted name.

---

# Appendix