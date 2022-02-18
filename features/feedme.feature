Feature: RSS/Atom Feed

  Background:
    Given a channel with title "Mon site"
    And description is "Ceci est un exemple de flux RSS 2.0"
    And link is "https://this.is.a.link"

  Scenario: Add a new content
    Given A new content to add:
      """
      {
      "guid": "96bea7ed-027f-4987-abc8-b506d9825c8f",
      "creationDate": "2021-10-17T19:37:41",
      "webSiteLink": "https://this.is.a.path/",
      "title": "this is a title",
      "description": "This is a content",
      "username": "princecuberdon"
      }
      """
    When the route "/v1/feedme" is called with "POST" method
    Then it returns a "201" status code
    And the database contains an entry with those values
      | guid                                 | creation_date       | title           | description       | link                    | username       |
      | 96bea7ed-027f-4987-abc8-b506d9825c8f | 2021-10-17T19:37:41 | this is a title | This is a content | https://this.is.a.path/ | princecuberdon |

  Scenario: Add a non unique content
    Given A new content to add:
      """
      {
      "guid": "96bea7ed-027f-4987-abc8-b506d9825c8f",
      "creationDate": "2021-10-17T19:37:41",
      "webSiteLink": "https://this.is.a.path/",
      "title": "this is a title",
      "description": "This is a content",
      "username": "this is a username"
      }
      """
    And there's already a database content with this guid
    When the route "/v1/feedme" is called with "POST" method
    Then it returns a "409" status code

  Scenario: Call feed address will return a well formatted xml in ATOM format which is the default format
    Given A bunch of content into the database like those
      | guid                                 | creation_date       | title           | description       | link                    | username       |
      | 96bea7ed-027f-4987-abc8-b506d9825c8e | 2021-10-17T19:37:41 | this is a title | This is a content | https://this.is.a.path/ | princecuberdon |
    When the route "/v1/feedme" is called with the GET method without additional parameters
    Then it returns a "200" status code
    And the content type is "application/atom+xml; charset=utf-8"
    And it returns something like
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>La traque au cochon</title>
        <subtitle>Bandcochon - Ne na cosson a la renyon ! </subtitle>
        <updated>{{now}}</updated>
        <id>urn:ef62fa15-cb7e-416d-b116-cacb7204bc02</id>
        <link rel="alternate" type="text/html" href="https://bandcochon.re/feeds"/>
        <link rel="self" type="application/atom+xml" href="https://feed.link/another_one"/>
        <summary>Bandcochon - Ne na cosson a la renyon ! </summary>
        <entry>
          <title>this is a title</title>
          <link href="https://this.is.a.path/"/>
          <id>urn:96bea7ed-027f-4987-abc8-b506d9825c8e</id>
          <updated>Sun, 17 Oct 2021 17:37:41 GMT</updated>
          <summary>This is a content</summary>
          <content type="xhtml">
            <div xmlns="http://www.w3.org/1999/xhtml">This is a content</div>
          </content>
          <author>
            <name>princecuberdon</name>
          </author>
        </entry>
      </feed>
      """

  Scenario: Call rss with a parameter address will return a well formatted xml in RSS format
    Given A bunch of content into the database like those
      | guid                                 | creation_date       | title           | description       | link                    | username       |
      | 96bea7ed-027f-4987-abc8-b506d9825c8f | 2021-10-17T19:37:41 | this is a title | This is a content | https://this.is.a.path/ | princecuberdon |
    When the route "/v1/feedme" is called with the GET method with format="rss" as parameter
    Then it returns something like
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
          <channel>
              <title>La traque au cochon</title>
              <description>Bandcochon - Ne na cosson a la renyon ! </description>
              <lastBuildDate>{{now}}</lastBuildDate>
              <link>https://feed.link/another_one</link>
              <item>
                  <title>this is a title</title>
                  <description>This is a content</description>
                  <pubDate>Sun, 17 Oct 2021 17:37:41 GMT</pubDate>
                  <link>https://this.is.a.path/</link>
              </item>
          </channel>
      </rss>
      """
    And the content type is "application/rss+xml; charset=utf-8"

  Scenario: Call feed with a parameter address will return a well formatted xml in ATOM format
    Given A bunch of content into the database like those
      | guid                                 | creation_date       | title           | description       | link                    | username       |
      | 96bea7ed-027f-4987-abc8-b506d9825c8f | 2021-10-17T19:37:41 | this is a title | This is a content | https://this.is.a.path/ | princecuberdon |
    When the route "/v1/feedme" is called with the GET method with format="atom" as parameter
    Then it returns something like
      """
      <?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>La traque au cochon</title>
        <subtitle>Bandcochon - Ne na cosson a la renyon ! </subtitle>
        <updated>{{now}}</updated>
        <id>urn:ef62fa15-cb7e-416d-b116-cacb7204bc02</id>
        <link rel="alternate" type="text/html" href="https://bandcochon.re/feeds"/>
        <link rel="self" type="application/atom+xml" href="https://feed.link/another_one"/>
        <summary>Bandcochon - Ne na cosson a la renyon ! </summary>
        <entry>
          <title>this is a title</title>
          <link href="https://this.is.a.path/"/>
          <id>urn:96bea7ed-027f-4987-abc8-b506d9825c8f</id>
          <updated>Sun, 17 Oct 2021 17:37:41 GMT</updated>
          <summary>This is a content</summary>
          <content type="xhtml">
            <div xmlns="http://www.w3.org/1999/xhtml">This is a content</div>
          </content>
          <author>
            <name>princecuberdon</name>
          </author>
        </entry>
      </feed>
      """
    And the content type is "application/atom+xml; charset=utf-8"

  Scenario: Deleting an entry
    Given A bunch of content into the database like those
      | guid                                 | creation_date       | title           | description       | link                    | username       |
      | 96bea7ed-027f-4987-abc8-b506d9825c8f | 2021-10-17T19:37:41 | this is a title | This is a content | https://this.is.a.path/ | princecuberdon |
    When the route "/v1/feedme/96bea7ed-027f-4987-abc8-b506d9825c8f" is called with "DELETE" method
    Then it returns a "204" status code
    And the entry doesn't exist into the database anymore

  Scenario: Deleting a non exiting entry
    Given A guid that doesn't exists into the database A bunch of content into the database like those
      | guid                                 |
      | 96bea7ed-027f-4987-abc8-b506d9825c8e |
    When the route "/v1/feedme/96bea7ed-027f-4987-abc8-b506d9825c8e" is called with "DELETE" method
    Then it returns a "204" status code
    And the entry doesn't exist into the database anymore
