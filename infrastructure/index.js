const {MongoClient} = require("mongodb");
const {FeedModel} = require("../entities/values");
const {AlreadyExistsError} = require("../exceptions");

const DefaultTimeout = 100;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27012';

class FeedService {
    #client;
    #collection;

    /**
     *
     * @returns {Promise<void>}
     */
    async connect() {
        this.#client = await MongoClient.connect(`mongodb://${DB_HOST}:${DB_PORT}/feedme`, {
            socketTimeoutMS: DefaultTimeout,
            serverSelectionTimeoutMS: DefaultTimeout,
            connectTimeoutMS: DefaultTimeout
        });

        this.#collection = this.#client.db('feedme').collection('feedme');
    }

    /**
     *
     * @param model
     * @returns {Promise<null|FeedModel>}
     */
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

    async delete(guid) {
        this.#collection.deleteOne({guid});
    }
}

module.exports = {
    FeedService
};
