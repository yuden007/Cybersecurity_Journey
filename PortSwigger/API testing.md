__________________________________________________________________________________________

Exploiting an API endpoint using documentation:

WEAKNESS:
The server expose and unauthenticate access to interactive API documentation, 

SOLUTION:
Log in to the application using the credentials wiener:peter and update your email address. 
Repeat the PATCH /api/user/wiener request, this retrieves credentials for the user wiener
Repeat the PATCH /api request, this retrives API documentation.
Delete Carlos according to the documentation.

__________________________________________________________________________________________


Exploiting server-side parameter pollution in a query string:

WEAKNESS:
The server expose unauthorized access to sensitive internal field, allowing server-side query manipulation.

OBSERVATION:
Perform password reset as administrator.
Notice the POST /forgot-password request and the related /static/js/forgotPassword.js
Notice that changing the username parameter from administrator to an invalid username receives "Invalid username" message.
Notice that adding a second parameter with a URL-encoded & character, username=administrator%26x=y, returns "Parameter is not supported" message. 
Notice that adding a URL-encoded # character: username=administrator%23, to cut the query string, returns "Field not specified" message. 
Seems the server may include an additional parameter called "field", which has been removed by the # character. 
Add a field parameter with an invalid value to the request. For example, add URL-encoded &field=x#: username=administrator%26field=x%23 , returns "Invalid field" message.
Seems the server-side application may recognize the injected field parameter. 
Brute-force username=administrator%26field=

SOLUTION:
In forgotPassword.js, notice the password reset endpoint, /forgot-password?reset_token=${resetToken}
Replace field's value with  username=administrator%26field=reset_token%23, returns a reset_token.
Access the path /forgot-password?reset_token=123456789, set a new password, admin panel is accessible now.

__________________________________________________________________________________________


Finding and exploiting an unused API endpoint:

WEAKNESS:
The server expose access to PATCH request method. 

SOLUTION:
Notice the GET request for the product. For example, /api/products/1/price. 
Change the HTTP method from GET to OPTIONS then send. The response specifies that GET and PATCH are allowed. 
Change the HTTP method from GET to PATCH then send. Notice that you receive an Unauthorized message.
Login to an account then send again, the response error due to an incorrect Content-Type.
Add a Content-Type header and set the value to application/json. 
Add an empty JSON object {} as the request body then send. Error due to the request body missing a price parameter. 
Add a price parameter with a value 0 then send. Reload the page and you can buy it for 0 dollar.

__________________________________________________________________________________________


Exploiting a mass assignment vulnerability:

WEAKNESS:
The server unauthenticate access to hidden parameter. 

SOLUTION:
Try to buy jacket but no money, pbserve that both the GET and POST API requests for /api/checkout. 
The JSON structure in the GET response includes a chosen_discount parameter, which POST request doesn't. 
Add the chosen_discount with value 100 in POST request then send, you now have 100% discount.

__________________________________________________________________________________________