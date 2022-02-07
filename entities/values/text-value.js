const ValueObject = require("./value-object");

class TextValue extends ValueObject {
    constructor(value) {
        super(value || '');
    }
}

module.exports = TextValue;
