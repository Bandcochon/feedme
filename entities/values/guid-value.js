const crypto = require('crypto');
const {ValueError} = require("../../exceptions");
const ValueObject = require("./value-object");

class GuidValue extends ValueObject {
    constructor(value) {
        super(value || crypto.randomUUID());
    }

    validateValue() {
        const regex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', 'gm');

        if (! regex.test(this.getValue())) {
            throw new ValueError(`'${this.getValue()} is not a valid UUID`);
        }
    }
}

module.exports = GuidValue;
