/**
 * PyBot — Python Learning Assistant
 * script.js — Complete Frontend Logic
 *
 * Sections:
 *   1. Configuration
 *   2. Demo Mode Responses
 *   3. DOM References
 *   4. Application State
 *   5. Theme Management
 *   6. Mobile Menu
 *   7. Smooth Scroll Navigation
 *   8. Chat — Core Functions
 *   9. Chat — Message Rendering
 *  10. Chat — Input Handling
 *  11. Chat — No-History Request
 *  12. Chat — Demo Mode Lookup
 *  13. Chat — Clear Chat
 *  14. Suggestion Chips
 *  15. Initialisation
 *
 * CRITICAL — NO HISTORY GUARANTEE:
 *   Every call to getAnswer() builds its payload from scratch using ONLY:
 *     - The fixed SYSTEM_PROMPT constant
 *     - The current user question string
 *   No previous messages, no conversation array, no session data is ever
 *   included. The displayed chat log is purely visual and is never sent
 *   to the AI provider.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. CONFIGURATION
═══════════════════════════════════════════════════════════════ */

/**
 * Application configuration.
 * To enable real AI responses:
 *   1. Deploy the backend (see /backend/README.md)
 *   2. Set backendUrl to your deployed backend URL
 *   3. Set demoMode to false
 */
const CONFIG = {
  /** Set to your backend URL to enable real AI, e.g. 'https://pybot-api.onrender.com' */
  backendUrl: '',

  /** true = use pre-written demo responses; false = call backendUrl */
  demoMode: true,

  /** Maximum characters allowed in user input */
  maxInputLength: 500,

  /** Milliseconds before a backend request is considered timed out */
  requestTimeout: 15000,
};

/**
 * Fixed system prompt sent with every AI request.
 * This never changes and is the only "context" the AI receives besides
 * the current user question.
 */
const SYSTEM_PROMPT =
  'You are PyBot, a friendly and knowledgeable Python learning assistant. ' +
  'Your job is to help complete beginners learn Python programming. ' +
  'Answer only the current question asked. ' +
  'Do not reference any previous questions or answers — treat every question as independent. ' +
  'Keep answers clear, concise, and beginner-friendly. ' +
  'Use short examples where helpful. Format code in plain text with no markdown symbols.';

