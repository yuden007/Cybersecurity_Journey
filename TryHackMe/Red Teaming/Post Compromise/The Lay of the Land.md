# The Lay of the Land

## TASK 3 Network Infrastructure

After gaining initial access, enumerate the compromised machine to understand the target system, services, and network.
Network segmentation is an extra layer of network security, divides networks into subnets for security and management, preventing unauthorized access to assets like customer data.
Virtual Local Area Networks (VLANs) segment networks to control traffic and improve security. Hosts in a VLAN communicate only within it.

### Internal Networks

Internal networks are segmented subnets for sharing information, collaboration, and services within an organization. They control traffic, optimize performance, and enhance security.

### DMZ

A Demilitarized Zone (DMZ) is an edge network between the internet and internal networks, protecting against untrusted traffic. It isolates public services like websites and DNS.

### Network Enumeration

Check networking aspects like ports, connections, routing, and ARP tables.

```powershell
PS C:\Users\thm> netstat -na

Active Connections

Proto  Local Address          Foreign Address        State
TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
TCP    0.0.0.0:88             0.0.0.0:0              LISTENING
TCP    0.0.0.0:135            0.0.0.0:0              LISTENING
TCP    0.0.0.0:389            0.0.0.0:0              LISTENING
```

```powershell
PS C:\Users\thm> arp -a

Interface: 10.10.141.51 --- 0xa
Internet Address      Physical Address      Type
10.10.0.1             02-c8-85-b5-5a-aa     dynamic
10.10.255.255         ff-ff-ff-ff-ff-ff     static
```

### Internal Network Services

Internal services like DNS, web servers, and custom apps are accessible only within the network.
Once inside, they become reachable for communication.

## TASK 4 Active Directory (AD) environment

Active Directory (AD) is a Windows directory service for centralized management of authentication, authorization, and resources.
It stores data on users, computers, printers, etc., including passwords, groups, and permissions.

The AD controller is in a server subnet, with clients in a separate network joining via firewall.

Key AD components include:

- Domain Controllers: Windows servers providing AD services, controlling the domain, encrypting data, and managing access to users, groups, policies, and computers.
- Organizational Units: Hierarchical containers within the AD domain.
- AD objects:
  - Users: A security principal that is allowed to authenticate to machines in the domain.
  - Computers: A special type of user accounts.
  - GPOs: Group Policy Objects, a collections of policies that are applied to other AD objects.
- AD Domains: Collections of Microsoft components in an AD network.
- AD Forest: Collection of trusting domains.
- AD Service Accounts: Built-in local users, Domain users, Managed service accounts
- Domain Administrators: A built-in Active Directory group with full administrative control over the domain.

Enumerating AD post-initial access reveals valuable environment details for lateral movement.

To check if a Windows machine is in an AD environment, use systeminfo:

```powershell
PS C:\Users\thm> systeminfo | findstr Domain
OS Configuration:          Primary Domain Controller
Domain:                    thmdomain.com
```

If the domain is "WORKGROUP", it's a local workgroup, not AD.

## TASK 5 Users and Groups Management

After gaining initial access, enumerate users and groups in the Active Directory (AD) environment to understand accounts, permissions, and roles for lateral movement.

Active Directory (AD) contains various accounts:

- Built-in local users: Manage the system locally, not part of AD.
- Domain user accounts: Use AD services.
- Managed service accounts: Limited domain accounts for AD services.
- Domain Administrators: Full control over AD.

Key AD administrator accounts:

- BUILTIN\Administrator: Local admin on domain controller.
- Domain Admins: Admin access to all domain resources.
- Enterprise Admins: In forest root.
- Schema Admins: Modify domain/forest.
- Server Operators: Manage domain servers.
- Account Operators: Manage non-privileged users.

### Active Directory (AD) Enum

Enumerate AD using PowerShell. Confirm AD membership with systeminfo, then gather user info.

Get all AD users:

