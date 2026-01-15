# LDAP Injection

## TASK 3 LDAP Search Queries

LDAP search queries are used to locate and retrieve information from LDAP directories. 
Key components include:
    1. Base DN      : Starting point in the directory tree.
    2. Scope        : Depth of the search:
        - base: Search the base DN only.
        - one : Search immediate children of the base DN.
        - sub : Search the base DN and all descendants.
    3. Filter       : Criteria for matching entries.
    4. Attributes   : Specifies which entry details to return.

Basic Syntax:  
    (base DN) (scope) (filter) (attributes)

Filters define conditions for search results. Common operators include:
    - = : Equality
    - =*: Presence (wildcard)
    - >=: Greater than
    - <=: Less than

Examples:
    - (cn=John Doe)                               : Matches entries with cn exactly "John Doe".
    - (cn=J*)                                     : Matches entries where cn starts with "J".
    - (&(objectClass=user)(|(cn=John*)(cn=Jane*))): Matches users with cn starting with "John" or "Jane".

Using ldapsearch:
    When LDAP services are accessible publicly, tools such as ldapsearch, part of the OpenLDAP suite, can be used to interact with the LDAP server. 
    This tool allows a user to query and modify the LDAP directory from the command line, making it a valuable resource for both legitimate administrative tasks and, potentially, for attackers exploiting LDAP Injection vulnerabilities. 
    For example:

```
user@tryhackme$ ldapsearch -x -H ldap://10.80.148.136:389 -b "dc=ldap,dc=thm" "(ou=People)"
# extended LDIF
#
# LDAPv3
# base <dc=ldap,dc=thm> with scope subtree
# filter: (ou=People)
# requesting: ALL
#

# People, ldap.thm
dn: ou=People,dc=ldap,dc=thm
objectClass: organizationalUnit
objectClass: top
ou: People

# search result
search: 2
result: 0 Success

# numResponses: 2
# numEntries: 1
```

    This ldapsearch command queries an LDAP server on port 389, starting at the base DN dc=ldap,dc=thm, and filters entries under the organizational unit "People".

## TASK 5 Exploiting LDAP

Exploiting LDAP
    LDAP Injection lets attackers manipulate LDAP queries, often to bypass authentication.

    Example: A PHP script takes user input and inserts it directly into an LDAP search filter without sanitization, allowing attackers to inject special characters or conditions to always return true and gain unauthorized access.

```
<?php
$username = $_POST['username'];
$password = $_POST['password'];

$ldap_server = "ldap://localhost";
$ldap_dn = "ou=People,dc=ldap,dc=thm";
$admin_dn = "cn=tester,dc=ldap,dc=thm";
$admin_password = "tester"; 

$ldap_conn = ldap_connect($ldap_server);
if (!$ldap_conn) {
    die("Could not connect to LDAP server");
}

ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);

if (!ldap_bind($ldap_conn, $admin_dn, $admin_password)) {
    die("Could not bind to LDAP server with admin credentials");
}

// LDAP search filter
$filter = "(&(uid=$username)(userPassword=$password))";

// Perform the LDAP search
$search_result = ldap_search($ldap_conn, $ldap_dn, $filter);

// Check if the search was successful
if ($search_result) {
    // Retrieve the entries from the search result
    $entries = ldap_get_entries($ldap_conn, $search_result);
    if ($entries['count'] > 0) {
        foreach ($entries as $entry) {
            if (is_array($entry)) {
                if (isset($entry['cn'][0])) {
                    $message = "Welcome, " . $entry['cn'][0] . "!\n";
                }
            }
        }
    } else {
        $error = true;
    }
} else {
    $error = "LDAP search failed\n";
}
?>
```

    This code is vulnerable because it inserts user input directly into the LDAP query without sanitization. 
    Attackers can inject special characters (like *) to make the filter always true, bypassing authentication.

Authentication Bypass Techniques

    Tautology-Based Injection

        Tautology-based injection inserts always-true conditions into LDAP queries, causing them to succeed regardless of input. 
        This exploits unsanitized user input in authentication queries, allowing attackers to bypass login checks.

```
(&(uid={userInput})(userPassword={passwordInput}))
```

        An attacker could provide a tautology-based input, such as *)(|(& for {userInput} and pwd) for {passwordInput}.
        This transforms the query into:

```
(&(uid=*)(|(&)(userPassword=pwd)))
```

        This query bypasses password checking due to logical operators in the filter. It combines two parts with an AND (&) operator:
        1. (uid=*) matches any entry with a uid attribute, so it matches all users.
        2. (|(&)(userPassword=pwd)) uses the OR (|) operator, where:
            - An empty AND ((&)) condition is always true.
            - The other condition checks if userPassword equals pwd, which may fail.
        Since (&) is always true, the OR condition is always true, making the entire filter true. This allows unauthorized access by bypassing password checks.

    Wildcard Injection

        Wildcards (*) are used in LDAP queries to match any sequence of characters, enabling broad searches. 
        When user input containing wildcards is not sanitized, it can lead to unintended query results, such as bypassing authentication by matching multiple or all entries.
        
        For example, if the search query is:

```
(&(uid={userInput})(userPassword={passwordInput}))
```

        An attacker might use a wildcard (*) as input for both `uid` and `userPassword`. 
        Using * for `{userInput}` could force the query to ignore specific usernames and focus on the password. 
        Since a wildcard is also present in `{passwordInput}`, it does not validate the password field against a specific value.
        Instead, the query only checks for the presence of the `userPassword` attribute, regardless of its content. This results in a positive match for any user without verifying the password, effectively bypassing the password-checking mechanism.

Authentication Bypass Example

    To demonstrate a simple LDAP Injection attack, visit a vulnerable application where user input is used to construct an LDAP query without proper sanitization. 
    This allows attackers to manipulate the query.

    An attacker can exploit this by submitting a username and password with unexpected characters, such as an asterisk (*), to bypass authentication checks.

    Injected Username and Password:

```
username=*
password=*
```

    Resulting LDAP Query Component:

```
(&(uid=*)(userPassword=*))
```

    This injection always evaluates the LDAP query's condition to true. Using just the * fetches the first result in the query. 
    To target specific data, an attacker can use a payload like `f*`, which searches for a `uid` starting with the letter `f`.

## TASK 6 Blind LDAP Injection

Blind LDAP Injection exploits vulnerabilities by inferring information based on application behavior, such as error messages or response timings, without direct output.

Example:
    Injected Username and Password:
    - username: a*)(|(&
    - password: pwd)

    URL-encoded Payload:
    - username: a*%29%28%7C%28%26
    - password: pwd%29

    Resulting LDAP Query:
    (&(uid=a*)(|(&)(userPassword=pwd)))

Inference:
    If the application responds with "Something is wrong in your password," it indicates a user with a `uid` starting with "a" exists. 

Next Iteration:
    Injected Username and Password:
    - username: ab*%29%28%7C%28%26
    - password: pwd%29

    Resulting LDAP Query:
    (&(uid=ab*)(|(&)(userPassword=pwd)))

By observing responses, attackers can iteratively guess characters, automating the process to extract full `uid` values.

Techniques:
    Boolean Exploitation: Inject true/false conditions and observe responses.
    Error-Based Inference: Trigger errors to gather clues about the LDAP structure.

Attackers can automate payloads like `ab*)(|(&` to extract full `uid` values.

## TASK 7 Automating the Exploitation

To automate the exfiltration of data in the previous task, you can use the Python script LDAP_exploit.py
The above script iteratively guesses the characters of the email by observing the web application's behaviour in response to crafted input.

## Appendix: