const {MongoClient} = require("mongodb");
const {FeedModel} = require("../entities/values");
const {AlreadyExistsError} = require("../exceptions");

const DefaultTimeout = 100;

class FeedService {
    #client;
    #collection;

    async connect() {
        this.#client = await MongoClient.connect('mongodb://localhost:27017', {
            socketTimeoutMS: DefaultTimeout,
            serverSelectionTimeoutMS: DefaultTimeout,
            connectTimeoutMS: DefaultTimeout
        });

        this.#collection = this.#client.db('feedme').collection('feedme');
    }

    async save(model) {
        const guid = model.guid.getValue();
        const existingModel = await this.findByOneId(guid);

        if (existingModel !== null) {
            throw new AlreadyExistsError(`The feed ID=${guid} already exists into database`);
        }

        const _model = model.toObject();
        await this.#collection.insertOne(_model);
        return await this.findByOneId(guid);
    }

    /**
     * Get all feeds from the database and returns them as a list of FeedModel
     *
     * @returns {Promise<*>}
     */
    async getAllFeeds() {
        const feeds = await this.#collection
            .find()
            .toArray();

        return feeds.map(feed => new FeedModel(feed));
    }

    async findByOneId(guid) {
        const result = await this.#collection.findOne({guid});

        if (result === null) {
            return null;
        }

        return new FeedModel(result);
    }
}

module.exports = {
    FeedService
};
