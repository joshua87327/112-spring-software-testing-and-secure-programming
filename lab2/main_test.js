const test = require('node:test');
const assert = require('assert');
const { Application, MailSystem } = require('./main');
const fs = require('fs');

test("MailSystem write()", () => {
    const ms = new MailSystem();
    myName = 'Joshua';
    assert.strictEqual(ms.write(myName), 'Congrats, ' + myName + '!');
    assert.strictEqual(ms.write(true), 'Congrats, true!');
    assert.strictEqual(ms.write(487), 'Congrats, 487!');
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

const nameList = ['Joshua','Ruby','Heidi'];

test("Application getNames()", async (t) => {
    fs.writeFileSync('name_list.txt', 'Joshua\nRuby\nHeidi', 'utf8');
    const app = new Application();
    getNameList = await app.getNames();
    assert.deepStrictEqual(getNameList, [nameList, []]);
});

test("Application getRandomPerson()",async (t) => {
    const app = new Application();
    await app.getNames();
    Math.random = () => 0;
    let rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Joshua');
    Math.random = () => 0.6;
    rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Ruby');
    Math.random = () => 0.9;
    rndPerson = await app.getRandomPerson();
    assert.strictEqual(rndPerson, 'Heidi');
});

test("Application selectNextPerson()", async (t) => {
    const app = new Application();
    await app.getNames();
    
    Math.random = () => 0;
    let next = app.selectNextPerson();
    assert.strictEqual(next, 'Joshua');
    assert.deepStrictEqual(app.selected, ['Joshua']);

    Math.random = () => 0.6;
    next = app.selectNextPerson();
    assert.strictEqual(next, 'Ruby');
    assert.deepStrictEqual(app.selected, ['Joshua','Ruby']);

    Math.random = () => 0.9;
    next = app.selectNextPerson();
    assert.strictEqual(next, 'Heidi');
    assert.deepStrictEqual(app.selected, ['Joshua','Ruby','Heidi']);

    assert.strictEqual(app.selectNextPerson(), null);
    
});

test("Application notifySelected()", async (t) => {

    const app = new Application();
    await app.getNames();
    app.people = ['Joshua','Ruby','Heidi'];
    app.selected = ['Joshua','Ruby','Heidi'];
    app.mailSystem.send = test.mock.fn(app.mailSystem.send);
    app.mailSystem.write = test.mock.fn(app.mailSystem.write);
    

    app.notifySelected();
    
    assert.strictEqual(app.mailSystem.send.mock.calls.length, 3);
    assert.strictEqual(app.mailSystem.write.mock.calls.length, 3);

    fs.unlinkSync('name_list.txt');
});