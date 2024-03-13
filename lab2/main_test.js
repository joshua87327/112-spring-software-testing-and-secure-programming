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

const nameList = ['Joshua','Ruby'];

test("Application getNames()", async (t) => {
    fs.writeFileSync('name_list.txt', 'Joshua\nRuby', 'utf8');
    const app = new Application();
    name_list = await app.getNames();
    assert.deepStrictEqual(name_list, [['Joshua','Ruby'], []]);
});

test("Application getRandomPerson()",async (t) => {
    const app = new Application();
    await app.getNames();
    Math.random = () => 0;
    let rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Joshua');
    Math.random = () => 0.5;
    rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Ruby');
});

test("Application selectNextPerson()", async (t) => {
    const app = new Application();
    await app.getNames();
    app.selected = ['Joshua','Ruby'];

    let next = app.selectNextPerson();
    assert.strictEqual(app.selectNextPerson(), null);
    
    app.selected = [];
    app.selectNextPerson = () => 'Joshua';
    next = await app.selectNextPerson();
    assert.strictEqual(next, 'Joshua');

    app.selectNextPerson = () => 'Ruby';
    next = await app.selectNextPerson();
    assert.strictEqual(next, 'Ruby');
});

test("Application notifySelected()", async (t) => {

    const writeSpy = t.mock.fn(() => {true});
    t.mock.method(MailSystem.prototype, 'write').mock.mockImplementation(writeSpy);

    const sendSpy = t.mock.fn(() => {true});
    t.mock.method(MailSystem.prototype, 'send').mock.mockImplementation(sendSpy);
    
    const app = new Application();
    await app.getNames();
    Math.random = () => 0;
    app.selectNextPerson();
    Math.random = () => 0.5;
    app.selectNextPerson();
    

    app.notifySelected();
    
    assert.strictEqual(writeSpy.mock.calls.length, 2);
    assert.strictEqual(sendSpy.mock.calls.length, 2);

    fs.unlinkSync('name_list.txt');
});