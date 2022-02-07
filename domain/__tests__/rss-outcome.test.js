const {RssOutcome} = require("../index");
const {FeedModel} = require("../../entities/values");
const Configuration = require("../../configuration");

describe('Rss feeds outcome', () => {
    it('should returns right content type', () => {
        // arrange
        const feed = new FeedModel({
            guid: '3a96185c-ab70-4204-ac39-64b555d8d0b5',
            creationDate: '2021-11-11T12:32:15.071142',
            webSiteLink: 'http://a.link',
            title: 'this is a title',
            description: 'this is a description',
        });
        const outcome = new RssOutcome([feed]);

        // act
        const contentType = outcome.contentType;

        // assert
        expect(contentType).toEqual('application/rss+xml');
    });

    it('should returns a well formed XML string', () => {
        // arrange
        const expected_guid = '3a96185c-ab70-4204-ac39-64b555d8d0b5';
        const expected_creation_date = 'Wed, 24 Nov 2021 18:50:34 GMT';
        const expected_link = 'http://a.link';
        const expected_title = 'this is a title';
        const expected_description = 'this is a description';

        const firstFeed = new FeedModel({
            guid: expected_guid,
            creationDate: expected_creation_date,
            webSiteLink: expected_link,
            title: expected_title,
            description: expected_description,
        });

        const expected_feed_title = "This is a title";
        const expected_feed_description = "This is a feed description";
        const expected_feed_last_build_time = "Fri, 17 Sep 2021 19:37:41 GMT";
        const expected_feed_link = "https://This.is.a/feed/link";
        const expected_feed_website_id = "8a38c20f-6a82-4a93-a02c-2f1d34b1c7d9";
        const expected_feed_website_link = "https://a.website.link";


        const configuration = new Configuration({
            title: expected_feed_title,
            description: expected_feed_description,
            websiteId: expected_feed_website_id,
            websiteLink: expected_feed_website_link,
            feedLink: expected_feed_link
        });
        const outcome = new RssOutcome(configuration, [firstFeed]);

        jest
            .useFakeTimers('modern')
            .setSystemTime(new Date(expected_feed_last_build_time));

        // act
        const flux = outcome.flux;

        // assert
        expect(flux).toEqual(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${expected_feed_title}</title>
    <description>${expected_feed_description}</description>
    <lastBuildDate>${expected_feed_last_build_time}</lastBuildDate>
    <link>${expected_feed_link}</link>
    <item>
      <title>${expected_title}</title>
      <description>${expected_description}</description>
      <pubDate>${expected_creation_date}</pubDate>
      <link>${expected_link}</link>
    </item>
  </channel>
</rss>`);
    });
});