```powershell
PS C:\Users\thm> Get-ADUser  -Filter *
DistinguishedName : CN=Administrator,CN=Users,DC=thmredteam,DC=com
Enabled           : True
GivenName         :
Name              : Administrator
ObjectClass       : user
ObjectGUID        : 4094d220-fb71-4de1-b5b2-ba18f6583c65
SamAccountName    : Administrator
SID               : S-1-5-21-1966530601-3185510712-10604624-500
Surname           :
UserPrincipalName :
```

Use SearchBase to specify a DN, like CN=Users:

```powershell
PS C:\Users\thm> Get-ADUser -Filter * -SearchBase "CN=Users,DC=THMREDTEAM,DC=COM"

DistinguishedName : CN=Administrator,CN=Users,DC=thmredteam,DC=com
Enabled           : True
GivenName         :
Name              : Administrator
ObjectClass       : user
ObjectGUID        : 4094d220-fb71-4de1-b5b2-ba18f6583c65
SamAccountName    : Administrator
SID               : S-1-5-21-1966530601-3185510712-10604624-500
Surname           :
UserPrincipalName :
```

## TASK 6 Host Security Solution #1

Before performing further actions, enumerate antivirus and security detection methods on an endpoint to stay undetected.

### Host Security Solutions

- Antivirus software
- Microsoft Windows Defender
- Host-based Firewall
- Security Event Logging and Monitoring
- Host-based Intrusion Detection System (HIDS)/ Host-based Intrusion Prevention System (HIPS)
- Endpoint Detection and Response (EDR)

### Antivirus Software (AV)

Monitors, detects, and prevents malicious software execution. Features include background scanning, full system scans, and virus definitions. Detection techniques:

- Signature-based detection: Compares files to known signatures.
- Heuristic-based detection: Uses machine learning for suspicious properties.
- Behavior-based detection: Monitors execution for abnormal behaviors.

Enumerate AV using wmic:

CMD:

```powershell
PS C:\Users\thm> wmic /namespace:\\root\securitycenter2 path antivirusproduct
```

PowerShell:

```powershell
PS C:\Users\thm> Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct

displayName              : Bitdefender Antivirus
instanceGuid             : {BAF124F4-FA00-8560-3FDE-6C380446AEFB}
pathToSignedProductExe   : C:\Program Files\Bitdefender\Bitdefender Security\wscfix.exe
pathToSignedReportingExe : C:\Program Files\Bitdefender\Bitdefender Security\bdservicehost.exe
productState             : 266240
timestamp                : Wed, 15 Dec 2021 12:40:10 GMT
PSComputerName           :

displayName              : Windows Defender
instanceGuid             : {D58FFC3A-813B-4fae-9E44-DA132C9FAA36}
pathToSignedProductExe   : windowsdefender://
pathToSignedReportingExe : %ProgramFiles%\Windows Defender\MsMpeng.exe
productState             : 393472
timestamp                : Fri, 15 Oct 2021 22:32:01 GMT
PSComputerName           :
```

### Microsoft Windows Defender

Pre-installed, using machine learning and cloud infrastructure. Modes: Active, Passive, Disabled.

Check service state:

```powershell
PS C:\Users\thm> Get-Service WinDefend

Status   Name               DisplayName
------   ----               -----------
Running  WinDefend          Windows Defender Antivirus Service
```

Check status:

```powershell
PS C:\Users\thm> Get-MpComputerStatus | select RealTimeProtectionEnabled

RealTimeProtectionEnabled
-------------------------
                    False
```

### Host-based Firewall

Controls inbound/outbound traffic, analyzing packets and connections.

Check profiles:

```powershell
PS C:\Users\thm> Get-NetFirewallProfile | Format-Table Name, Enabled

Name    Enabled
----    -------
Domain     True
Private    True
Public     True
```

Disable profiles (if admin):

```powershell
PS C:\Windows\system32> Set-NetFirewallProfile -Profile Domain, Public, Private -Enabled False
PS C:\Windows\system32> Get-NetFirewallProfile | Format-Table Name, Enabled
---- -------
Domain False
Private False
Public False
```

Check rules:

