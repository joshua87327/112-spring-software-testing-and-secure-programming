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

const nameList = ['Joshua','Ruby','Heidi','James'];

test("Application getNames()", async (t) => {
    fs.writeFileSync('name_list.txt', 'Joshua\nRuby\nHeidi\nJames', 'utf8');
    const app = new Application();
    name_list = await app.getNames();
    assert.deepStrictEqual(name_list, [['Joshua','Ruby','Heidi','James'], []]);
});

test("Application getRandomPerson()",async (t) => {
    const app = new Application();
    await app.getNames();
    Math.random = () => 0.3;
    // 0.3 * 4 = 1.2, floor => 1
    let rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Ruby');
    for (let i = 0; i < nameList.length; i++) {
        /* stub Math.random to return 1/length */
        t.mock.method(Math, 'random').mock.mockImplementation( () => i / nameList.length);
        assert.strictEqual(app.getRandomPerson(), nameList[i]);
    }
});

test("Application selectNextPerson()", async (t) => {
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

test("Application notifySelected()", async (t) => {

    const writeSpy = t.mock.fn(() => {true});
    t.mock.method(MailSystem.prototype, 'write').mock.mockImplementation(writeSpy);

    const sendSpy = t.mock.fn(() => {true});
    t.mock.method(MailSystem.prototype, 'send').mock.mockImplementation(sendSpy);
    
    const app = new Application();
    await app.getNames();
    Math.random = () => 0;
    app.selectNextPerson();
    Math.random = () => 0.25;
    app.selectNextPerson();
    

    app.notifySelected();
    
    assert.strictEqual(writeSpy.mock.calls.length, 2);
    assert.strictEqual(sendSpy.mock.calls.length, 2);

    fs.unlinkSync('name_list.txt');
});