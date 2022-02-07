const request = require('supertest');
const app = require('../index');
const Feed = require('../../entities/values');

describe('Post method', () => {
    it.skip ('should returns 201 status on success full post and the content is the newly create value', async () => {
        // Arrange
        const expected_creation_date ='2021-11-10T22:21:00.123117';
        const expected_link ='https://bandcochon.io/feedme/';
        const expected_title ='RSS ATOM as Microservice';
        const expected_description ='bandcochon/feedme is the best miscroservice for handling rss + atom feeds';

        // Act
        const res = await request(app).post('/v1/feedme').send({
            creationDate: expected_creation_date,
            link: expected_link,
            title: expected_title,
            description: expected_description
        });

        // Assert
        expect(res.statusCode).toBe(201);

        const res_json = res.body;
        expect(res_json.guid).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi);
        expect(res_json.creationDate).toBe(expected_creation_date);
        expect(res_json.link).toBe(expected_link);
        expect(res_json.title).toBe(expected_title);
        expect(res_json.description).toBe(expected_description);
    });
});
