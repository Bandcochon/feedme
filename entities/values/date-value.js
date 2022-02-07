const moment = require('moment');
const ValueObject = require("./value-object");
const {ValueError} = require("../../exceptions");

class DateValue extends ValueObject {
    validateValue() {
        const result = moment(this.getValue());
        if (result.isValid())
            return true;

        throw new ValueError(`"${this.getValue()}" is not a valid date`);
    }

    getValue() {
        return new Date(super.getValue()).toUTCString();
    }
}

module.exports = DateValue;