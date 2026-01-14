# ORM Injection

---

## TASK 2: Understanding ORM

ORM (Object-Relational Mapping) connects object-oriented programming languages with relational databases. Benefits include:

- Reducing repetitive code by generating SQL automatically.
- Allowing developers to focus on business logic instead of database details.
- Ensuring consistent database operations.
- Making database schema changes easier to manage.

Popular ORM Frameworks:

- **Doctrine (PHP)**: Flexible ORM for PHP, often used with Symfony.
- **Hibernate (Java)**: Robust ORM for Java with features like caching and lazy loading.
- **SQLAlchemy (Python)**: Versatile ORM for Python, combining raw SQL and ORM benefits.
- **Entity Framework (C#)**: Microsoft's ORM for .NET, simplifying data access.
- **Active Record (Ruby on Rails)**: Default ORM for Rails, mapping tables to classes and rows to objects.

---

## TASK 3: How ORM Works

Example code demonstrating ORM methods:

```php
use App\Models\User;

// Retrieve a user by ID
$user = User::find(1);

// Retrieve all users
$allUsers = User::all();

// Retrieve users by specific criteria
$admins = User::where('email', 'admin@example.com')->get();
```

---

## TASK 4: Identifying ORM Injection

### Techniques for Testing ORM Injection

- **Manual Review**: Look for raw query methods and string concatenation that include user input (e.g., `whereRaw()`).
- **Automated Scanning**: Run security scanners that detect dynamic query construction patterns.
- **Input Fuzzing**: Inject special characters/keywords into inputs to see if queries change.
- **Error Probing**: Send malformed input to elicit detailed errors revealing query structure.

### Common Frameworks and Risky ORM Methods

| Framework       | ORM Library    | Common Risky Methods       |
|-----------------|----------------|----------------------------|
| Laravel         | Eloquent       | `whereRaw()`, `DB::raw()`  |
| Ruby on Rails   | Active Record  | `where("name = '#{input}'")` |
| Django          | Django ORM     | `extra()`, `raw()`         |
| Spring          | Hibernate      | `createQuery()` with concatenation |
| Node.js         | Sequelize      | `sequelize.query()`        |

---

## TASK 6: ORM Injection - Vulnerable Implementation

Access the machine at:

```url
https://10-80-162-23.reverse-proxy.cell-prod-eu-west-1a.vm.tryhackme.com/query_users?sort=name
```

This endpoint sorts users by the `name` column:

```sql
SELECT * FROM users ORDER BY name ASC LIMIT 2
```

Injection Attempt:

```url
https://10-80-162-23.reverse-proxy.cell-prod-eu-west-1a.vm.tryhackme.com/query_users?sort=name'
```

Exploitation:

```url
https://10-80-162-23.reverse-proxy.cell-prod-eu-west-1a.vm.tryhackme.com/query_users?sort=name-%3E%22%27))%20LIMIT%2010%23
```

---

## TASK 7: Best Practices

### Input Validation

- Validate user inputs on both client and server sides to ensure they meet expected formats and lengths.
- Use regular expressions and built-in validation tools.

### Parameterised Queries

- Use prepared statements to prevent user inputs from being executed as code.
- Avoid directly concatenating inputs into SQL queries.

### ORM Usage

- Leverage ORM tools for database interactions, ensuring proper configuration and secure handling of inputs.
- Parameterise any custom SQL queries.

### Escaping and Sanitisation

- Remove or escape special characters in user inputs to prevent injection attacks.

### Allowlist Input

- Accept only specific, expected values and reject all others for stronger security.

---