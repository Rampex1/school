import sys

# David Zhou (261135446)
# David Vo (261170038)


class ComplexCalculator:
    def __init__(self):
        self.stack = []

    def push(self, value):
        # Parse complex numbers by replacing 'j' notation
        # Remove spaces for parsing
        value_str = value.replace(" ", "")

        if value_str.startswith("j"):
            value_str = "0+" + value_str
        elif value_str.startswith("-j"):
            value_str = "0" + value_str

        try:
            # Try direct conversion (works for formats like "3+4j")
            value_str = value_str.replace("j", "j")  # Already uses j
            num = complex(value_str)
        except ValueError:
            # Manual parsing for "3+j4" format
            value_str = value.replace(" ", "")

            # Find 'j' and rearrange
            if "j" in value_str:
                # Replace +j or -j with +1j or -1j if no number after j
                import re

                # Handle cases like "3+j4" -> "3+4j"
                value_str = re.sub(r"([+-]?)j(\d+\.?\d*)", r"\g<1>\2j", value_str)
                # Handle cases like "3+j" or "j" -> "3+1j" or "1j"
                value_str = re.sub(r"([+-])j(?!\d)", r"\g<1>1j", value_str)
                value_str = re.sub(r"^j(?!\d)", "1j", value_str)
                num = complex(value_str)
            else:
                num = complex(float(value_str), 0)

        self.stack.append(num)

    def _format_complex(self, value):
        """Helper: Format complex number as 'RVAL + jIMAG' or 'RVAL - jIMAG'"""
        real = value.real
        imag = value.imag

        # Remove .0 for integers
        real_str = str(int(real)) if real == int(real) else str(real)
        imag_str = (
            str(int(abs(imag))) if abs(imag) == int(abs(imag)) else str(abs(imag))
        )

        if imag >= 0:
            return f"{real_str} + j{imag_str}"
        else:
            return f"{real_str} - j{imag_str}"

    def _pop_two(self):
        """Helper: Pop two values from stack for binary operations.
        Returns (a, b, error) where a is second-from-top, b is top.
        If error, returns (None, None, error_message)."""
        if len(self.stack) < 2:
            return None, None, "Error: stack underflow"
        b = self.stack.pop()
        a = self.stack.pop()
        return a, b, None

    def _pop_one(self):
        """Helper: Pop one value from stack for unary operations.
        Returns (value, error). If error, returns (None, error_message)."""
        if len(self.stack) < 1:
            return None, "Error: stack underflow"
        return self.stack.pop(), None

    def pop(self):
        value, error = self._pop_one()
        if error:
            return error
        return self._format_complex(value)

    def add(self):
        """Add top two stack values"""
        a, b, error = self._pop_two()
        if error:
            return error
        self.stack.append(a + b)

    def sub(self):
        """Subtract top stack value from second value"""
        a, b, error = self._pop_two()
        if error:
            return error
        self.stack.append(a - b)

    def mul(self):
        """Multiply top two stack values"""
        a, b, error = self._pop_two()
        if error:
            return error
        self.stack.append(a * b)

    def div(self):
        """Divide second stack value by top value"""
        a, b, error = self._pop_two()
        if error:
            return error

        # Check for division by zero
        if b == 0:
            return "Error: division by zero"

        self.stack.append(a / b)

    def delete(self):
        """Delete (remove) top stack value without returning it"""
        _, error = self._pop_one()
        if error:
            return error


def main():
    """Command-line interface for the calculator"""
    if len(sys.argv) < 2:
        print("Usage: python cdc.py <command> [args] ...")
        print("Commands: push <value>, pop, add, sub, mul, div, delete")
        sys.exit(1)

    calc = ComplexCalculator()
    args = sys.argv[1:]
    i = 0

    while i < len(args):
        cmd = args[i].lower()

        if cmd == "push":
            if i + 1 >= len(args):
                print("Error: push requires a value")
                sys.exit(1)
            calc.push(args[i + 1])
            i += 2
        elif cmd == "pop":
            result = calc.pop()
            print(result)
            i += 1
        elif cmd == "add":
            result = calc.add()
            if result:  # If error returned
                print(result)
                sys.exit(1)
            i += 1
        elif cmd == "sub":
            result = calc.sub()
            if result:
                print(result)
                sys.exit(1)
            i += 1
        elif cmd == "mul":
            result = calc.mul()
            if result:
                print(result)
                sys.exit(1)
            i += 1
        elif cmd == "div":
            result = calc.div()
            if result:
                print(result)
                sys.exit(1)
            i += 1
        elif cmd == "delete":
            result = calc.delete()
            if result:
                print(result)
                sys.exit(1)
            i += 1
        else:
            print(f"Error: unknown command '{cmd}'")
            sys.exit(1)


if __name__ == "__main__":
    main()
