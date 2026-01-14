# Prototype Pollution

## TASK 2: Essential Recap

### Classes
Classes in JavaScript are blueprints for creating objects with shared structures and behaviors.

#### Example
```javascript
class UserProfile {
    constructor(name, age, followers, dob) {
        this.name = name;
        this.age = age;
        this.followers = followers;
        this.dob = dob;
    }
}
```

### Prototype
In JavaScript, every object links to a prototype, forming a prototype chain. The prototype acts as a blueprint, enabling objects to inherit properties and methods.

---

## TASK 3: How it Works

Prototype pollution is a vulnerability where an attacker manipulates an object's prototype, affecting all instances of that object. Example:
```javascript
let personPrototype = {
    introduce: function() {
        return `Hi, I'm ${this.name}.`;
    }
};

let ben = Object.create(personPrototype);
ben.name = 'Ben';
```
An attacker can inject malicious content into the `introduce` method for all instances using the `__proto__` property.

---

## TASK 4: Exploitation - XSS

### Standard Approach
Attackers can modify shared properties by controlling parameters like `x` and `val` in expressions like `Person[x][y] = val`.

---

## TASK 8: Mitigation Measures

### Secure Code Developers
- Avoid `__proto__`: Use `Object.getPrototypeOf()` instead.
- Immutable Objects: Design objects to prevent unintended modifications.
- Input Sanitization: Validate user inputs to prevent prototype manipulation.

---

## Appendix

Refer to the TryHackMe room for more details.