const validUrl = require('valid-url');
const ValueObject = require("./value-object");
const {ValueError} = require("../../exceptions");

class LinkValue extends ValueObject {
    validateValue() {
        const value = this.getValue();
        const isUri = validUrl.isWebUri(value) !== undefined;
        if (!isUri) {
            throw new ValueError(`'${this.getValue()}' is not a valid URL`);
        }
    }
}

module.exports = LinkValue;
