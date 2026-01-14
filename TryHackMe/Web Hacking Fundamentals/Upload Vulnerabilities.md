# Upload Vulnerabilities

---

## TASK 5: Remote Code Execution

### Gobuster
Use Gobuster to enumerate directories and files on the target server.

#### Basic Usage:
```bash
gobuster dir -u http://shell.uploadvulns.thm -w /pathofthewordlist
```

#### Important Switches:
- `-x`: Look for files with specific extensions (e.g., `-x php,txt,html`).

#### Example:
```bash
gobuster dir -u http://shell.uploadvulns.thm -w /pathofthewordlist -x php,txt,html
```

---

## TASK 7: Bypassing Client-Side Filtering

### Methods:
1. **Turn off JavaScript**:
   - Disable JavaScript in your browser to bypass client-side filters.

2. **Intercept and Modify the Incoming Page**:
   - Use Burpsuite to intercept the incoming web page and strip out the JavaScript filter.

3. **Intercept and Modify the File Upload**:
   - Upload a valid file, intercept the request, and modify the MIME type and extension.

4. **Send the File Directly**:
   - Use `curl` to post the file directly to the upload endpoint.
   ```bash
   curl -X POST -F "submit:<value>" -F "<file-parameter>:@<path-to-file>" <site>
   ```

---

## TASK 8: Bypassing Server-Side Filtering: File Extensions

### Example:
A blacklist filter checks for `.php` and `.phtml` extensions. Use alternative extensions like `.php3`, `.php4`, `.php5`, `.php7`, `.phar`.

#### Example Code:
```php
<?php
    $extension = pathinfo($_FILES["fileToUpload"]["name"])["extension"];
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
```

---

## TASK 9: Bypassing Server-Side Filtering: Magic Numbers

### Magic Numbers
Magic numbers are hex strings at the start of files, used to identify file types.

#### Example:
1. Add the JPEG magic number (FF D8 FF DB) to the top of `shell.php` using a hex editor.
2. Save and upload the modified file.
3. Verify the file type using the `file` command:
   ```bash
   file shell.php
   ```

---

## Appendix

### Tools:
- **Burpsuite**: Intercept and modify requests.
- **Gobuster**: Directory and file enumeration.
- **Hex Editor**: Modify file headers.