/* ═══════════════════════════════════════════════════════════════
   2. KNOWLEDGE BASE
   Large topic-keyed answer bank. Each entry has:
     - keywords: string[] matched against the user question
     - answer:   the full response text
   getDemoResponse() scores every entry and returns the best match.
═══════════════════════════════════════════════════════════════ */
const KNOWLEDGE_BASE = [

  /* ── PYTHON BASICS ──────────────────────────────────────── */
  {
    keywords: ['what is python', 'about python', 'python language', 'python programming', 'python used for', 'why python', 'python intro', 'introduce python'],
    answer: `Python is a high-level, interpreted programming language known for its simple, readable syntax. Created by Guido van Rossum and first released in 1991.

Python is used for:
  - Web development (Django, Flask)
  - Data science and machine learning (NumPy, Pandas, TensorFlow)
  - Automation and scripting
  - Artificial intelligence
  - Game development

Why beginners love Python:
  - Code reads almost like plain English
  - No need to declare variable types
  - Huge, helpful community
  - Free and open source

Example — your first Python program:
  print("Hello, World!")

Python is consistently one of the most popular languages in the world.`
  },

  {
    keywords: ['hello world', 'first program', 'print hello', 'how to print'],
    answer: `The simplest Python program prints text to the screen using the print() function.

  print("Hello, World!")

Output:
  Hello, World!

You can print any text by placing it inside quotes inside print().
You can also print numbers, variables, or expressions:
  print(42)
  print(3 + 5)
  name = "Alice"
  print("Hello, " + name)`
  },

  {
    keywords: ['python interpreter', 'interpreted language', 'compiled vs interpreted', 'how python runs', 'python execution'],
    answer: `Python is an interpreted language, meaning your code is executed line by line by the Python interpreter — it is not compiled into machine code first.

How it works:
  1. You write Python code in a .py file
  2. The Python interpreter reads and executes each line top to bottom
  3. Errors stop execution at the line where they occur

Interpreted vs Compiled:
  - Interpreted (Python): runs directly, easier to test, slower
  - Compiled (C, Java): converts to machine code first, faster to run

Python uses a two-step process internally:
  1. Source code (.py) is compiled to bytecode (.pyc)
  2. The Python Virtual Machine (PVM) runs the bytecode

This is why Python is "interpreted" but still has a compilation step internally.`
  },

  {
    keywords: ['comment', 'comments in python', 'single line comment', 'multiline comment', 'docstring'],
    answer: `Comments in Python are lines the interpreter ignores. They are used to explain code.

Single-line comment — use the # symbol:
  # This is a comment
  x = 5  # This assigns 5 to x

Multi-line comment — use triple quotes (technically a string, but used as a comment):
  """
  This is a
  multi-line comment
  """

Docstrings — used to document functions and classes:
  def greet(name):
      """This function greets a person by name."""
      return "Hello, " + name

Good comments explain WHY the code does something, not just what it does.`
  },

  {
    keywords: ['indentation', 'indent', 'whitespace python', 'python indent rule', 'spaces in python'],
    answer: `Python uses indentation (spaces or tabs) to define code blocks. This is mandatory — unlike most languages that use curly braces {}.

Example:
  if 5 > 3:
      print("Five is greater")   # indented = inside the if block
  print("This always runs")     # not indented = outside the if block

Rules:
  - Use 4 spaces per level (PEP 8 standard)
  - Be consistent — never mix tabs and spaces
  - All lines in the same block must have the same indentation

Wrong (will cause IndentationError):
  if True:
  print("Hello")    # ERROR — missing indentation

Right:
  if True:
      print("Hello")    # Correct`
  },

  /* ── VARIABLES & DATA TYPES ─────────────────────────────── */
  {
    keywords: ['variable', 'variables in python', 'explain variable', 'what is variable', 'declare variable', 'assign variable'],
    answer: `A variable in Python is a named container that stores a value. You create one by assigning a value using the = operator.

Examples:
  name = "Alice"       # string
  age = 25             # integer
  price = 9.99         # float
  is_student = True    # boolean

Rules for variable names:
  - Must start with a letter or underscore
  - Cannot start with a number
  - Can only contain letters, numbers, underscores
  - Case-sensitive: name and Name are different

Python is dynamically typed — you don't declare a type:
  x = 10        # x is an integer
  x = "hello"   # now x is a string — that's fine

Check a variable's type:
  print(type(age))    # <class 'int'>
  print(type(name))   # <class 'str'>`
  },

  {
    keywords: ['data type', 'data types', 'types in python', 'int float string bool', 'python types', 'type of variable'],
    answer: `Python has several built-in data types:

NUMERIC:
  int    — whole numbers:        x = 10
  float  — decimal numbers:     y = 3.14
  complex — complex numbers:    z = 2 + 3j

TEXT:
  str    — string of characters: name = "Alice"

BOOLEAN:
  bool   — True or False:       is_active = True

SEQUENCE:
  list   — ordered, mutable:    fruits = ["apple", "banana"]
  tuple  — ordered, immutable:  point = (3, 4)
  range  — sequence of numbers: r = range(10)

MAPPING:
  dict   — key-value pairs:     person = {"name": "Alice", "age": 25}

SET:
  set    — unordered, unique:   nums = {1, 2, 3}

None:
  NoneType — absence of value:  result = None

Check type: print(type(variable))`
  },

  {
    keywords: ['type casting', 'type conversion', 'convert int to string', 'int()', 'str()', 'float()', 'cast type'],
    answer: `Type casting means converting one data type into another.

Built-in conversion functions:
  int()    — converts to integer
  float()  — converts to float
  str()    — converts to string
  bool()   — converts to boolean
  list()   — converts to list
  tuple()  — converts to tuple

Examples:
  x = int("42")         # string "42" becomes integer 42
  y = float(5)          # integer 5 becomes float 5.0
  z = str(100)          # integer 100 becomes string "100"
  b = bool(0)           # 0 becomes False; anything non-zero is True

Implicit conversion (Python does it automatically):
  result = 5 + 2.0      # int + float = float (2.0)
  print(result)         # 7.0

Use type casting carefully — converting "hello" to int() will raise a ValueError.`
  },

  /* ── STRINGS ────────────────────────────────────────────── */
  {
    keywords: ['string', 'strings in python', 'what is string', 'string type', 'string basics'],
    answer: `A string in Python is a sequence of characters enclosed in single or double quotes.

Creating strings:
  name = "Alice"
  greeting = 'Hello'
  multi = """This is
  a multiline string"""

Common string operations:
  len("hello")          # 5 — length
  "hello"[0]            # "h" — indexing
  "hello"[1:3]          # "el" — slicing
  "hello".upper()       # "HELLO"
  "HELLO".lower()       # "hello"
  "hello".replace("l","r")  # "herro"
  "hello world".split(" ")  # ["hello", "world"]
  " hello ".strip()     # "hello" — removes spaces

Concatenation:
  first = "Hello"
  second = "World"
  print(first + " " + second)   # Hello World

String repetition:
  print("ha" * 3)    # hahaha`
  },

  {
    keywords: ['f-string', 'f string', 'string formatting', 'format string', 'string interpolation', '.format()', 'format()'],
    answer: `Python has three ways to format strings. f-strings (Python 3.6+) are the modern recommended way.

f-string (recommended):
  name = "Alice"
  age = 25
  print(f"My name is {name} and I am {age} years old.")
  # My name is Alice and I am 25 years old.

  You can put any expression inside {}:
  print(f"2 + 2 = {2 + 2}")     # 2 + 2 = 4
  print(f"Pi is {3.14159:.2f}") # Pi is 3.14

.format() method (older style):
  print("My name is {} and I am {} years old.".format(name, age))

% formatting (oldest style, avoid in new code):
  print("My name is %s and I am %d years old." % (name, age))

Use f-strings — they are the clearest and fastest.`
  },

  {
    keywords: ['string method', 'string methods', 'split', 'join', 'strip', 'replace', 'find', 'index', 'upper', 'lower', 'startswith', 'endswith'],
    answer: `Python strings have many built-in methods:

CASE:
  "hello".upper()          # "HELLO"
  "HELLO".lower()          # "hello"
  "hello world".title()    # "Hello World"
  "hello".capitalize()     # "Hello"

SEARCH:
  "hello".find("ll")       # 2 (index) or -1 if not found
  "hello".count("l")       # 2
  "hello".startswith("he") # True
  "hello".endswith("lo")   # True
  "ll" in "hello"          # True

MODIFY:
  " hello ".strip()        # "hello" (removes whitespace)
  " hello ".lstrip()       # "hello " (left only)
  " hello ".rstrip()       # " hello" (right only)
  "hello".replace("l","r") # "herro"

SPLIT / JOIN:
  "a,b,c".split(",")       # ["a", "b", "c"]
  ",".join(["a","b","c"])  # "a,b,c"

CHECK:
  "123".isdigit()          # True
  "abc".isalpha()          # True
  "abc123".isalnum()       # True`
  },

  {
    keywords: ['string slicing', 'slice string', 'string indexing', 'index string', 'negative index'],
    answer: `Strings in Python are sequences, so you can access individual characters or substrings using indexing and slicing.

Indexing (zero-based):
  word = "Python"
  word[0]   # "P"  (first character)
  word[1]   # "y"
  word[-1]  # "n"  (last character)
  word[-2]  # "o"  (second from end)

Slicing — [start:stop:step]:
  word[0:3]   # "Pyt"  (index 0, 1, 2 — stop is excluded)
  word[2:]    # "thon" (from index 2 to end)
  word[:3]    # "Pyt"  (from start to index 2)
  word[::2]   # "Pto"  (every second character)
  word[::-1]  # "nohtyP" (reversed)

Strings are immutable — you cannot do word[0] = "p". Instead create a new string:
  new_word = "p" + word[1:]   # "python"`
  },

  /* ── OPERATORS ──────────────────────────────────────────── */
  {
    keywords: ['operator', 'operators', 'arithmetic operator', 'comparison operator', 'logical operator', 'assignment operator'],
    answer: `Python has several types of operators:

ARITHMETIC:
  +   addition:        5 + 3 = 8
  -   subtraction:     5 - 3 = 2
  *   multiplication:  5 * 3 = 15
  /   division:        5 / 2 = 2.5  (always float)
  //  floor division:  5 // 2 = 2   (rounds down)
  %   modulus:         5 % 2 = 1    (remainder)
  **  exponentiation:  2 ** 3 = 8

COMPARISON (return True or False):
  ==  equal to         !=  not equal to
  >   greater than     <   less than
  >=  greater or equal <= less or equal

LOGICAL:
  and — both must be True
  or  — at least one must be True
  not — reverses True/False

ASSIGNMENT:
  =   assign:    x = 5
  +=  add:       x += 3   same as x = x + 3
  -=  subtract:  x -= 2
  *=  multiply:  x *= 4`
  },

  /* ── CONDITIONS ─────────────────────────────────────────── */
  {
    keywords: ['if else', 'if statement', 'conditional', 'condition', 'elif', 'if elif else', 'branching'],
    answer: `Conditional statements let your program make decisions.

Basic if:
  age = 18
  if age >= 18:
      print("You are an adult")

if-else:
  if age >= 18:
      print("Adult")
  else:
      print("Minor")

if-elif-else (multiple conditions):
  score = 75
  if score >= 90:
      print("A grade")
  elif score >= 80:
      print("B grade")
  elif score >= 70:
      print("C grade")
  else:
      print("Fail")

Ternary (one-line if-else):
  result = "Pass" if score >= 50 else "Fail"

Nested if (if inside if):
  if age >= 18:
      if age >= 65:
          print("Senior adult")
      else:
          print("Regular adult")`
  },

  /* ── LOOPS ──────────────────────────────────────────────── */
  {
    keywords: ['for loop', 'while loop', 'loop', 'loops', 'iterate', 'iteration', 'repeat'],
    answer: `Python has two main loop types.

FOR LOOP — iterates over a sequence:
  for i in range(5):
      print(i)        # 0 1 2 3 4

  for fruit in ["apple", "banana", "cherry"]:
      print(fruit)

  for char in "hello":
      print(char)

WHILE LOOP — runs while a condition is true:
  count = 0
  while count < 5:
      print(count)
      count += 1

LOOP CONTROL:
  break    — exit the loop immediately
  continue — skip current iteration, go to next
  else     — runs when loop completes without break

Example with break:
  for i in range(10):
      if i == 5:
          break
      print(i)    # prints 0 1 2 3 4

Example with continue:
  for i in range(5):
      if i == 2:
          continue
      print(i)    # prints 0 1 3 4`
  },

  {
    keywords: ['range', 'range()', 'range function', 'range in python'],
    answer: `range() generates a sequence of numbers, commonly used in for loops.

range(stop):
  range(5)       # 0, 1, 2, 3, 4

range(start, stop):
  range(2, 7)    # 2, 3, 4, 5, 6

range(start, stop, step):
  range(0, 10, 2)  # 0, 2, 4, 6, 8
  range(10, 0, -1) # 10, 9, 8, 7, 6, 5, 4, 3, 2, 1

Example in a loop:
  for i in range(1, 6):
      print(i)   # 1 2 3 4 5

Convert to list:
  list(range(5))   # [0, 1, 2, 3, 4]

Note: range() is memory-efficient — it doesn't store all numbers at once,
it generates them one at a time as needed.`
  },

  {
    keywords: ['break', 'continue', 'pass', 'break continue pass', 'loop control'],
    answer: `Three keywords control loop behaviour in Python:

BREAK — exits the loop immediately:
  for i in range(10):
      if i == 5:
          break
      print(i)
  # prints 0 1 2 3 4 (stops at 5)

CONTINUE — skips the rest of the current iteration:
  for i in range(5):
      if i == 2:
          continue
      print(i)
  # prints 0 1 3 4 (skips 2)

PASS — does nothing, acts as a placeholder:
  for i in range(5):
      pass    # loop runs but does nothing

  def my_function():
      pass    # empty function — no error

pass is useful when you need a syntactically valid block but don't want any code yet.`
  },

  /* ── FUNCTIONS ──────────────────────────────────────────── */
  {
    keywords: ['function', 'functions', 'def', 'define function', 'what is function', 'return statement', 'create function'],
    answer: `A function is a reusable block of code that performs a specific task.

Define with def:
  def greet(name):
      return "Hello, " + name + "!"

Call it:
  print(greet("Alice"))   # Hello, Alice!

Functions without a return value return None:
  def say_hi():
      print("Hi!")

Parameters and arguments:
  def add(a, b):      # a and b are parameters
      return a + b

  add(3, 4)           # 3 and 4 are arguments

Default parameters:
  def greet(name, greeting="Hello"):
      return f"{greeting}, {name}!"

  greet("Bob")          # "Hello, Bob!"
  greet("Bob", "Hi")    # "Hi, Bob!"

Benefits:
  - Avoid repeating code (DRY principle)
  - Easier to read, test, and debug
  - Break complex problems into smaller pieces`
  },

  {
    keywords: ['args', 'kwargs', '*args', '**kwargs', 'variable arguments', 'arbitrary arguments'],
    answer: `*args and **kwargs let functions accept a variable number of arguments.

*args — accepts any number of positional arguments as a tuple:
  def add(*args):
      return sum(args)

  add(1, 2)        # 3
  add(1, 2, 3, 4)  # 10

**kwargs — accepts any number of keyword arguments as a dictionary:
  def introduce(**kwargs):
      for key, value in kwargs.items():
          print(f"{key}: {value}")

  introduce(name="Alice", age=25, city="Delhi")
  # name: Alice
  # age: 25
  # city: Delhi

Using both together:
  def example(*args, **kwargs):
      print(args)    # tuple of positional args
      print(kwargs)  # dict of keyword args

  example(1, 2, 3, name="Alice", age=25)

The names args and kwargs are just convention — you can use any name after * or **.`
  },

  {
    keywords: ['lambda', 'lambda function', 'anonymous function', 'lambda expression'],
    answer: `A lambda is a small, anonymous (unnamed) function written in one line.

Syntax:
  lambda arguments: expression

Examples:
  square = lambda x: x ** 2
  print(square(5))    # 25

  add = lambda a, b: a + b
  print(add(3, 4))    # 7

Lambda with no arguments:
  greet = lambda: "Hello!"
  print(greet())    # Hello!

Common use — sorting with a key:
  names = ["Charlie", "Alice", "Bob"]
  names.sort(key=lambda name: len(name))
  print(names)    # ['Bob', 'Alice', 'Charlie']

Lambda vs regular function:
  # These are equivalent:
  square = lambda x: x ** 2
  
  def square(x):
      return x ** 2

Use lambda for short, simple functions. Use def for anything more complex.`
  },

  {
    keywords: ['scope', 'global', 'local', 'local variable', 'global variable', 'scope in python', 'global keyword'],
    answer: `Scope determines where a variable can be accessed.

LOCAL scope — variable defined inside a function:
  def my_func():
      x = 10       # local — only exists inside my_func
      print(x)

  my_func()
  print(x)    # ERROR — x does not exist outside the function

GLOBAL scope — variable defined outside all functions:
  x = 10       # global

  def my_func():
      print(x)  # can READ a global variable

  my_func()    # 10

Modifying a global variable inside a function needs the global keyword:
  count = 0

  def increment():
      global count
      count += 1

  increment()
  print(count)    # 1

Best practice: avoid global variables when possible. Pass values as parameters and return results instead.`
  },

  {
    keywords: ['recursion', 'recursive', 'recursive function', 'recursion in python'],
    answer: `Recursion is when a function calls itself to solve a smaller version of the same problem.

Classic example — factorial:
  def factorial(n):
      if n == 0 or n == 1:   # base case — stops recursion
          return 1
      return n * factorial(n - 1)   # recursive call

  print(factorial(5))   # 120 (5 * 4 * 3 * 2 * 1)

Example — counting down:
  def countdown(n):
      if n <= 0:
          print("Done!")
          return
      print(n)
      countdown(n - 1)

  countdown(3)   # prints 3, 2, 1, Done!

Every recursive function needs:
  1. A BASE CASE — the condition that stops recursion
  2. A RECURSIVE CASE — calling itself with a simpler input

Warning: Without a base case, recursion continues forever and causes a RecursionError.
Python's default recursion limit is 1000 calls.`
  },

  /* ── LISTS ──────────────────────────────────────────────── */
  {
    keywords: ['list', 'lists', 'what is list', 'list in python', 'list methods', 'append', 'remove', 'pop', 'insert'],
    answer: `A list is an ordered, mutable collection of items.

Create a list:
  fruits = ["apple", "banana", "cherry"]
  numbers = [1, 2, 3, 4, 5]
  mixed = [1, "hello", True, 3.14]
  empty = []

Access items (zero-indexed):
  fruits[0]    # "apple"
  fruits[-1]   # "cherry" (last item)

Slicing:
  fruits[1:3]  # ["banana", "cherry"]

Common methods:
  fruits.append("date")        # add to end
  fruits.insert(1, "avocado")  # insert at index 1
  fruits.remove("banana")      # remove first occurrence
  fruits.pop()                 # remove and return last item
  fruits.pop(0)                # remove and return item at index 0
  fruits.sort()                # sort in place
  fruits.reverse()             # reverse in place
  len(fruits)                  # number of items
  "apple" in fruits            # True — check membership
  fruits.count("apple")        # count occurrences
  fruits.index("cherry")       # find index`
  },

  {
    keywords: ['list comprehension', 'list comp', 'comprehension'],
    answer: `List comprehension is a concise way to create lists in one line.

Basic syntax:
  [expression for item in iterable]

Example:
  squares = [x ** 2 for x in range(1, 6)]
  print(squares)   # [1, 4, 9, 16, 25]

With a condition (filter):
  evens = [x for x in range(10) if x % 2 == 0]
  print(evens)    # [0, 2, 4, 6, 8]

Equivalent traditional loop:
  evens = []
  for x in range(10):
      if x % 2 == 0:
          evens.append(x)

With transformation:
  names = ["alice", "bob", "charlie"]
  upper = [name.upper() for name in names]
  print(upper)    # ["ALICE", "BOB", "CHARLIE"]

Nested list comprehension:
  matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
  # [[1,2,3], [2,4,6], [3,6,9]]

List comprehensions are faster and more Pythonic than equivalent loops.`
  },

  /* ── TUPLES ─────────────────────────────────────────────── */
  {
    keywords: ['tuple', 'tuples', 'what is tuple', 'tuple vs list', 'list vs tuple', 'difference between list and tuple'],
    answer: `A tuple is an ordered, immutable collection of items.

Create a tuple:
  point = (3, 4)
  colors = ("red", "green", "blue")
  single = (42,)      # single-item tuple needs a trailing comma
  empty = ()

Access items (same as list):
  colors[0]    # "red"
  colors[-1]   # "blue"
  colors[0:2]  # ("red", "green")

Key difference from list:
  my_list = [1, 2, 3]
  my_list[0] = 99      # Works — lists are mutable

  my_tuple = (1, 2, 3)
  my_tuple[0] = 99     # TypeError — tuples are immutable

When to use tuples:
  - Data that should not change (coordinates, RGB values, settings)
  - Dictionary keys (lists cannot be keys, tuples can)
  - Returning multiple values from a function

  def min_max(nums):
      return min(nums), max(nums)   # returns a tuple

  low, high = min_max([3, 1, 5, 2])   # tuple unpacking`
  },

  /* ── DICTIONARIES ───────────────────────────────────────── */
  {
    keywords: ['dictionary', 'dict', 'dictionaries', 'key value', 'what is dictionary', 'dict methods'],
    answer: `A dictionary stores data as key-value pairs. Keys must be unique and immutable.

Create a dictionary:
  person = {"name": "Alice", "age": 25, "city": "Delhi"}
  empty = {}

Access values:
  person["name"]         # "Alice"
  person.get("age")      # 25
  person.get("phone", "N/A")  # "N/A" — default if key missing

Add or update:
  person["email"] = "alice@example.com"   # add new key
  person["age"] = 26                      # update existing key

Remove:
  del person["city"]          # remove key
  person.pop("age")           # remove and return value

Useful methods:
  person.keys()     # all keys
  person.values()   # all values
  person.items()    # all key-value pairs as tuples

Loop through:
  for key, value in person.items():
      print(f"{key}: {value}")

Check key exists:
  "name" in person    # True`
  },

  /* ── SETS ───────────────────────────────────────────────── */
  {
    keywords: ['set', 'sets', 'what is set', 'set in python', 'set methods', 'set operations'],
    answer: `A set is an unordered collection of unique items. Duplicates are automatically removed.

Create a set:
  fruits = {"apple", "banana", "cherry"}
  nums = {1, 2, 2, 3, 3, 3}   # duplicates removed → {1, 2, 3}
  empty_set = set()            # NOT {} — that creates an empty dict

Key properties:
  - Unordered (no index access)
  - No duplicates
  - Mutable (can add/remove items)

Common operations:
  fruits.add("date")           # add one item
  fruits.remove("banana")      # remove (raises error if missing)
  fruits.discard("banana")     # remove (no error if missing)
  len(fruits)                  # number of items
  "apple" in fruits            # True

Set math operations:
  a = {1, 2, 3, 4}
  b = {3, 4, 5, 6}

  a | b   # union:        {1, 2, 3, 4, 5, 6}
  a & b   # intersection: {3, 4}
  a - b   # difference:   {1, 2}
  a ^ b   # symmetric diff: {1, 2, 5, 6}

Great for removing duplicates from a list:
  unique = list(set([1, 2, 2, 3, 3]))   # [1, 2, 3]`
  },

  /* ── MUTABLE vs IMMUTABLE ───────────────────────────────── */
  {
    keywords: ['mutable', 'immutable', 'mutable immutable', 'mutable vs immutable', 'mutability'],
    answer: `In Python, every value is an object. Objects are either mutable or immutable.

MUTABLE — can be changed after creation:
  list, dict, set

  my_list = [1, 2, 3]
  my_list.append(4)    # the list is now [1, 2, 3, 4]
  my_list[0] = 99      # change an element — works

IMMUTABLE — cannot be changed after creation:
  int, float, str, tuple, bool, frozenset

  my_string = "hello"
  my_string[0] = "H"   # TypeError — strings cannot be modified

  Instead, create a new string:
  my_string = "H" + my_string[1:]   # "Hello"

Why it matters:
  1. Mutable objects passed to functions can be modified inside the function
  2. Immutable objects cannot be used as dictionary keys; tuples can
  3. Immutable objects are inherently thread-safe

Quick test: if object[0] = x works — it's mutable. If it raises a TypeError — immutable.`
  },

  /* ── OOP ────────────────────────────────────────────────── */
  {
    keywords: ['class', 'classes', 'oop', 'object oriented', 'object', 'objects', 'what is class'],
    answer: `A class is a blueprint for creating objects. Python is an object-oriented language.

Define a class:
  class Dog:
      def __init__(self, name, breed):  # constructor
          self.name = name
          self.breed = breed

      def bark(self):                   # method
          return f"{self.name} says Woof!"

Create objects (instances):
  my_dog = Dog("Buddy", "Labrador")
  print(my_dog.name)       # Buddy
  print(my_dog.bark())     # Buddy says Woof!

Key concepts:
  - class: the blueprint
  - object: an instance of a class
  - __init__: constructor, called when object is created
  - self: refers to the current object
  - attribute: data stored on an object (self.name)
  - method: function defined inside a class

Multiple objects from the same class:
  dog1 = Dog("Buddy", "Labrador")
  dog2 = Dog("Max", "Poodle")
  # Each has its own name and breed`
  },

  {
    keywords: ['inheritance', 'inherit', 'parent class', 'child class', 'base class', 'derived class', 'super()'],
    answer: `Inheritance lets a class reuse code from another class.

Parent class:
  class Animal:
      def __init__(self, name):
          self.name = name

      def speak(self):
          return "Some sound"

Child class (inherits from Animal):
  class Dog(Animal):
      def speak(self):           # override parent method
          return f"{self.name} says Woof!"

  class Cat(Animal):
      def speak(self):
          return f"{self.name} says Meow!"

Using super() to call the parent's __init__:
  class Dog(Animal):
      def __init__(self, name, breed):
          super().__init__(name)   # call Animal's __init__
          self.breed = breed

Creating objects:
  d = Dog("Buddy", "Labrador")
  c = Cat("Whiskers")
  print(d.speak())   # Buddy says Woof!
  print(c.speak())   # Whiskers says Meow!

Benefits: code reuse, extensibility, clean hierarchy.`
  },

  {
    keywords: ['encapsulation', 'encapsulate', 'private', '__private', '_protected'],
    answer: `Encapsulation means restricting direct access to an object's data and providing controlled access through methods.

Python uses naming conventions (not strict enforcement):
  - public:    name      (accessible anywhere)
  - protected: _name     (convention: don't use outside class/subclass)
  - private:  __name     (name mangling — harder to access from outside)

Example:
  class BankAccount:
      def __init__(self, balance):
          self.__balance = balance    # private

      def deposit(self, amount):
          if amount > 0:
              self.__balance += amount

      def get_balance(self):
          return self.__balance       # controlled access

  account = BankAccount(1000)
  account.deposit(500)
  print(account.get_balance())    # 1500
  print(account.__balance)        # AttributeError — private

Why encapsulation matters:
  - Protects data from unintended modification
  - Provides a clean, controlled interface
  - Easier to maintain and modify internals without breaking outside code`
  },

  {
    keywords: ['polymorphism', 'polymorphic'],
    answer: `Polymorphism means "many forms" — the same method name behaves differently for different objects.

Example with method overriding:
  class Shape:
      def area(self):
          return 0

  class Circle(Shape):
      def __init__(self, radius):
          self.radius = radius
      def area(self):
          return 3.14 * self.radius ** 2

  class Rectangle(Shape):
      def __init__(self, w, h):
          self.width = w
          self.height = h
      def area(self):
          return self.width * self.height

Using polymorphism:
  shapes = [Circle(5), Rectangle(4, 6)]
  for shape in shapes:
      print(shape.area())
  # 78.5
  # 24

The same area() call works differently depending on the object's actual type.

Duck typing in Python:
  "If it walks like a duck and quacks like a duck, it's a duck."
  Python checks if an object has the method/attribute, not its type.`
  },

  {
    keywords: ['__init__', 'constructor', '__str__', '__repr__', 'dunder', 'magic method', 'special method'],
    answer: `Dunder (double underscore) methods are special methods Python calls automatically.

__init__ — called when an object is created:
  class Person:
      def __init__(self, name):
          self.name = name

__str__ — defines the string representation (for print()):
  def __str__(self):
      return f"Person: {self.name}"

  p = Person("Alice")
  print(p)    # Person: Alice

__repr__ — defines the developer representation:
  def __repr__(self):
      return f"Person(name={self.name!r})"

__len__ — defines behavior for len():
  def __len__(self):
      return len(self.name)

__eq__ — defines == comparison:
  def __eq__(self, other):
      return self.name == other.name

__add__ — defines + operator:
  def __add__(self, other):
      return Person(self.name + " " + other.name)

These let you make custom objects behave like built-in Python types.`
  },

  /* ── EXCEPTION HANDLING ─────────────────────────────────── */
  {
    keywords: ['exception', 'exceptions', 'error handling', 'try except', 'try catch', 'raise', 'finally'],
    answer: `Exceptions are errors that occur during execution. try-except lets you handle them gracefully.

Basic try-except:
  try:
      x = int("hello")   # ValueError
  except ValueError:
      print("That is not a number!")

Multiple except blocks:
  try:
      result = 10 / 0
  except ZeroDivisionError:
      print("Cannot divide by zero!")
  except TypeError:
      print("Wrong type!")
  except Exception as e:
      print(f"Unexpected error: {e}")

else — runs only if no exception occurred:
  try:
      result = 10 / 2
  except ZeroDivisionError:
      print("Error!")
  else:
      print(f"Result: {result}")   # runs here

finally — always runs, even if exception occurred:
  try:
      f = open("file.txt")
  except FileNotFoundError:
      print("File not found")
  finally:
      print("This always runs")

Raising exceptions:
  if age < 0:
      raise ValueError("Age cannot be negative")`
  },

  {
    keywords: ['common error', 'common errors', 'syntaxerror', 'nameerror', 'typeerror', 'valueerror', 'indexerror', 'keyerror', 'attributeerror', 'error types', 'python errors'],
    answer: `Common Python errors and what they mean:

SyntaxError — code is not valid Python:
  print("hello"    # missing closing parenthesis

NameError — using a variable before assigning it:
  print(x)    # x was never defined

TypeError — wrong type for an operation:
  "hello" + 5    # can't add string and int

ValueError — right type but wrong value:
  int("hello")    # "hello" can't be converted to int

IndexError — accessing a list index that doesn't exist:
  my_list = [1, 2, 3]
  my_list[5]    # only indices 0, 1, 2 exist

KeyError — accessing a dictionary key that doesn't exist:
  d = {"name": "Alice"}
  d["age"]    # "age" key not in dict

AttributeError — calling a method that doesn't exist:
  "hello".append("!")    # strings have no append()

ZeroDivisionError — dividing by zero:
  10 / 0

FileNotFoundError — opening a file that doesn't exist:
  open("missing.txt")

ImportError — importing a module that doesn't exist:
  import nonexistent_module`
  },

  /* ── FILE HANDLING ──────────────────────────────────────── */
  {
    keywords: ['file', 'file handling', 'open file', 'read file', 'write file', 'with open', 'file operations'],
    answer: `Python can read from and write to files using the open() function.

Open and read a file:
  with open("file.txt", "r") as f:
      content = f.read()   # entire file as a string

  with open("file.txt", "r") as f:
      lines = f.readlines()   # list of lines

  with open("file.txt", "r") as f:
      for line in f:          # iterate line by line
          print(line.strip())

Write to a file:
  with open("file.txt", "w") as f:   # "w" creates or overwrites
      f.write("Hello, World!\n")

Append to a file:
  with open("file.txt", "a") as f:   # "a" adds to end
      f.write("New line\n")

File modes:
  "r"  — read (default)
  "w"  — write (creates or overwrites)
  "a"  — append
  "rb" — read binary
  "wb" — write binary

Using with open() is best practice — it automatically closes the file even if an error occurs.`
  },

  /* ── MODULES & IMPORTS ──────────────────────────────────── */
  {
    keywords: ['import', 'module', 'modules', 'import module', 'from import', 'python module', 'standard library'],
    answer: `A module is a file containing Python code that you can reuse.

Import a whole module:
  import math
  print(math.pi)          # 3.14159...
  print(math.sqrt(16))    # 4.0

Import specific items:
  from math import pi, sqrt
  print(pi)       # 3.14159...
  print(sqrt(9))  # 3.0

Import with alias:
  import math as m
  print(m.pi)

  import numpy as np   # common convention

Useful standard library modules:
  math     — mathematical functions
  random   — random numbers
  os       — operating system interface
  sys      — system-specific parameters
  datetime — dates and times
  json     — JSON encoding/decoding
  re       — regular expressions
  time     — time functions
  collections — extra data structures

Create your own module — just save code in a .py file:
  # mymodule.py
  def greet(name):
      return "Hello, " + name

  # main.py
  import mymodule
  print(mymodule.greet("Alice"))`
  },

  /* ── COMPREHENSIONS & BUILT-INS ─────────────────────────── */
  {
    keywords: ['map', 'filter', 'reduce', 'map filter', 'map()', 'filter()'],
    answer: `map(), filter(), and reduce() are functional programming tools.

map() — apply a function to every item:
  numbers = [1, 2, 3, 4, 5]
  squared = list(map(lambda x: x**2, numbers))
  print(squared)    # [1, 4, 9, 16, 25]

filter() — keep only items where function returns True:
  numbers = [1, 2, 3, 4, 5, 6]
  evens = list(filter(lambda x: x % 2 == 0, numbers))
  print(evens)    # [2, 4, 6]

reduce() — reduce a sequence to a single value (from functools):
  from functools import reduce
  total = reduce(lambda a, b: a + b, [1, 2, 3, 4, 5])
  print(total)    # 15

Modern Python prefers list comprehensions over map/filter:
  # map equivalent:
  squared = [x**2 for x in numbers]

  # filter equivalent:
  evens = [x for x in numbers if x % 2 == 0]

Use whichever is clearer — comprehensions are usually more readable.`
  },

  {
    keywords: ['zip', 'enumerate', 'zip()', 'enumerate()', 'zip enumerate'],
    answer: `zip() and enumerate() are useful built-in functions for loops.

enumerate() — adds a counter to an iterable:
  fruits = ["apple", "banana", "cherry"]
  for index, fruit in enumerate(fruits):
      print(f"{index}: {fruit}")
  # 0: apple
  # 1: banana
  # 2: cherry

  # Start counting from 1:
  for index, fruit in enumerate(fruits, start=1):
      print(f"{index}: {fruit}")

zip() — combines two or more iterables element by element:
  names = ["Alice", "Bob", "Charlie"]
  scores = [95, 87, 92]

  for name, score in zip(names, scores):
      print(f"{name}: {score}")
  # Alice: 95
  # Bob: 87
  # Charlie: 92

  # Create a dictionary from two lists:
  student_scores = dict(zip(names, scores))
  print(student_scores)
  # {"Alice": 95, "Bob": 87, "Charlie": 92}

zip() stops at the shortest iterable.`
  },

  {
    keywords: ['sorted', 'sort', 'sort list', 'sort dictionary', 'sorted()', 'key parameter', 'reverse sort'],
    answer: `Python has two ways to sort: sorted() and .sort()

sorted() — returns a NEW sorted list (original unchanged):
  nums = [3, 1, 4, 1, 5, 9]
  new_list = sorted(nums)
  print(new_list)  # [1, 1, 3, 4, 5, 9]
  print(nums)      # [3, 1, 4, 1, 5, 9] — unchanged

.sort() — sorts the list IN PLACE (modifies original):
  nums.sort()
  print(nums)   # [1, 1, 3, 4, 5, 9] — modified

Reverse order:
  sorted(nums, reverse=True)   # [9, 5, 4, 3, 1, 1]
  nums.sort(reverse=True)

Sort by custom key:
  words = ["banana", "apple", "cherry", "fig"]
  sorted(words, key=len)       # by length: ["fig", "apple", "banana", "cherry"]
  sorted(words, key=str.lower) # case-insensitive

Sort list of dictionaries:
  students = [{"name": "Alice", "gpa": 3.8}, {"name": "Bob", "gpa": 3.5}]
  sorted(students, key=lambda s: s["gpa"], reverse=True)
  # Alice first (higher GPA)`
  },

  /* ── INTERVIEW TOPICS ───────────────────────────────────── */
  {
    keywords: ['decorator', 'decorators', '@decorator', 'function decorator'],
    answer: `A decorator is a function that wraps another function to add extra behaviour.

Basic decorator:
  def my_decorator(func):
      def wrapper():
          print("Before the function")
          func()
          print("After the function")
      return wrapper

  @my_decorator
  def say_hello():
      print("Hello!")

  say_hello()
  # Before the function
  # Hello!
  # After the function

Using @my_decorator is the same as: say_hello = my_decorator(say_hello)

Decorator with arguments:
  def my_decorator(func):
      def wrapper(*args, **kwargs):
          print("Before")
          result = func(*args, **kwargs)
          print("After")
          return result
      return wrapper

  @my_decorator
  def add(a, b):
      return a + b

  add(3, 4)   # Before, After, returns 7

Common built-in decorators:
  @staticmethod — method that doesn't use self or cls
  @classmethod  — method that receives the class as first argument
  @property     — access a method like an attribute`
  },

  {
    keywords: ['generator', 'generators', 'yield', 'yield keyword', 'generator function', 'lazy evaluation'],
    answer: `A generator is a special function that yields values one at a time, saving memory.

Regular function — builds entire list in memory:
  def get_squares(n):
      return [x**2 for x in range(n)]

Generator function — yields one value at a time:
  def gen_squares(n):
      for x in range(n):
          yield x**2     # yield instead of return

  g = gen_squares(5)
  print(next(g))   # 1
  print(next(g))   # 4
  print(next(g))   # 9

  for square in gen_squares(5):
      print(square)   # 1 4 9 16 25

Generator expression (like list comprehension but lazy):
  gen = (x**2 for x in range(5))   # note: () not []

Benefits:
  - Memory efficient — only generates one value at a time
  - Great for large datasets or infinite sequences
  - Pauses execution at each yield

Infinite generator:
  def count_up():
      n = 0
      while True:
          yield n
          n += 1`
  },

  {
    keywords: ['gil', 'global interpreter lock', 'threading', 'multiprocessing', 'concurrency', 'parallel'],
    answer: `The GIL (Global Interpreter Lock) is a mutex that allows only one thread to execute Python bytecode at a time.

Why it exists:
  CPython (the main Python interpreter) uses reference counting for memory management.
  The GIL protects reference counts from race conditions in multi-threaded code.

Impact:
  - CPU-bound tasks (math, loops): threading does NOT speed things up due to GIL
  - I/O-bound tasks (network, file): threading DOES help (GIL released during I/O)

Solutions:
  - multiprocessing: uses separate processes, each has its own GIL → true parallelism
  - asyncio: asynchronous I/O without threads
  - Jython / PyPy: alternative Python implementations without GIL

Example with multiprocessing:
  from multiprocessing import Pool

  def square(n):
      return n ** 2

  with Pool(4) as p:
      results = p.map(square, range(10))
  print(results)   # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

The GIL is one of the most common Python interview topics.`
  },

  {
    keywords: ['list vs tuple vs set vs dict', 'when to use list', 'when to use tuple', 'when to use set', 'when to use dict', 'collection comparison'],
    answer: `Choosing the right collection type:

LIST [1, 2, 3]:
  - Ordered, indexed, allows duplicates
  - Mutable (can add, remove, change)
  - Use when: order matters and you need to modify the collection
  - Example: shopping cart, to-do list

TUPLE (1, 2, 3):
  - Ordered, indexed, allows duplicates
  - Immutable (cannot change after creation)
  - Use when: data should not change, or as dictionary keys
  - Example: (latitude, longitude), RGB color (255, 0, 0)

SET {1, 2, 3}:
  - Unordered, no duplicates, no indexing
  - Mutable
  - Use when: uniqueness matters, or you need set operations (union, intersection)
  - Example: unique visitors, removing duplicates

DICT {"key": "value"}:
  - Key-value pairs, ordered (Python 3.7+), keys unique
  - Mutable
  - Use when: you need fast lookups by name/id
  - Example: user profiles, configuration settings

Quick reference:
  - Need order + duplicates? → list or tuple
  - Need to be unchangeable? → tuple
  - Need uniqueness? → set
  - Need labelled data? → dict`
  },

  {
    keywords: ['shallow copy', 'deep copy', 'copy', 'copy module', 'clone list'],
    answer: `When copying mutable objects, Python has two types of copies.

Assignment — NOT a copy, both point to the same object:
  a = [1, 2, 3]
  b = a          # b IS a
  b.append(4)
  print(a)       # [1, 2, 3, 4] — a changed too!

Shallow copy — copies the outer object, inner objects still shared:
  import copy
  a = [[1, 2], [3, 4]]
  b = copy.copy(a)    # or a.copy() or a[:]
  b[0].append(99)
  print(a)    # [[1, 2, 99], [3, 4]] — inner list still shared!

Deep copy — copies everything recursively:
  b = copy.deepcopy(a)
  b[0].append(99)
  print(a)    # [[1, 2], [3, 4]] — completely independent!

Simple rule:
  - Flat lists (no nested objects): shallow copy is fine
  - Nested structures: use deepcopy`
  },

  {
    keywords: ['*args **kwargs difference', 'positional argument', 'keyword argument', 'argument vs parameter'],
    answer: `Parameters and arguments in Python:

Parameter — the variable in the function definition:
  def greet(name):   # "name" is a parameter
      print(name)

Argument — the value passed when calling the function:
  greet("Alice")     # "Alice" is an argument

Types of arguments:

POSITIONAL — matched by position:
  def add(a, b):
      return a + b
  add(3, 4)    # a=3, b=4

KEYWORD — matched by name:
  add(b=4, a=3)    # same result, any order

DEFAULT — has a fallback value:
  def greet(name, greeting="Hello"):
      return f"{greeting}, {name}"

*ARGS — any number of positional arguments (becomes a tuple):
  def total(*nums):
      return sum(nums)
  total(1, 2, 3, 4)   # 10

**KWARGS — any number of keyword arguments (becomes a dict):
  def info(**details):
      for k, v in details.items():
          print(f"{k}: {v}")
  info(name="Alice", age=25)`
  },

  /* ── COMPREHENSIONS & FUNCTIONAL ───────────────────────── */
  {
    keywords: ['dict comprehension', 'set comprehension', 'dictionary comprehension'],
    answer: `Just like list comprehensions, you can create dicts and sets in one line.

Dict comprehension:
  {key_expr: value_expr for item in iterable}

  squares = {x: x**2 for x in range(1, 6)}
  print(squares)
  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

  With condition:
  even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

  Invert a dictionary:
  original = {"a": 1, "b": 2, "c": 3}
  inverted = {v: k for k, v in original.items()}
  # {1: "a", 2: "b", 3: "c"}

Set comprehension:
  {expr for item in iterable}

  unique_lengths = {len(word) for word in ["apple", "fig", "banana", "kiwi"]}
  # {3, 4, 5, 6}

These are faster and more readable than equivalent for loops.`
  },

  /* ── BUILT-IN FUNCTIONS ─────────────────────────────────── */
  {
    keywords: ['len', 'len()', 'type()', 'id()', 'input()', 'print()', 'range()', 'built-in function', 'built in function', 'useful functions'],
    answer: `Python's most useful built-in functions:

INPUT / OUTPUT:
  print("Hello")              # display output
  name = input("Enter name: ") # get user input (returns string)

TYPE & CONVERSION:
  type(x)        # returns the type of x
  int("42")      # convert to integer
  float("3.14")  # convert to float
  str(100)       # convert to string
  bool(0)        # convert to boolean

SEQUENCES:
  len([1,2,3])        # 3 — length
  range(1, 6)         # sequence 1..5
  list(range(5))      # [0, 1, 2, 3, 4]
  sorted([3,1,2])     # [1, 2, 3]
  reversed([1,2,3])   # iterator in reverse
  enumerate(lst)      # adds counter
  zip(lst1, lst2)     # pairs elements

MATH:
  abs(-5)       # 5 — absolute value
  round(3.567, 2) # 3.57
  min(1,2,3)    # 1
  max(1,2,3)    # 3
  sum([1,2,3])  # 6
  pow(2,8)      # 256

OBJECT INFO:
  isinstance(x, int)   # check type
  id(x)               # memory address
  dir(x)              # list all attributes/methods
  help(str)           # documentation`
  },

];

