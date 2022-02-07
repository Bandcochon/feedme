const Outcome = require("./outcome");

class AtomOutcome extends Outcome {
    get flux() {
        const nowUTC = new Date().toUTCString();
        const atom = {
            feed: {
                '@xmlns': 'http://www.w3.org/2005/Atom',
                title: this.configuration.title.getValue(),
                subtitle: this.configuration.description.getValue(),
                updated: nowUTC,
                id: `urn:${this.configuration.websiteId.getValue()}`,
                link: [{
                    '@rel': 'alternate',
                    '@type': 'text/html',
                    '@href': this.configuration.websiteLink.getValue(),
                }, {
                    '@rel': 'self',
                    '@type': 'application/atom+xml',
                    '@href': this.configuration.feedLink.getValue(),
                }
                ],
                summary: this.configuration.description.getValue(),
                entry: this.#getEntries(),
            }
        };

        return super.render(atom);
    }

    get contentType() {
        return 'application/atom+xml';
    }

    #getEntries() {
        return this.feeds.map((el) => {
            return {
                title: el.title.getValue(),
                link: {
                    '@href': el.webSiteLink.getValue(),
                },
                id: `urn:${el.guid.getValue()}`,
                updated: new Date(el.creationDate.getValue()).toUTCString(),
                summary: el.description.getValue(),
                content: {
                    '@type': 'xhtml',
                    div: {
                        '@xmlns': 'http://www.w3.org/1999/xhtml',
                        '#text': el.description.getValue(),
                    }
                },
                author: {
                    name: el.username.getValue()
                }
            }
        });

    }
}

module.exports = AtomOutcome;