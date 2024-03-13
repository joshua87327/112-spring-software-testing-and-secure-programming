const test = require('node:test');
const assert = require('assert');
const { Application, MailSystem } = require('./main');
const fs = require('fs');

test("MailSystem write()", () => {
    const ms = new MailSystem();
    myName = 'Joshua';
    cxt = ms.write(myName);
    assert.strictEqual(cxt, 'Congrats, ' + myName + '!');
});

test("MailSystem send()", (t) => {
    const ms = new MailSystem();
    Math.random = () => 1;
    t.mock.method(Math, 'random', () => 1);
    sendStatus = ms.send('Joshua', "Sample context");
    assert.strictEqual(sendStatus, true);
    t.mock.method(Math, 'random', () => 0);
    sendStatus = ms.send('Joshua', "Sample context");
    assert.strictEqual(sendStatus, false);
});


test("Application getNames()", async (t) => {
    t.mock.method(fs, 'readFile', async () => 'Joshua\nRuby\nHeidi\nJames');
    const app = new Application();
    name_list = await app.getNames();
    assert.deepStrictEqual(name_list, [['Joshua','Ruby','Heidi','James'], []]);
});

test("Application getRandomPerson()",async (t) => {
    t.mock.method(fs, 'readFile', async () => 'Joshua\nRuby\nHeidi\nJames');
    const app = new Application();
    await app.getNames();
    Math.random = () => 0.3;
    // 0.3 * 4 = 1.2, floor => 1
    assert.strictEqual(app.getRandomPerson(), 'Ruby');
});

test("Application selectNextPerson()", async (t) => {
    t.mock.method(fs, 'readFile', async () => 'Joshua\nRuby\nHeidi\nJames');
    const app = new Application();
    Math.random = () => 0.3;
    await app.getNames();
    app.selected = ['Joshua','Ruby','Heidi','James'];
    let next = app.selectNextPerson();
    assert.strictEqual(app.selectNextPerson(), null);
    app.selected = [];
    app.selectNextPerson = () => 'Ruby';
    next = await app.selectNextPerson();
    assert.strictEqual(next, 'Ruby');
});

test("Application notifySelected()", (t) => {
    // t.mock.method(fs, 'readFile', async () => 'Joshua\nRuby\nHeidi\nJames');
    const app = new Application();
    t.mock.method(Math, 'random', () => 0.3);
    app.selected = ['Joshua', 'Ruby'];
    app.notifySelected();
});