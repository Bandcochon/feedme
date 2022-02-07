
class ValueObject {
    #value;

    constructor(value) {
        this.#value = value;
        this.validateValue();
    }

    getValue() {
        return this.#value;
    }

    validateValue() {
        return false;
    }
}

module.exports = ValueObject;