/* ═══════════════════════════════════════════════════════════════
   FALLBACK response when no keyword match is found
═══════════════════════════════════════════════════════════════ */
const DEMO_FALLBACK = `I don't have a pre-written answer for that specific question in my knowledge base.

Here are the Python topics I can answer right now:
  - Python basics (what is Python, print, comments, indentation)
  - Variables and data types (int, float, str, bool)
  - Strings (slicing, methods, f-strings, formatting)
  - Operators (arithmetic, comparison, logical)
  - Conditions (if, elif, else)
  - Loops (for, while, break, continue, range)
  - Functions (def, return, *args, **kwargs, lambda, scope, recursion)
  - Lists, Tuples, Sets, Dictionaries
  - Mutable vs Immutable
  - OOP (class, objects, inheritance, encapsulation, polymorphism, dunder methods)
  - Exception handling (try, except, finally, raise)
  - File handling (open, read, write)
  - Modules and imports
  - List/dict/set comprehensions
  - Decorators, Generators, GIL
  - Built-in functions (map, filter, sorted, zip, enumerate, etc.)

Try rephrasing your question or click one of the suggested questions below!`;

/* ═══════════════════════════════════════════════════════════════
   3. DOM REFERENCES
   All getElementById / querySelector calls in one place.
   Never use innerHTML with user-provided content.
═══════════════════════════════════════════════════════════════ */
const DOM = {
  body:           document.body,
  themeToggle:    document.getElementById('themeToggle'),
  mobileMenuBtn:  document.getElementById('mobileMenuBtn'),
  mobileMenu:     document.getElementById('mobileMenu'),
  chatMessages:   document.getElementById('chatMessages'),
  chatForm:       document.getElementById('chatForm'),
  questionInput:  document.getElementById('questionInput'),
  sendBtn:        document.getElementById('sendBtn'),
  clearChatBtn:   document.getElementById('clearChatBtn'),
  inputError:     document.getElementById('inputError'),
  demoBanner:     document.getElementById('demoBanner'),
  suggestionChips: document.querySelectorAll('.suggestion-chip'),
  mobileNavLinks:  document.querySelectorAll('.mobile-nav-link'),
};

