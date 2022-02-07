const {DateValue} = require("../index.js");
const {ValueError} = require("../../../exceptions");

describe('Date value object', () => {
    it('Should be a valid date on creation', () => {
        // Arrange
        const date = '2021-11-11T10:32:18.918414';

        // Act
        const dateValue = new DateValue(date);

        // Arrange
        expect(dateValue.validateValue()).toBeTruthy();
    });

    it('should raise an exception if the date is not a ISO date', () => {
        // Arrange
        const date = 'Not a date';

        expect(() => {
            // Act
            new DateValue(date);
        })
            // Arrange
            .toThrowError(ValueError);
    });
});
