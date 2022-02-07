const {FeedModel} = require('../values');
const {ValueError} = require("../../exceptions");


describe('Feed container', () => {
    it('should raise an error when not instantiated properly', async () => {
        expect(() => new FeedModel({})).toThrowError(ValueError);
    });

    it('should be populated with the given object', async () => {
        Date.now = jest.fn(() => 1636728098635);

        const expectedGuid = '3a96185c-ab70-4204-ac39-64b555d8d0b5';
        const expectedCreationDate = 'Thu, 11 Nov 2021 11:32:15 GMT';
        const expectedLink = 'http://a.link';
        const expectedTitle = 'this is a title';
        const expectedDescription = 'this is a description';
        const expectedInsertionDate = 'Fri, 12 Nov 2021 14:41:38 GMT';

        const body = {
            guid: expectedGuid,
            creationDate: expectedCreationDate,
            webSiteLink: expectedLink,
            title: expectedTitle,
            description: expectedDescription,
            insertionDate: expectedInsertionDate,
        };

        const feed = new FeedModel(body);

        expect(feed.guid.getValue()).toEqual(expectedGuid);
        expect(feed.creationDate.getValue()).toEqual(expectedCreationDate);
        expect(feed.webSiteLink.getValue()).toEqual(expectedLink);
        expect(feed.title.getValue()).toEqual(expectedTitle);
        expect(feed.description.getValue()).toEqual(expectedDescription);
    });

    it('should return a populated object if toObject is called', async () => {
        // Arrange
        Date.now = jest.fn(() => 1636728098635);

        const expected_guid = '3a96185c-ab70-4204-ac39-64b555d8d0b5';
        const expectedCreationDate = 'Thu, 11 Nov 2021 11:32:15 GMT';
        const expectedLink = 'http://a.link';
        const expectedTitle = 'this is a title';
        const expectedDescription = 'this is a description';
        const expectedInsertionDate = 'Fri, 12 Nov 2021 14:41:38 GMT';
        const expectedUsername = "usename"

        const body = {
            guid: expected_guid,
            creationDate: expectedCreationDate,
            webSiteLink: expectedLink,
            title: expectedTitle,
            description: expectedDescription,
            username: expectedUsername
        };

        const feed = new FeedModel(body);

        // Act
        const result = feed.toObject();

        // Assert
        expect(result).toEqual({
            guid: expected_guid,
            creationDate: expectedCreationDate,
            webSiteLink: expectedLink,
            title: expectedTitle,
            description: expectedDescription,
            username: expectedUsername
        });
    });
});