/* ═══════════════════════════════════════════════════════════════
   4. APPLICATION STATE
═══════════════════════════════════════════════════════════════ */
const state = {
  /** True while a request is in progress — prevents duplicate submissions */
  isLoading: false,

  /** Reference to the loading message element currently in the DOM */
  loadingElement: null,
};

/* ═══════════════════════════════════════════════════════════════
   5. THEME MANAGEMENT
═══════════════════════════════════════════════════════════════ */

/** Apply a theme by toggling the class on <body> and saving to localStorage */
function applyTheme(theme) {
  DOM.body.classList.remove('light-theme', 'dark-theme');
  DOM.body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  DOM.themeToggle.setAttribute('aria-label', label);

  try {
    localStorage.setItem('pybot-theme', theme);
  } catch (_) {
    // localStorage unavailable (private mode) — silently ignore
  }
}

/** Toggle between light and dark */
function toggleTheme() {
  const isDark = DOM.body.classList.contains('dark-theme');
  applyTheme(isDark ? 'light' : 'dark');
}

/** Load saved theme on startup, defaulting to light */
function initTheme() {
  let saved = 'light';
  try {
    saved = localStorage.getItem('pybot-theme') || 'light';
  } catch (_) { /* ignore */ }
  applyTheme(saved);
}

