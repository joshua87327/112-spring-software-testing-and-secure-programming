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

test('Application', async (test) => {

    //test getRandomPerson
    const app1 = new Application();
    app1.people = ['Joshua','Ruby','Heidi'];

    test.mock.method(global.Math, 'random', () => 0);
    assert.deepEqual(app1.getRandomPerson(), 'Joshua');
    test.mock.method(global.Math, 'random', () => 0.6);
    assert.deepEqual(app1.getRandomPerson(), 'Ruby');
    test.mock.method(global.Math, 'random', () => 0.9);
    assert.deepEqual(app1.getRandomPerson(), 'Heidi');

    //test selectNextPerson
    const app2 = new Application();
    app2.people = ['Joshua','Ruby','Heidi'];
    app2.selected = ['Joshua'];
    let count = 0;
    test.mock.method(app2, 'getRandomPerson', () => {
        if (count == 0) {
            count++;
            return 'Joshua';
        } else if (count == 1) {
            count++;
            return 'Ruby';
        }
        else {
            return 'Heidi';
        }
    })
    assert.strictEqual(app2.selectNextPerson(), 'Ruby');
    assert.deepStrictEqual(app2.selected, ['Joshua', 'Ruby']);

    assert.strictEqual(app2.selectNextPerson(), 'Heidi');
    assert.deepStrictEqual(app2.selected, ['Joshua','Ruby','Heidi'])

    assert.strictEqual(app2.selectNextPerson(), null);

    //test notifySelected  
    const app3 = new Application();
    app3.people = ['Joshua','Ruby','Heidi'];
    app3.selected = ['Joshua','Ruby','Heidi'];
    app3.mailSystem.send = test.mock.fn(app3.mailSystem.send);
    app3.mailSystem.write = test.mock.fn(app3.mailSystem.write);
    app3.notifySelected();
    assert.strictEqual(app3.mailSystem.send.mock.calls.length, 3);
    assert.strictEqual(app3.mailSystem.write.mock.calls.length, 3);
    
    fs.unlinkSync('name_list.txt');
});