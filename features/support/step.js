const assert = require('assert').strict;
const {Given, Then, After, Before} = require("@cucumber/cucumber");
const axios = require('axios').default;
const {MongoClient} = require('mongodb');
const moment = require("moment");

assert.notUndefined = (a) => assert.notStrictEqual(a, undefined);
assert.notNull = (a, b) => assert.notStrictEqual(a, null, !b ? null : b);
assert.null = (a) => assert.strictEqual(a, null);

const mongo = {
    host: 'localhost',
    port: 27017,
    dbName: 'feedme',
    collectionName: 'feedme'
};


class World {
    constructor() {
        this.guid = '';
        this.title = '';
        this.description = '';
        this.link = '';
        this.response = null;
    }
}

let world = null;

const mongoClient = new MongoClient(`mongodb://${mongo.host}:${mongo.port}`, {
    socketTimeoutMS: 100,
    serverSelectionTimeoutMS: 100,
    connectTimeoutMS: 100
});


Before(async () => {
    world = new World();
    await mongoClient.connect();
});

After(async () => {
    world = null;

    await mongoClient.db(mongo.dbName).collection(mongo.collectionName).deleteMany({});
    await mongoClient.close();
});

// Background
Given('a channel with title {string}', async (title) => {
    world.title = title;
});

Then('description is {string}', async (description) => {
    world.description = description;
});

Then('link is {string}', async (link) => {
    world.link = link;
});

Given('A new content to add:', async (content) => {
    world.content = JSON.parse(content);
});

Then("there's already a database content with this guid", async () => {
    try {
        await axios.post('http://localhost:3000/v1/feedme', world.content);
    } catch (e) {
        assert.equal(e.response.status, 409);
    }
});

Then('the route {string} is called with {string} method', async (route, verb) => {
    try {
        world.response = await axios[verb.toLowerCase()](`http://localhost:3000${route}`, world.content);
    } catch (e) {
        world.response = {
            status: parseInt(e.response.status)
        };
    }
});

Then('it returns a {string} status code', async (status) => {
    assert.equal(world.response.status, parseInt(status));
});

Then('the database contains an entry with those values', async (values) => {
    const [guid, creationDate, title, description, webSiteLink, username] = values.rawTable[1];
    const result = await mongoClient
        .db(mongo.dbName)
        .collection(mongo.collectionName)
        .findOne({guid});

    assert.notNull(result, "The entry wasn't found");
    assert.equal(moment(creationDate).toISOString(), moment(result.creationDate).toISOString());
    assert.equal(result.title, title);
    assert.equal(result.description, description);
    assert.equal(result.webSiteLink, webSiteLink);
    assert.equal(result.username, username);
});

Given(/^A bunch of content into the database like those$/, async (values) => {
    const [guid, creationDate, title, description, webSiteLink, username] = values.rawTable[1];
    assert.notUndefined(guid);
    assert.notUndefined(creationDate);
    assert.notUndefined(title);
    assert.notUndefined(description);
    assert.notUndefined(webSiteLink);
    assert.notUndefined(username);

    world.guid = guid;
    await mongoClient.db(mongo.dbName).collection(mongo.collectionName).insertOne({
        guid,
        creationDate,
        title,
        description,
        webSiteLink,
        username
    });
});

Then('the route {string} is called with the GET method without additional parameters', async (route) => {
    world.response = null;
    try {
        world.response = await axios.get(`http://localhost:3000${route}`);
    } catch (e) {
        world.response = {
            status: e.response.status
        }
    }
});

Then(/^it returns something like$/, function (value) {
    const data = world.response.data;
    value = value.replace('{{now}}', new Date().toUTCString());
    const trimmedSrc = data.split('\n').map((line) => line.trim()).join('').trim();
    const trimmedCmp = value.split('\n').map((line) => line.trim()).join('').trim();

    assert.equal(trimmedSrc, trimmedCmp);
});

Then("the content type is {string}", function (mimetype) {
    assert.equal(world.response.headers['content-type'], mimetype);
});

Then("the route {string} is called with the GET method with format={string} as parameter", async function (route, parameter) {
    try {
        world.response = await axios.get(`http://localhost:3000${route}?format=${parameter}`);
    } catch (e) {
        world.response = {
            status: e.response.status
        }
    }
});

async function findClientWithGuid(guid) {
    return await mongoClient
        .db(mongo.dbName)
        .collection(mongo.collectionName)
        .findOne({guid});
}

Then(/^the entry doesn't exist into the database anymore$/, async function () {
    const result = findClientWithGuid(world.guid);
    assert.notNull(result);
});

Given(/^A guid that doesn't exists into the database A bunch of content into the database like those$/, async function (values) {
    const [guid] = values.rawTable[1];

    assert.null(await findClientWithGuid(guid));
});