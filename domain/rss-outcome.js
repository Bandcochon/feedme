const Outcome = require("./outcome");

class RssOutcome extends Outcome {
    get flux() {
        const nowUTC = new Date().toUTCString();

        const rss = {
            rss: {
                '@version': '2.0',
                channel: {
                    title: this.configuration.title.getValue(),
                    description: this.configuration.description.getValue(),
                    lastBuildDate: nowUTC,
                    link: this.configuration.feedLink.getValue(),
                    item: this.arrangeFeeds,
                }
            }
        };

        return super.render(rss);
    }

    get contentType() {
        return 'application/rss+xml';
    }

    get arrangeFeeds() {
        return this.feeds.map((el) => {
            return {
                title: el.title.getValue(),
                description: el.description.getValue(),
                pubDate:new Date(el.creationDate.getValue()).toUTCString(),
                link: el.webSiteLink.getValue()
            }
        });
    }
}

module.exports = RssOutcome;
