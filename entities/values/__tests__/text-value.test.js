const { ValueError } = require("../../../exceptions");
const TextValue = require("../text-value");

describe('Text value object', () => {
    it('should contains a non empty title at construction time', () => {
        // Arrange
        const title = "this is a title"

        // Act
        const titleValue = new TextValue(title);

        // Arrange
        expect(titleValue.getValue()).toEqual(title);
    });

    it('should set to empty string when title is empty', () => {
        // Arrange & Act
        const titleValue = new TextValue(undefined);

        // Assert
        expect(titleValue.getValue()).toEqual('');
    });
});