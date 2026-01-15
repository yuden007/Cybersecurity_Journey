# Access control vulnerabilities

__________________________________________________________________________________________


## LAB: Excessive trust in client-side controls

### WEAKNESS:
Client‑controlled price parameter can be modified

### SOLUTION:
Add a product into cart. Edit the POST request's price. Now can buy it cheap cheap.

__________________________________________________________________________________________


## LAB: High-level logic vulnerability

### WEAKNESS:
Client‑controlled quantity parameter accepts negative values, leading to negative totals.

### SOLUTION:
Add jacket into cart. 
Add another product into cart. Edit the POST request's quantity to negative. 
Make the total to 0 < total < 100, can buy now.

__________________________________________________________________________________________


## LAB: Inconsistent security controls

### WEAKNESS:
Admin access granted based on user‑controlled email domain

### SOLUTION:
The admin email domain was told at register page.
Create an account, change the email to admin email domain. Admin panel accessible.

__________________________________________________________________________________________


## LAB: Flawed enforcement of business rules

### WEAKNESS:
Validation only checks consecutive duplicates, not overall coupon usage.

### SOLUTION:
Get 2 coupon code from top and buttom of home page (sign up newsletter).
Take turn using them repetitive to lower the total to < 100. Then buy.

__________________________________________________________________________________________


## LAB: Low-level logic flaw

### WEAKNESS:
No validation of quantity or total; reliance on limited integer type.

### SOLUTION:
Only at most 2 digit of quantity should be added to cart for a product each time.
Use Burp Intruder to add multiple time, 1 concurrent request at max (easier to stop at desire amount).
The total price eventually exceeded the maximum integer value supported by the backend language, 2,147,483,648.
Afterthat, the total amount starts from -2,147,483,648, keep increasing until it reach a managable negative amount.
Add other products to reach 0 < total < 100. 

__________________________________________________________________________________________


## LAB: Inconsistent handling of exceptional input

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## LAB: Weak isolation on dual-use endpoint

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## LAB: Insufficient workflow validation

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## LAB: Authentication bypass via flawed state machine

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## LAB: Infinite money logic flaw

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## LAB: Authentication bypass via encryption oracle

### WEAKNESS:


### SOLUTION:

__________________________________________________________________________________________


## Appendix: