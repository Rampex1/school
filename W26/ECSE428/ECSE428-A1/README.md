# Complex DC Calculator (cdc)

A reverse Polish notation (RPN) calculator supporting real and complex numbers, built using Test-Driven Development (TDD).

Created by:
David Zhou (261135446)
David Vo (261170038)

## Project Description

This calculator implements a stack-based RPN calculator inspired by the Unix `dc` utility. It supports:
- Real numbers (e.g., `5`, `-2.5`)
- Complex numbers (e.g., `3+j4`, `-1.5-j0.25`, `j5`)
- Operations: PUSH, POP, ADD, SUB, MUL, DIV, DELETE

## Installation

1. Ensure Python 3.7+ is installed
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Tests

Run all unit tests:
```bash
pytest test_cdc.py -v
```

Run CLI tests:
```bash
pytest test_cli.py -v
```

Run all tests:
```bash
pytest -v
```

## Usage

### Command-Line Interface

Basic usage:
```bash
python cdc.py <command> [args] ...
```

### Examples

Push and pop a real number:
```bash
python cdc.py push 5 pop
# Output: 5 + j0
```

Add two numbers:
```bash
python cdc.py push 2 push 5 add pop
# Output: 7 + j0
```

Complex number operations:
```bash
python cdc.py push 3+j4 push 1-j2 add pop
# Output: 4 + j2
```

Multiplication:
```bash
python cdc.py push 1+j2 push 3-j4 mul pop
# Output: 11 + j2
```

Division:
```bash
python cdc.py push 8 push 2 div pop
# Output: 4 + j0
```

Error handling:
```bash
python cdc.py pop
# Output: Error: stack underflow
```

## Supported Commands

- `push <value>` - Push a real or complex number onto the stack
- `pop` - Pop and print the top value
- `add` - Add top two stack values
- `sub` - Subtract top from second value
- `mul` - Multiply top two stack values
- `div` - Divide second value by top value
- `delete` - Remove top value without printing

## Complex Number Format

Input formats accepted:
- `5` (real number)
- `3+j4` (complex, compact)
- `3 + j 4` (complex, with spaces)
- `-2.5-j0.25` (negative components)
- `j5` (pure imaginary)

Output format (canonical):
- `RVAL + jIMAG` (e.g., `3 + j4`)
- `RVAL - jIMAG` (e.g., `3 - j2`)

## Development

This project was built using strict Test-Driven Development (TDD):
1. Write failing test
2. Write minimal code to pass
3. Run full test suite
4. Refactor when green

## Authors

[Your Names]
ECSE 428 - Software Engineering in Practice
McGill University