/* ═══════════════════════════════════════════════════════════════
   6. MOBILE MENU
═══════════════════════════════════════════════════════════════ */

function toggleMobileMenu() {
  const isOpen = !DOM.mobileMenu.hidden;
  DOM.mobileMenu.hidden = isOpen;
  DOM.mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
  DOM.mobileMenuBtn.setAttribute(
    'aria-label',
    isOpen ? 'Open navigation menu' : 'Close navigation menu'
  );
}

function closeMobileMenu() {
  DOM.mobileMenu.hidden = true;
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  DOM.mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
}

/* ═══════════════════════════════════════════════════════════════
   7. SMOOTH SCROLL NAVIGATION
═══════════════════════════════════════════════════════════════ */

/**
 * Handle anchor clicks. Closes the mobile menu and scrolls to target.
 * Uses the native CSS scroll-behavior: smooth defined in style.css.
 */
function handleNavClick(e) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    closeMobileMenu();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ═══════════════════════════════════════════════════════════════
   8. CHAT — CORE FUNCTIONS
═══════════════════════════════════════════════════════════════ */

/** Format a Date object as HH:MM AM/PM */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Show the welcome message when the chat area is empty */
function showWelcomeMessage() {
  const div = document.createElement('div');
  div.className = 'welcome-message';
  div.setAttribute('aria-label', 'Welcome to PyBot');

  const icon = document.createElement('span');
  icon.className = 'welcome-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '🐍';

  const title = document.createElement('p');
  title.className = 'welcome-title';
  title.textContent = 'Welcome to PyBot!';

  const text = document.createElement('p');
  text.className = 'welcome-text';
  text.textContent =
    'Ask any Python question below, or click one of the suggested topics to get started. ' +
    'Every question is answered independently — no history, no context, just clear answers.';

  div.appendChild(icon);
  div.appendChild(title);
  div.appendChild(text);
  DOM.chatMessages.appendChild(div);
}

