const TextValue = require("./entities/values/text-value");
const {LinkValue, GuidValue} = require("./entities/values");

class Configuration {
    constructor(buffer) {
        this.title = new TextValue(buffer.title);
        this.description = new TextValue(buffer.description);
        this.websiteId = new GuidValue(buffer.websiteId);
        this.websiteLink = new LinkValue(buffer.websiteLink);
        this.feedLink = new LinkValue(buffer.feedLink);
    }
}

module.exports = Configuration;
