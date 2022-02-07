const GuidValue = require("./values/guid-value");
const DateValue = require("./values/date-value");
const LinkValue = require("./values/link-value");
const TextValue = require("./values/text-value");

class FeedModel {
    constructor(body) {
        this.guid = new GuidValue(body.guid);
        this.creationDate = new DateValue(body.creationDate);
        this.webSiteLink = new LinkValue(body.webSiteLink);
        this.title = new TextValue(body.title);
        this.description = new TextValue(body.description);
        this.username = new TextValue(body.username);
    }

    toObject() {
        return {
            guid: this.guid.getValue(),
            creationDate: this.creationDate.getValue(),
            webSiteLink: this.webSiteLink.getValue(),
            title: this.title.getValue(),
            description: this.description.getValue(),
            username: this.username.getValue()
        };
    }
}

module.exports = FeedModel;