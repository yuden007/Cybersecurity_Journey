# Information disclosure

__________________________________________________________________________________________


## Information disclosure in error messages:

### WEAKNESS:
Error messages reveal the vulnerable version of an open-source Java web application framework.

### SOLUTION:
Send a GET request with invalid query input will show the message.

__________________________________________________________________________________________


## Information disclosure on debug page:

### WEAKNESS:
There is a commented debug message, which includes a file location.

### SOLUTION:
Access the file and find the SECRET_KEY.

__________________________________________________________________________________________


## Source code disclosure via backup files:

### WEAKNESS:
The robots.txt file (a standard used to control how search engine crawlers) can be accessed directly.

### SOLUTION:
It shows a /backup directory, inside contains a source code with hard-coded password.

__________________________________________________________________________________________


## Authentication bypass via information disclosure:

### WEAKNESS:
There's an administrator page which the path can be found, and an authentication vulnerability exists.

### SOLUTION:
Try different wordlist to find the path. 
Send a GET request to the correct path, it shows the admin page but features are blocked.
Send a TRACE request shows different response compared to other request method.
It contains an X-Custom-IP-Authorization header with our IP address, was automatically appended to our request. 
Replace the IP address with 127.0.0.1 localhost, put it in our request, and send the request again.
We now can access admin page and its feature.

__________________________________________________________________________________________


## Information disclosure in version control history:

### WEAKNESS:
The path /.git can be browsed.

### SOLUTION:
Download the /.git directory, an admin password can be found in a commit.

__________________________________________________________________________________________


## Appendix:

TRACE: A diagnostic tool that sends a request to a server and asks it to echo back the exact request it received, to help identify how the request is processed along the network path.
- Debugging: See how headers change across proxies.
- Testing: Confirm routing behavior or header injection.
- Security auditing: Detect if sensitive headers (like cookies) are exposed.