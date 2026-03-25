import subprocess
import sys

# David Zhou (261135446)
# David Vo (261170038)


def test_cli_basic_push_pop():
    """Test CLI: push 5 pop"""
    result = subprocess.run(
        [sys.executable, "cdc.py", "push", "5", "pop"], capture_output=True, text=True
    )
    assert result.stdout.strip() == "5 + j0"
    assert result.returncode == 0


def test_cli_addition():
    """Test CLI: push 2 push 5 add pop"""
    result = subprocess.run(
        [sys.executable, "cdc.py", "push", "2", "push", "5", "add", "pop"],
        capture_output=True,
        text=True,
    )
    assert result.stdout.strip() == "7 + j0"
    assert result.returncode == 0


def test_cli_complex_operations():
    """Test CLI: push 3+j4 push 1-j2 add pop"""
    result = subprocess.run(
        [sys.executable, "cdc.py", "push", "3+j4", "push", "1-j2", "add", "pop"],
        capture_output=True,
        text=True,
    )
    assert result.stdout.strip() == "4 + j2"
    assert result.returncode == 0


def test_cli_error_handling():
    """Test CLI: pop (empty stack)"""
    result = subprocess.run(
        [sys.executable, "cdc.py", "pop"], capture_output=True, text=True
    )
    assert "Error: stack underflow" in result.stdout
