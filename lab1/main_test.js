const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

const names = ['John', 'Jane', 'Doe', 'Smith'];
test("Test MyClass's addStudent", () => {
    const myClass = new MyClass();
    names.forEach(name => {
        const student = new Student();
        student.setName(name);
        myClass.addStudent(student);
    });
    assert.strictEqual(names.length, myClass.students.length, "MyClass's addStudent didn't add correct amount of students");
});

test("Test MyClass's getStudentById", () => {
    const myClass = new MyClass();
    let ids = [];
    names.forEach(name => {
        const student = new Student();
        student.setName(name);
        myClass.addStudent(student);
        const newStudentId = myClass.addStudent(student);;
        ids.push(newStudentId);
    });
    let uniqueIds = [...new Set(ids)];
    assert.strictEqual(names.length, ids.length, "MyClass's getStudentById didn't add correct amount of ids");
    assert.strictEqual(names.length, uniqueIds.length, "MyClass's getStudentById have duplicate ids");
});

test("Test Student's setName", () => {
    const myClass = new MyClass();
    names.forEach(name => {
        const student = new Student();
        student.setName(name);
        const newStudentId = myClass.addStudent(student);
        const setName = myClass.getStudentById(newStudentId).name;
        assert.strictEqual(setName, name, "Student's setName didn't set it correctly");
    });
});

test("Test Student's getName", () => {
    const myClass = new MyClass();
    names.forEach(name => {
        const student = new Student();
        student.setName(name);
        const newStudentId = myClass.addStudent(student);
        const setName = myClass.getStudentById(newStudentId).name;
        const getName = myClass.getStudentById(newStudentId).getName();
        assert.strictEqual(setName, getName, "Student's getName didn't set it correctly");
    });
});