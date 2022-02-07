const {GuidValue} = require("../index.js");
const ValueObject = require("../value-object");

describe('Value object is the base class for all value objects', () => {
    it('should assign the value', () => {
        // Arrange
        const superString = 'a super string';

        // Act
        const valueObject = new ValueObject(superString);

        // Assert
        expect(valueObject.getValue()).toEqual(superString);
    });

    it('value should be immutable', () => {
        // Arrange
        const superString = 'a super string';
        const valueObject = new ValueObject(superString);

        // Act
        valueObject.value = "hello";

        // Assert
        expect(valueObject.getValue()).toEqual(superString);
    });

    it('should return raise  by default on validation', () => {
        // Arrange
        const superString = 'a super string';
        const valueObject = new ValueObject(superString);

        // Act
        const result = valueObject.validateValue();

        // Assert
        expect(result).toBeFalsy();
    });
});