```powershell
PS C:\Users\thm> Get-NetFirewallRule | select DisplayName, Enabled, Description

DisplayName                                                                  Enabled
-----------                                                                  -------
Virtual Machine Monitoring (DCOM-In)                                           False
Virtual Machine Monitoring (Echo Request - ICMPv4-In)                          False
Virtual Machine Monitoring (Echo Request - ICMPv6-In)                          False
Virtual Machine Monitoring (NB-Session-In)                                     False
Virtual Machine Monitoring (RPC)                                               False
SNMP Trap Service (UDP In)                                                     False
SNMP Trap Service (UDP In)                                                     False
Connected User Experiences and Telemetry                                        True
Delivery Optimization (TCP-In)                                                  True
```

Test connections:

```powershell
PS C:\Users\thm> Test-NetConnection -ComputerName 127.0.0.1 -Port 80

ComputerName     : 127.0.0.1
RemoteAddress    : 127.0.0.1
RemotePort       : 80
InterfaceAlias   : Loopback Pseudo-Interface 1
SourceAddress    : 127.0.0.1
TcpTestSucceeded : True
```

```powershell
PS C:\Users\thm> (New-Object System.Net.Sockets.TcpClient("127.0.0.1", "80")).Connected
True
```

This confirms port 80 is open and allowed. Test remote targets by specifying -ComputerName.
Note that we can also test for remote targets in the same network or domain names by specifying in the -ComputerName argument for the Test-NetConnection.

## TASK 7 Host Security Solution #2

### Security Event Logging and Monitoring

Operating systems log events in categories like application, system, security, and services. This helps monitor and investigate incidents.

We can list available event logs using Get-EventLog.

```powershell
PS C:\Users\thm> Get-EventLog -List

Max(K) Retain OverflowAction        Entries Log
------ ------ --------------        ------- ---
    512      7 OverwriteOlder             59 Active Directory Web Services
20,480      0 OverwriteAsNeeded         512 Application
    512      0 OverwriteAsNeeded         170 Directory Service
102,400      0 OverwriteAsNeeded          67 DNS Server
20,480      0 OverwriteAsNeeded       4,345 System
15,360      0 OverwriteAsNeeded       1,692 Windows PowerShell
```

### System Monitor (Sysmon)

Sysmon is a Microsoft Sysinternals tool that logs events like process creation, network connections, and file modifications. It helps detect malicious activity.

To detect Sysmon, check for the process:

```powershell
PS C:\Users\thm> Get-Process | Where-Object { $_.ProcessName -eq "Sysmon" }

Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    373      15    20212      31716              3316   0 Sysmon
```

Or check services:

```powershell
PS C:\Users\thm> Get-CimInstance win32_service -Filter "Description = 'System Monitor service'"
# or
Get-Service | where-object {$_.DisplayName -like "*sysm*"}
```

Or check the registry:

```powershell
PS C:\Users\thm> reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WINEVT\Channels\Microsoft-Windows-Sysmon/Operational
```

To find the config file:

```powershell
PS C:\Users\thm> findstr /si '<ProcessCreate onmatch="exclude">' C:\tools\*
C:\tools\Sysmon\sysmonconfig.xml:      
C:\tools\Sysmon\sysmonconfig.xml:
```

### Host-based Intrusion Detection/Prevention System (HIDS/HIPS)

HIDS detects abnormal activities using signature-based or anomaly-based methods. HIPS prevents attacks by auditing logs and monitoring processes.

### Endpoint Detection and Response (EDR)

EDR defends against malware and threats by monitoring endpoints in real-time. Common EDRs include Cylance, Crowdstrike, Symantec, and SentinelOne.

Scripts to enumerate security products:

- Invoke-EDRChecker
- SharpEDRChecker

## TASK 8 Network Security Solutions

Network security solutions are software or hardware appliances that monitor, detect, and prevent malicious activities within the network, protecting clients and devices.

Key solutions include:

- Network Firewall
- SIEM
- IDS/IPS

### Network Firewall

A firewall filters untrusted traffic based on rules and policies, separating networks from external, internal, or application-specific traffic. Types include:

