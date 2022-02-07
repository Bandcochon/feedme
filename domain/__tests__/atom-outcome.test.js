const {FeedModel} = require("../../entities/values");
const AtomOutcome = require("../atom-outcome");
const Configuration = require("../../configuration");

describe('Atom feed Outcome', () => {
    it('should returns right content type', () => {
        // arrange
        const feed = new FeedModel({
            guid: '3a96185c-ab70-4204-ac39-64b555d8d0b5',
            creationDate: '2021-11-11T12:32:15.071142',
            webSiteLink: 'http://a.link',
            title: 'this is a title',
            description: 'this is a description'
        });
        const outcome = new AtomOutcome([feed]);

        // act
        const contentType = outcome.contentType;

        // assert
        expect(contentType).toEqual('application/atom+xml');
    });

    it('should returns a well formed XML string', () => {
        // arrange
        const expected_guid = '3a96185c-ab70-4204-ac39-64b555d8d0b5';
        const expected_creation_date = 'Wed, 24 Nov 2021 18:50:34 GMT';
        const expected_link = 'http://a.link';
        const expected_title = 'this is a title';
        const expected_description = `this is a description,
        a multiline description`;
        const expected_username = 'hunter_bandcochon';

        const firstFeed = new FeedModel({
            guid: expected_guid,
            creationDate: expected_creation_date,
            webSiteLink: expected_link,
            title: expected_title,
            description: expected_description,
            username: expected_username,
        });

        const expected_feed_website_id = "8a38c20f-6a82-4a93-a02c-2f1d34b1c7d9";
        const expected_feed_website_link = "https://a.website.link";
        const expected_feed_title = "This is a title";
        const expected_feed_description = "This is a feed description";
        const expected_feed_last_build_time = "Fri, 17 Sep 2021 19:37:41 GMT";
        const expected_feed_link = "https://This.is.a/feed/link";

        const configuration = new Configuration({
            title: expected_feed_title,
            description: expected_feed_description,
            link: expected_feed_link,
            websiteId: expected_feed_website_id,
            websiteLink: expected_feed_website_link,
            feedLink: expected_feed_link
        });
        const outcome = new AtomOutcome(configuration, [firstFeed]);

        jest
            .useFakeTimers('modern')
            .setSystemTime(new Date(expected_feed_last_build_time));

        // act
        const flux = outcome.flux;

        // assert
        expect(flux).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${expected_feed_title}</title>
  <subtitle>${expected_feed_description}</subtitle>
  <updated>${expected_feed_last_build_time}</updated>
  <id>urn:${expected_feed_website_id}</id>
  <link rel="alternate" type="text/html" href="${expected_feed_website_link}"/>
  <link rel="self" type="application/atom+xml" href="${expected_feed_link}"/>
  <summary>${expected_feed_description}</summary>
  <entry>
    <title>${expected_title}</title>
    <link href="${expected_link}"/>
    <id>urn:${expected_guid}</id>
    <updated>${expected_creation_date}</updated>
    <summary>${expected_description}</summary>
    <content type="xhtml">
      <div xmlns="http://www.w3.org/1999/xhtml">${expected_description}</div>
    </content>
    <author>
      <name>${expected_username}</name>
    </author>
  </entry>
</feed>`);
    });
});