/** Scroll the messages container to the bottom */
function scrollToBottom() {
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

/* ═══════════════════════════════════════════════════════════════
   9. CHAT — MESSAGE RENDERING
   Uses textContent / createElement throughout — never innerHTML
   with user-provided data.
═══════════════════════════════════════════════════════════════ */

/**
 * Append a user message bubble to the chat.
 * @param {string} text — the user's question (treated as plain text)
 */
function appendUserMessage(text) {
  // Remove welcome message if it is still showing
  const welcome = DOM.chatMessages.querySelector('.welcome-message');
  if (welcome) welcome.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'message message-user';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text; // safe — textContent never executes scripts

  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.setAttribute('aria-label', 'Sent at ' + formatTime(new Date()));
  meta.textContent = formatTime(new Date());

  wrapper.appendChild(bubble);
  wrapper.appendChild(meta);
  DOM.chatMessages.appendChild(wrapper);
  scrollToBottom();
}

/**
 * Show a typing/loading indicator while waiting for a response.
 * Stores the element reference in state.loadingElement so it can be removed.
 */
function showLoadingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'loading-message';
  wrapper.setAttribute('aria-label', 'PyBot is thinking');
  wrapper.setAttribute('role', 'status');

  const bubble = document.createElement('div');
  bubble.className = 'loading-bubble';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'loading-dot';
    dot.setAttribute('aria-hidden', 'true');
    bubble.appendChild(dot);
  }

  wrapper.appendChild(bubble);
  DOM.chatMessages.appendChild(wrapper);
  state.loadingElement = wrapper;
  scrollToBottom();
}

