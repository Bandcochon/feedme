const LinkValue = require("../link-value");
const {ValueError} = require("../../../exceptions");

describe('Link value object', () => {
    it('should contains a valid link at construction time', () => {
        // Arrange
        const url = 'https://bandcochon.re/';

        // Act
        const linkValue = new LinkValue(url);

        // Arrange
        expect(linkValue.getValue()).toEqual(url);
    });

    it('should raise an exception if it not a HTTP link', () => {
        // Arrange
        const wrongUrl = '://hello.world/projects/feedme';

        // Act
        expect(() => {
            new LinkValue(wrongUrl);
        })
            // Assert
            .toThrowError(ValueError);
    });
});