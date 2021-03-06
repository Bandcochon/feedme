const AtomOutcome = require("./atom-outcome");
const RssOutcome = require("./rss-outcome");

class FeedMeDomain {
    constructor(service) {
        this.service = service;
    }

    async save(model) {
        await this.service.connect();
        return await this.service.save(model);
    }

    async getAllFeeds() {
        await this.service.connect();
        return await this.service.getAllFeeds();
    }

    async delete(guid) {
        await this.service.connect();
        return await this.service.delete();
    }
}

module.exports = {
    FeedMeDomain,
    RssOutcome,
    AtomOutcome,
};
