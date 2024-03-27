const test = require('node:test');
const { describe, it } = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

// TODO: write your tests here
test('Test Calculator', () => {
    const calc = new Calculator();
    // print(Math.exp(1.8E+308));
    const testcases_exp = [
        { param: 1/0, expected: { name: 'Error', message: 'unsupported operand type'} },
        { param: 'a', expected: { name: 'Error', message: 'unsupported operand type'} },
        { param: 1.8E+307, expected: { name: 'Error', message: 'overflow'} },
    ];
    for(const tc of testcases_exp){
        assert.throws(()=> { calc.exp(tc.param) }, tc.expected);
    }
    assert.strictEqual(calc.exp(0), Math.exp(0));
    assert.strictEqual(calc.exp(1), Math.exp(1));
    assert.doesNotThrow(() => { calc.exp(700) });

    const testcases_log = [
        { param: 1/0, expected: { name: 'Error', message: 'unsupported operand type'} },
        { param: -0, expected: { name: 'Error', message: 'math domain error (1)'} },
        { param: -1, expected: { name: 'Error', message: 'math domain error (2)'} },
    ];
    for(const tc of testcases_log){
        assert.throws(()=> { calc.log(tc.param) }, tc.expected);
    }
    assert.strictEqual(calc.log(1), Math.log(1));
    assert.strictEqual(calc.log(Math.E), Math.log(Math.E));

});