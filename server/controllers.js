const fs = require('fs');
const path = require("path");

const {FeedModel} = require('../entities/values');
const {FeedService} = require('../infrastructure');
const {FeedMeDomain, RssOutcome, AtomOutcome} = require('../domain');
const {HttpStatus} = require("./http-status");
const {ValueError, AlreadyExistsError} = require("../exceptions");
const Configuration = require("../configuration");


const filepath = path.join(__dirname, '..', 'config.json');
const configurationFileContent = JSON.parse(fs.readFileSync(filepath));
const configuration = new Configuration(configurationFileContent);

const feedService = new FeedService();

async function getAllFeeds(req, resp) {
    try {
        const feedService = new FeedService();
        const feedDomain = new FeedMeDomain(feedService);
        const feeds = await feedDomain.getAllFeeds();
        const outcome = new (
            req.query.format && req.query.format.toLowerCase() === 'rss' ?
                RssOutcome : AtomOutcome
        )(configuration, feeds);

        resp.status(HttpStatus.Ok);
        resp.set('Content-Type', outcome.contentType);
        resp.send(outcome.flux);
    } catch (err) {
        const status = err instanceof AlreadyExistsError ?
            HttpStatus.Conflict :
            HttpStatus.ServerError;
        console.error(err);
        resp.status(status);
        resp.send({
            error: err.message
        });
    }
}

async function addFeed(req, resp) {
    try {
        const feedModel = new FeedModel(req.body);
        const feedDomain = new FeedMeDomain(feedService);
        const result = await feedDomain.save(feedModel);

        resp.status(HttpStatus.Created);
        resp.send(result.toObject());
    } catch (err) {
        const status = err instanceof ValueError ? HttpStatus.BadRequest : HttpStatus.Conflict;
        resp.status(status);
        resp.send({
            error: err.message
        });
    }
}

async function deleteFeed(req, resp) {
    try {
        const guid = req.params.guid;
        const feedDomain = new FeedMeDomain(feedService);
        await feedDomain.delete(guid);
        resp.status(HttpStatus.NoContent);
        resp.send();
    } catch (err) {
        console.error(err.message);
        resp.status(HttpStatus.NotFound);
        resp.send({
            error: err.message
        });
    }
}

module.exports = {
    addFeed,
    getAllFeeds,
    deleteFeed
};
