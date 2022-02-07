const {GuidValue} = require("../index.js");
const {ValueError} = require("../../../exceptions");

describe('Guid Value object', () => {
    it('should set the default value when given', () => {
        // Arrange
        const expectedUUID = '3a96185c-ab70-4204-ac39-64b555d8d0b5';

        // Act
        const guid = new GuidValue(expectedUUID);

        // Assert
        expect(guid.getValue()).toEqual(expectedUUID);
    });

    it('should raise an exception when the value is a UUID', () => {
        // Arrange
        // Act
        // Assert
        expect( () => {
            new GuidValue('hello, world');
        }).toThrowError(ValueError);
    });

    it('should set a random UUID when no value given', () => {
        // Arrange & Act
        const guid = new GuidValue();

        // Assert
        expect(guid.getValue()).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi);
    })

})