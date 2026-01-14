# DOM-Based Attacks

## TASK 4: DOM-Based Attacks

DOM-Based Attacks occur when user input is not properly validated or sanitized before being used in JavaScript to modify the DOM. Modern web apps rely heavily on client-side controls, making it essential to secure them to prevent these attacks.

### The Blind Server-Side
DOM-based attacks happen when user input is not properly validated or sanitized before being used in JavaScript to change the DOM. Modern web apps often update the DOM without new server requests, so client-side validation is crucial. If security checks are only server-side, these attacks can bypass them.

### The Source and the Sink
Sources are where user input enters JavaScript; sinks are where that input is used to update the DOM. Without validation between source and sink, DOM-based attacks can occur. Examples:

| Example                                | Source                              | Sink                                |
|----------------------------------------|-------------------------------------|-------------------------------------|
| User clicking a tab on the navigation  | Developer updates the URL with #tab| JavaScript recovers tab info from URL|
| pane                                   | name2 to indicate active tab        | and displays correct tab            |
| User filtering the results of a table  | User input in textbox used to filter| JavaScript uses textbox input to filter|
|                                        | results                             | the dataset                         |

The first example shows how a mouse click updates the URL with a fragment (#), commonly used to indicate page state. JavaScript reads this fragment to restore the user's view. While useful, if not validated, this can allow DOM-based attacks by injecting malicious data into the URL.

### DOM-based Open Redirection
Using the URL fragment (#) for navigation can lead to DOM-based open redirects. Example:

#### Example JavaScript for DOM-based Open Redirection:
```javascript
goto = location.hash.slice(1);
if (goto.startsWith('https:')) {
    location = goto;
}
```
`location.hash` is the source and `location` is the sink. An attacker can use a URL like:
`https://realwebsite.com/#https://attacker.com`
This redirects users to a malicious site because user input is used without validation.