/** Remove the loading indicator from the DOM */
function removeLoadingIndicator() {
  if (state.loadingElement && state.loadingElement.parentNode) {
    state.loadingElement.remove();
  }
  state.loadingElement = null;
}

/**
 * Append a bot response bubble to the chat.
 * @param {string} text      — the answer text
 * @param {boolean} isError  — true to apply the error style
 */
function appendBotMessage(text, isError = false) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message message-bot' + (isError ? ' message-error' : '');

  // Bot header (avatar + name)
  const header = document.createElement('div');
  header.className = 'bot-header';

  const avatar = document.createElement('div');
  avatar.className = 'bot-msg-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = '🐍';

  const name = document.createElement('span');
  name.className = 'bot-msg-name';
  name.textContent = isError ? 'PyBot — Error' : 'PyBot';

  header.appendChild(avatar);
  header.appendChild(name);

  // Message bubble — textContent for the answer (safe)
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.setAttribute('aria-label', 'Received at ' + formatTime(new Date()));
  meta.textContent = formatTime(new Date());

  wrapper.appendChild(header);
  wrapper.appendChild(bubble);
  wrapper.appendChild(meta);
  DOM.chatMessages.appendChild(wrapper);
  scrollToBottom();
}

/* ═══════════════════════════════════════════════════════════════
   10. CHAT — INPUT HANDLING
═══════════════════════════════════════════════════════════════ */

/** Show an error below the input field */
function showInputError(message) {
  DOM.inputError.textContent = message;
  DOM.inputError.hidden = false;
  DOM.questionInput.setAttribute('aria-invalid', 'true');
}

/** Clear the input error */
function clearInputError() {
  DOM.inputError.textContent = '';
  DOM.inputError.hidden = true;
  DOM.questionInput.removeAttribute('aria-invalid');
}

/** Disable the send button and input during a request */
function setLoadingState(loading) {
  state.isLoading = loading;
  DOM.sendBtn.disabled = loading;
  DOM.questionInput.disabled = loading;
  DOM.sendBtn.setAttribute('aria-busy', String(loading));
}

