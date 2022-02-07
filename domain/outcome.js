const xmlbuilder = require("xmlbuilder");

class Outcome {
    constructor(configuration, feeds) {
        this.feeds = feeds;
        this.configuration = configuration;
    }

    render(feed) {
        return xmlbuilder
            .create(feed, {encoding: 'UTF-8'})
            .end({pretty: true});

    }
}

module.exports = Outcome;
