# Nmap Advanced Port Scans

## TASK 2: TCP Null Scan, FIN Scan and Xmas Scan

Null Scan  
    A null scan (-sN) sets no flags in the TCP packet. 
    Open ports do not respond, while closed ports send an RST packet. 
    Lack of an RST indicates the port is open or filtered.
           
```
pentester@TryHackMe$ sudo nmap -sN 10.49.173.173

Starting Nmap 7.60 ( https://nmap.org ) at 2021-08-30 10:30 BST
Nmap scan report for 10.49.173.173
Host is up (0.00066s latency).
Not shown: 994 closed ports
PORT    STATE         SERVICE
22/tcp  open|filtered ssh
25/tcp  open|filtered smtp
80/tcp  open|filtered http
110/tcp open|filtered pop3
111/tcp open|filtered rpcbind
143/tcp open|filtered imap
MAC Address: 02:45:BF:8A:2D:6B (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 96.50 seconds
```

FIN Scan
    The FIN scan (-sF) sends a TCP packet with the FIN flag set. 
    Open ports do not respond, while closed ports send an RST. 
    Firewalls may drop traffic silently, making ports appear open|filtered.
   
```
pentester@TryHackMe$ sudo nmap -sF 10.49.173.173

Starting Nmap 7.60 ( https://nmap.org ) at 2021-08-30 10:32 BST
Nmap scan report for 10.49.173.173
Host is up (0.0018s latency).
Not shown: 994 closed ports
PORT    STATE         SERVICE
22/tcp  open|filtered ssh
25/tcp  open|filtered smtp
80/tcp  open|filtered http
110/tcp open|filtered pop3
111/tcp open|filtered rpcbind
143/tcp open|filtered imap
MAC Address: 02:45:BF:8A:2D:6B (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 96.52 seconds
```

Xmas Scan
    The Xmas scan (-sX) sets the FIN, PSH, and URG flags. 
    Open ports do not respond, while closed ports send an RST. 
    Ports are reported as open|filtered if no RST is received.
            
```
pentester@TryHackMe$ sudo nmap -sX 10.49.173.173

Starting Nmap 7.60 ( https://nmap.org ) at 2021-08-30 10:34 BST
Nmap scan report for 10.49.173.173
Host is up (0.00087s latency).
Not shown: 994 closed ports
PORT    STATE         SERVICE
22/tcp  open|filtered ssh
25/tcp  open|filtered smtp
80/tcp  open|filtered http
110/tcp open|filtered pop3
111/tcp open|filtered rpcbind
143/tcp open|filtered imap
MAC Address: 02:45:BF:8A:2D:6B (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 84.85 seconds
```

These scans are effective against stateless firewalls, which detect SYN packets to block connections. 
By avoiding SYN flags, they can bypass such firewalls. 
However, stateful firewalls block these crafted packets, making the scans ineffective.
        
## TASK 3: TCP Maimon Scan

The TCP Maimon scan (-sM) sets the FIN and ACK flags. 
Open ports on certain BSD-derived systems drop the packet, exposing them, while closed ports respond with an RST. 
This scan is rarely effective on modern networks but helps illustrate port scanning techniques. 
Most systems send an RST regardless of port state, making open ports hard to identify.
Since open ports and closed ports are behaving the same way, the Maimon scan could not discover any open ports. 
           
```
pentester@TryHackMe$ sudo nmap -sM 10.10.252.27

Starting Nmap 7.60 ( https://nmap.org ) at 2021-08-30 10:36 BST
Nmap scan report for ip-10-10-252-27.eu-west-1.compute.internal (10.10.252.27)
Host is up (0.00095s latency).
All 1000 scanned ports on ip-10-10-252-27.eu-west-1.compute.internal (10.10.252.27) are closed
MAC Address: 02:45:BF:8A:2D:6B (Unknown)

Nmap done: 1 IP address (1 host up) scanned in 1.61 seconds
```

## Appendix:

Port Scan Type          Example Command
----------------------- ------------------------------------------------------
TCP Null Scan           sudo nmap -sN MACHINE_IP
TCP FIN Scan            sudo nmap -sF MACHINE_IP
TCP Xmas Scan           sudo nmap -sX MACHINE_IP
TCP Maimon Scan         sudo nmap -sM MACHINE_IP
TCP ACK Scan            sudo nmap -sA MACHINE_IP
TCP Window Scan         sudo nmap -sW MACHINE_IP
Custom TCP Scan         sudo nmap --scanflags URGACKPSHRSTSYNFIN MACHINE_IP
Spoofed Source IP       sudo nmap -S SPOOFED_IP MACHINE_IP
Spoofed MAC Address     sudo nmap --spoof-mac SPOOFED_MAC
Decoy Scan              sudo nmap -D DECOY_IP,ME MACHINE_IP
Idle (Zombie) Scan      sudo nmap -sI ZOMBIE_IP MACHINE_IP
Fragment IP (8 bytes)   sudo nmap -f MACHINE_IP
Fragment IP (16 bytes)  sudo nmap -ff MACHINE_IP

Option                 Purpose
---------------------- ------------------------------------------------------
--source-port          Specify source port number
--data-length          Append random data to reach the given length
--reason               Explains how Nmap made its conclusion
-v                     Verbose
-vv                    Very verbose
-d                     Debugging
-dd                    More details for debugging