/**
 * Main form submit handler.
 * Validates input, then routes to demo mode or real backend.
 * CRITICAL: builds request payload fresh every time — no history appended.
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  clearInputError();

  // Guard: prevent duplicate submissions
  if (state.isLoading) return;

  const rawInput = DOM.questionInput.value;
  const question = rawInput.trim();

  // Validate — reject empty / whitespace-only
  if (!question) {
    showInputError('Please enter a question before sending.');
    DOM.questionInput.focus();
    return;
  }

  // Validate — reject over-long input
  if (question.length > CONFIG.maxInputLength) {
    showInputError(
      `Question is too long (${question.length}/${CONFIG.maxInputLength} characters). Please shorten it.`
    );
    DOM.questionInput.focus();
    return;
  }

  // Clear input immediately after capture
  DOM.questionInput.value = '';

  // Render user message
  appendUserMessage(question);

  // Show loading
  setLoadingState(true);
  showLoadingIndicator();

  try {
    let answer;

    if (CONFIG.demoMode || !CONFIG.backendUrl) {
      // ── DEMO MODE ──────────────────────────────────────────
      // Simulate a short delay so the loading indicator is visible
      await sleep(600 + Math.random() * 500);
      answer = getDemoResponse(question);
    } else {
      // ── REAL BACKEND ───────────────────────────────────────
      // CRITICAL: payload contains ONLY the current question.
      // No previous messages. No conversation history.
      answer = await callBackend(question);
    }

    removeLoadingIndicator();
    appendBotMessage(answer);

  } catch (err) {
    removeLoadingIndicator();
    const errorText =
      'Sorry, something went wrong while fetching an answer. ' +
      'Please try again. (Details: ' + (err.message || 'Unknown error') + ')';
    appendBotMessage(errorText, /* isError */ true);
  } finally {
    setLoadingState(false);
    DOM.questionInput.focus();
  }
}

/** Promise-based sleep helper */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ═══════════════════════════════════════════════════════════════
   11. CHAT — NO-HISTORY BACKEND REQUEST
   This function is the enforcement point of the no-history rule.
   It ONLY sends system prompt + current question. Nothing else.
═══════════════════════════════════════════════════════════════ */

/**
 * Send the current question to the backend and return the answer string.
 *
 * REQUEST PAYLOAD (always and only):
 *   { "question": "<current question>" }
 *
 * The backend is responsible for prepending SYSTEM_PROMPT before calling
 * the AI provider. No conversation array. No session ID. No history.
 *
 * @param {string} question — the current user question
 * @returns {Promise<string>} — the AI answer
 */
async function callBackend(question) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

  let response;
  try {
    response = await fetch(CONFIG.backendUrl + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // CRITICAL: Only the current question is sent.
      // Never append previous messages here.
      body: JSON.stringify({ question: question }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw new Error('Could not reach the backend. Is it running?');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    // Parse error body safely
    let errorMsg = 'Server returned status ' + response.status;
    try {
      const errData = await response.json();
      if (errData && typeof errData.error === 'string') {
        errorMsg = errData.error;
      }
    } catch (_) { /* ignore parse errors */ }
    throw new Error(errorMsg);
  }

  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error('Backend returned an invalid response.');
  }

  if (!data || typeof data.answer !== 'string' || !data.answer.trim()) {
    throw new Error('Backend returned an empty or unexpected response.');
  }

  return data.answer;
}

/* ═══════════════════════════════════════════════════════════════
   12. CHAT — KNOWLEDGE BASE LOOKUP
   Scores every entry in KNOWLEDGE_BASE against the user question
   using keyword matching. Returns the best-scoring answer.
   Does not call any external service.
═══════════════════════════════════════════════════════════════ */

/**
 * Score a single KNOWLEDGE_BASE entry against the normalised question.
 * Returns a number — higher is a better match.
 * @param {string[]} keywords
 * @param {string} q  — lowercase, trimmed question
 * @returns {number}
 */
function scoreEntry(keywords, q) {
  let score = 0;
  for (const kw of keywords) {
    if (q.includes(kw)) {
      // Longer keyword matches score higher (more specific)
      score += kw.length;
    }
  }
  return score;
}

/**
 * Look up the best answer from the KNOWLEDGE_BASE for any question.
 * @param {string} question — raw user input
 * @returns {string}
 */
function getDemoResponse(question) {
  const q = question.toLowerCase().trim();

  let bestScore = 0;
  let bestAnswer = null;

  for (const entry of KNOWLEDGE_BASE) {
    const s = scoreEntry(entry.keywords, q);
    if (s > bestScore) {
      bestScore = s;
      bestAnswer = entry.answer;
    }
  }

  // Require a minimum score so we don't return weak matches
  if (bestScore >= 3 && bestAnswer) {
    return bestAnswer;
  }

  return DEMO_FALLBACK;
}

/* ═══════════════════════════════════════════════════════════════
   13. CHAT — CLEAR CHAT
═══════════════════════════════════════════════════════════════ */

/**
 * Clear all messages from the chat area and reset the input.
 * This only affects the visible UI — there is nothing stored
 * to delete because no conversation data is ever persisted.
 */
function clearChat() {
  // Cancel any in-flight request guard
  if (state.isLoading) return;

  // Remove all child nodes from the messages container
  while (DOM.chatMessages.firstChild) {
    DOM.chatMessages.removeChild(DOM.chatMessages.firstChild);
  }

  // Reset loading element reference
  state.loadingElement = null;

  // Clear and reset input
  DOM.questionInput.value = '';
  clearInputError();

  // Restore welcome message
  showWelcomeMessage();

  // Return focus to input
  DOM.questionInput.focus();
}

/* ═══════════════════════════════════════════════════════════════
   14. SUGGESTION CHIPS
═══════════════════════════════════════════════════════════════ */

/**
 * Handle a suggestion chip click.
 * Populates the input with the question and auto-submits.
 * @param {Event} e
 */
function handleSuggestionClick(e) {
  if (state.isLoading) return;

  const question = e.currentTarget.dataset.question;
  if (!question) return;

  DOM.questionInput.value = question;
  clearInputError();

  // Scroll to chat section first, then submit
  const chatSection = document.getElementById('chat');
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Small delay to let scroll happen before submission renders messages
    setTimeout(() => {
      DOM.chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 300);
  } else {
    DOM.chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

/* ═══════════════════════════════════════════════════════════════
   15. INITIALISATION
═══════════════════════════════════════════════════════════════ */

function init() {
  // ── Theme ──────────────────────────────────────────────────
  initTheme();
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // ── Mobile Menu ────────────────────────────────────────────
  DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a nav link is clicked
  DOM.mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !DOM.mobileMenu.hidden &&
      !DOM.mobileMenu.contains(e.target) &&
      !DOM.mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // ── Smooth Scroll Navigation ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', handleNavClick);
  });

  // ── Chat Form ──────────────────────────────────────────────
  DOM.chatForm.addEventListener('submit', handleFormSubmit);

  // ── Clear Chat Button ──────────────────────────────────────
  DOM.clearChatBtn.addEventListener('click', clearChat);

  // ── Suggestion Chips ───────────────────────────────────────
  DOM.suggestionChips.forEach((chip) => {
    chip.addEventListener('click', handleSuggestionClick);
  });

  // ── Input — clear error on typing ─────────────────────────
  DOM.questionInput.addEventListener('input', () => {
    if (DOM.inputError && !DOM.inputError.hidden) {
      clearInputError();
    }
  });

  // ── Demo Banner Visibility ─────────────────────────────────
  // Show banner only in demo mode; hide it when real backend is configured
  if (!CONFIG.demoMode && CONFIG.backendUrl) {
    if (DOM.demoBanner) DOM.demoBanner.hidden = true;
  }

  // ── Welcome Message ────────────────────────────────────────
  showWelcomeMessage();

  // ── Navbar scroll effect ───────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  // ── Log mode to console (non-sensitive, informational only) ─
  if (CONFIG.demoMode || !CONFIG.backendUrl) {
    console.info(
      '%c PyBot Demo Mode ',
      'background: #667eea; color: white; border-radius: 4px; padding: 2px 8px; font-weight: bold;',
      '\nUsing pre-written demo responses. No AI API is called.',
      '\nTo enable real AI: set CONFIG.backendUrl and CONFIG.demoMode = false in script.js',
      '\n\nNo-history guarantee: each request sends ONLY the current question.',
    );
  } else {
    console.info(
      '%c PyBot Live Mode ',
      'background: #48bb78; color: white; border-radius: 4px; padding: 2px 8px; font-weight: bold;',
      '\nBackend:', CONFIG.backendUrl,
      '\nNo-history guarantee active — each request sends ONLY the current question.',
    );
  }
}

// ── Boot ───────────────────────────────────────────────────────
// Wait for DOM to be fully parsed before initialising
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