- Packet-filtering firewalls
- Proxy firewalls
- NAT firewalls
- Web application firewalls

### Security Information and Event Management (SIEM)

SIEM combines SIM and SEM to monitor and analyze events in real-time, helping detect threats and vulnerabilities.

Functions include:

- Log management: Captures and gathers data for the entire network.
- Event analytics: Applies analytics to detect abnormal patterns.
- Incident monitoring and security alerts: Monitors network and alerts on attacks.
- Compliance management and reporting: Generates real-time reports.

SIEM detects threats like insider attacks, phishing, DDoS, and data exfiltration using threat intelligence and AI.

Common products:

- Splunk
- LogRhythm NextGen SIEM Platform
- SolarWheels Security Event Manager
- Datadog Security Monitoring
- Many others

### Intrusion Detection System and Intrusion Prevention System (NIDS/NIPS)

Network-based IDS/IPS focus on network security, using sensors and agents to collect data. IDS detects threats requiring human analysis, while IPS automatically accepts or rejects packets.

Common products:

- Palo Alto Networks
- Cisco's Next-Generation
- McAfee Network Security Platform (NSP)
- Trend Micro TippingPoint
- Suricata

## TASK 9 Applications and Services

After initial access, enumerate applications, services, processes, shared resources, and internal services like DNS and web apps to understand the system and identify vulnerabilities or escalation paths.

### Installed Applications

Enumerate installed applications for names, versions, and potential vulnerabilities or credentials.

Use wmic to list applications:

```powershell
PS C:\Users\thm> wmic product get name,version
Name                                                            Version
Microsoft Visual C++ 2019 X64 Minimum Runtime - 14.28.29910     14.28.29910
AWS Tools for Windows                                           3.15.1248
Amazon SSM Agent                                                3.0.529.0
aws-cfn-bootstrap                                               2.0.5
AWS PV Drivers                                                  8.3.4
Microsoft Visual C++ 2019 X64 Additional Runtime - 14.28.29910  14.28.29910
```

Search for hidden files or backups:

```powershell
PS C:\Users\thm> Get-ChildItem -Hidden -Path C:\Users\kkidd\Desktop\
```

### Services and Processes

Enumerate running services and processes for misconfigurations or custom apps that may aid escalation.

List running services:

```powershell
PS C:\Users\thm> net start
These Windows services are started:

Active Directory Web Services
Amazon SSM Agent
Application Host Helper Service
Cryptographic Services
DCOM Server Process Launcher
DFS Namespace
DFS Replication
DHCP Client
Diagnostic Policy Service
THM Demo
DNS Client
```

Get details on a specific service:

```powershell
PS C:\Users\thm> wmic service where "name like 'THM Demo'" get Name,PathName
Name         PathName
THM Service  c:\Windows\thm-demo.exe
```

Check the process:

```powershell
PS C:\Users\thm> Get-Process -Name thm-demo

Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    82       9    13128       6200              3212   0 thm-service
```

Check listening ports:

```powershell
PS C:\Users\thm> netstat -noa |findstr "LISTENING" |findstr "3212"
TCP    0.0.0.0:8080          0.0.0.0:0              LISTENING       3212
TCP    [::]:8080             [::]:0                 LISTENING       3212
```

### Sharing Files and Printers

Enumerate shared resources for misconfigured permissions or information on other systems.

### Internal Services

Enumerate internal services like DNS for environment details.

Perform DNS zone transfer:

```powershell
PS C:\Users\thm> nslookup.exe
Default Server:  UnKnown
Address:  ::1

> server MACHINE_IP
Default Server:  [MACHINE_IP]
Address:  MACHINE_IP

> ls -d thmredteam.com
[[MACHINE_IP]]
thmredteam.com.                SOA    ad.thmredteam.com hostmaster.thmredteam.com. (732 900 600 86400 3600)
thmredteam.com.                A      MACHINE_IP
thmredteam.com.                NS     ad.thmredteam.com
***
ad                             A      MACHINE_IP
```

## Appendix: