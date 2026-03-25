from cdc import ComplexCalculator

# David Zhou (261135446)
# David Vo (261170038)


def test_push_pop_real_number():
    """T-PUSH-REAL1: push 5 pop -> 5 + j0"""
    calc = ComplexCalculator()
    calc.push("5")
    result = calc.pop()
    assert result == "5 + j0"


def test_pop_empty_stack_error():
    """T-POP-ERR1: pop -> Error: stack underflow"""
    calc = ComplexCalculator()
    result = calc.pop()
    assert result == "Error: stack underflow"


def test_push_pop_complex_compact():
    """T-PUSH-CPLX1: push -2.5-j0.25 pop -> -2.5 - j0.25"""
    calc = ComplexCalculator()
    calc.push("-2.5-j0.25")
    result = calc.pop()
    assert result == "-2.5 - j0.25"


def test_push_pop_complex_spaced():
    """T-PUSH-CPLX2: push 3 + j 4 pop -> 3 + j4"""
    calc = ComplexCalculator()
    calc.push("3 + j 4")
    result = calc.pop()
    assert result == "3 + j4"


def test_add_real_numbers():
    """T-ADD-REAL1: push 2 push 5 add pop -> 7 + j0"""
    calc = ComplexCalculator()
    calc.push("2")
    calc.push("5")
    calc.add()
    result = calc.pop()
    assert result == "7 + j0"


def test_add_complex_numbers():
    """T-ADD-CPLX1: push 3+j4 push 1-j2 add pop -> 4 + j2"""
    calc = ComplexCalculator()
    calc.push("3+j4")
    calc.push("1-j2")
    calc.add()
    result = calc.pop()
    assert result == "4 + j2"


def test_add_stack_underflow():
    """T-ADD-ERR1: push 3 add -> Error: stack underflow"""
    calc = ComplexCalculator()
    calc.push("3")
    result = calc.add()
    # The add() method should return error message
    assert result == "Error: stack underflow"


def test_sub_real_numbers():
    """T-SUB-REAL1: push 5 push 2 sub pop -> 3 + j0"""
    calc = ComplexCalculator()
    calc.push("5")
    calc.push("2")
    calc.sub()
    result = calc.pop()
    assert result == "3 + j0"


def test_sub_complex_numbers():
    """T-SUB-CPLX1: push 3+j4 push 1-j2 sub pop -> 2 + j6"""
    calc = ComplexCalculator()
    calc.push("3+j4")
    calc.push("1-j2")
    calc.sub()
    result = calc.pop()
    assert result == "2 + j6"


def test_sub_stack_underflow():
    """T-SUB-ERR1: sub -> Error: stack underflow"""
    calc = ComplexCalculator()
    result = calc.sub()
    assert result == "Error: stack underflow"


def test_mul_real_numbers():
    """T-MUL-REAL1: push 3 push -2 mul pop -> -6 + j0"""
    calc = ComplexCalculator()
    calc.push("3")
    calc.push("-2")
    calc.mul()
    result = calc.pop()
    assert result == "-6 + j0"


def test_mul_complex_numbers():
    """T-MUL-CPLX1: push 1+j2 push 3-j4 mul pop -> 11 + j2"""
    calc = ComplexCalculator()
    calc.push("1+j2")
    calc.push("3-j4")
    calc.mul()
    result = calc.pop()
    assert result == "11 + j2"


def test_mul_stack_underflow():
    """T-MUL-ERR1: mul -> Error: stack underflow"""
    calc = ComplexCalculator()
    result = calc.mul()
    assert result == "Error: stack underflow"


def test_div_real_numbers():
    """T-DIV-REAL1: push 8 push 2 div pop -> 4 + j0"""
    calc = ComplexCalculator()
    calc.push("8")
    calc.push("2")
    calc.div()
    result = calc.pop()
    assert result == "4 + j0"


def test_div_complex_numbers():
    """T-DIV-CPLX1: push 4+j2 push 1+j1 div pop -> 3 - j1"""
    calc = ComplexCalculator()
    calc.push("4+j2")
    calc.push("1+j1")
    calc.div()
    result = calc.pop()
    assert result == "3 - j1"


def test_div_by_zero_real():
    """T-DIV-ERR1: push 1 push 0 div -> Error: division by zero"""
    calc = ComplexCalculator()
    calc.push("1")
    calc.push("0")
    result = calc.div()
    assert result == "Error: division by zero"


def test_div_by_zero_complex():
    """T-DIV-ERR2: push 1+j0 push 0+j0 div -> Error: division by zero"""
    calc = ComplexCalculator()
    calc.push("1+j0")
    calc.push("0+j0")
    result = calc.div()
    assert result == "Error: division by zero"


def test_delete_real():
    """T-DEL-REAL1: push 1 push 2 delete pop -> 1 + j0"""
    calc = ComplexCalculator()
    calc.push("1")
    calc.push("2")
    calc.delete()
    result = calc.pop()
    assert result == "1 + j0"


def test_delete_complex():
    """T-DEL-CPLX1: push 1+j1 push 2+j3 delete pop -> 1 + j1"""
    calc = ComplexCalculator()
    calc.push("1+j1")
    calc.push("2+j3")
    calc.delete()
    result = calc.pop()
    assert result == "1 + j1"


def test_delete_stack_underflow():
    """T-DEL-ERR1: delete -> Error: stack underflow"""
    calc = ComplexCalculator()
    result = calc.delete()
    assert result == "Error: stack underflow"
