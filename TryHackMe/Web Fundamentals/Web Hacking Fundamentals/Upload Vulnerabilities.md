# Upload Vulnerabilities

__________________________________________________________________________________________


## TASK 5: Remote Code Execution 

Use Gobuster to enumerate directories and files on the target server.
Replace /pathofthewordlist with the path to your wordlist.
    gobuster dir -u [<http://shell.uploadvulns.thm>](<http://shell.uploadvulns.thm>) -w /pathofthewordlist

An important Gobuster switch here is the -x switch, which can be used to look for files with specific extensions. For example, if you added -x php,txt,html to your Gobuster command, the tool would append .php, .txt, and .html to each word in the selected wordlist, one at a time. This can be very useful if you've managed to upload a payload and the server is changing the name of uploaded files.
    gobuster dir -u http://shell.uploadvulns.thm -w /pathofthewordlist -x php,txt,html

__________________________________________________________________________________________


## TASK 7: Bypassing Client-Side filtering

There are four easy ways to bypass your average client-side file upload filter:

    1.  Turn off Javascript in your browser.
        This will work provided the site doesn't require Javascript in order to provide basic functionality. 
        If turning off Javascript completely will prevent the site from working at all then one of the other methods would be more desirable; 
        otherwise, this can be an effective way of completely bypassing the client-side filter.

    2.  Intercept and modify the incoming page. 
        Using Burpsuite, we can intercept the incoming web page and strip out the Javascript filter before it has a chance to run. 
        The process for this will be covered below.

    3.  Intercept and modify the file upload. 
        Where the previous method works before the webpage is loaded, this method allows the web page to load as normal, 
        but intercepts the file upload after it's already passed (and been accepted by the filter). 
        Again, we will cover the process for using this method in the course of the task.

    4.  Send the file directly to the upload point. 
        Why use the webpage with the filter, when you can send the file directly using a tool like curl? 
        Posting the data directly to the page which contains the code for handling the file upload is another effective method for completely bypassing a client side filter. 
        We will not be covering this method in any real depth in this tutorial, however, the syntax for such a command would look something like this: 
            curl -X POST -F "submit:<value>" -F "<file-parameter>:@<path-to-file>" <site>. 
        To use this method you would first aim to intercept a successful upload (using Burpsuite or the browser console) to see the parameters being used in the upload, 
        which can then be slotted into the above command.

### 2. Intercept and modify the incoming page. 

    Suppose we find an upload page on a website. 
    Viewing the source code reveals a Javascript function filtering uploads by MIME type (e.g., image/jpeg). 
    Uploading a JPEG works, but other types are rejected.

    To bypass this, use Burpsuite to intercept the server's response. 
    Right-click the intercepted data, select "Do Intercept > Response to this request," and click "Forward." 
    Modify or delete the Javascript filter in the response before it loads. 
    Continue forwarding until the page loads, allowing unrestricted file uploads.

    For external Javascript files, adjust Burpsuite's "Intercept Client Requests" options to include them.

### 3. Intercept and modify the file upload. 

    Upload a file with a valid extension and MIME type, then intercept and modify the upload using Burpsuite.

    Rename the reverse shell to "shell.jpg" to pass the client-side filter. 
    Intercept the upload request with Burpsuite, change the MIME type to `text/x-php` and the extension to `.php`, 
    then forward the request.

    Access the uploaded file (e.g., `http://demo.uploadvulns.thm/uploads/shell.php`) to trigger the shell, 
    ensuring a netcat listener is active.

__________________________________________________________________________________________


## TASK 8: Bypassing Server-Side Filtering: File Extensions 

A website using a blacklist for file extensions as a server-side filter. 

    The bypass method depends on how the filter is implemented. 
    In real-world scenarios, the code wouldn't be visible, but for this example, it is provided below:

        <?php
            //Get the extension
            $extension = pathinfo($_FILES["fileToUpload"]["name"])["extension"];
            //Check the extension against the blacklist -- .php and .phtml
            switch($extension){
                case "php":
                case "phtml":
                case NULL:
                    $uploadFail = True;
                    break;
                default:
                    $uploadFail = False;
            }
        ?>

    The code checks the last period (.) in the file name to determine the extension. 
    To bypass this, we can use alternative PHP extensions like .php3, .php4, .php5, .php7, .phps, .php-s, .pht, or .phar. 
    While many may bypass the filter, the server might not recognize them as PHP files. 
    Testing reveals that the .phar extension bypasses the filter and executes successfully, providing a shell.

Another example, with a different filter and completely black-box (i.e. without the source code)

    We start by uploading a legitimate file (e.g., spaniel.jpg) to confirm JPEGs are accepted. 
    Next, we try a rejected file (e.g., shell.php). 

    Pseudocode for this kind of filter may look something like this:

        ACCEPT FILE FROM THE USER -- SAVE FILENAME IN VARIABLE userInput
        IF STRING ".jpg" IS IN VARIABLE userInput:
            SAVE THE FILE
        ELSE:
            RETURN ERROR MESSAGE

    After testing various extensions, we find no unfiltered, executable shells.
    If the filter checks for ".jpg" within the filename (e.g., `if ".jpg" in userInput:`), we can bypass it by uploading "shell.jpg.php". 
    The server accepts the file, and navigating to the upload directory confirms the payload is active.

__________________________________________________________________________________________


## TASK 9: Bypassing Server-Side Filtering: Magic Numbers 

Magic numbers are hex strings at the start of files, used to identify file types. 
By comparing these bytes to a whitelist or blacklist, file uploads can be validated. 
This method is effective for PHP-based servers but may fail on others.

Consider an upload page. Uploading `shell.php` results in an error.
But JPEG files are accepted, so add the JPEG magic number (FF D8 FF DB) to the top of shell.php. 
Use a hex editor to modify the file directly, ensuring the magic number replaces the first four bytes. 
Save and upload the modified file to bypass the filter.

Before starting, use the Linux `file` command to verify the shell's file type. 
It should confirm the file is PHP. Keep this in mind as we proceed.
    file shell.php

Add four random characters (e.g., "AAAA") to the first line of the reverse shell script to match the magic number's length.
Save and exit the file. 

Reopen it in a hex editor (e.g., hexeditor on Kali) to view and edit the shell as hex. 
The four bytes in the red box (41) represent the hex code for "A," matching the characters added earlier at the file's top.

Replace the placeholder with the JPEG magic number: FF D8 FF DB
Save and exit the file (Ctrl + x), then use the `file` command to verify the filetype spoofing was successful.

Let's upload the modified shell to test the bypass. 
Success! The server-side magic number filter is bypassed, and we have a reverse shell.

__________________________________________________________________________________________


## TASK 5: Remote Code Execution 

Use Gobuster to enumerate directories and files on the target server.
Replace /pathofthewordlist with the path to your wordlist.
    gobuster dir -u http://10.48.170.32 -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt


An important Gobuster switch here is the -x switch, which can be used to look for files with specific extensions. For example, if you added -x php,txt,html to your Gobuster command, the tool would append .php, .txt, and .html to each word in the selected wordlist, one at a time. This can be very useful if you've managed to upload a payload and the server is changing the name of uploaded files.
    gobuster dir -u http://shell.uploadvulns.thm -w /pathofthewordlist -x php,txt,html

__________________________________________________________________________________________


## Appendix: