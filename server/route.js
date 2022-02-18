const {Router} = require('express');
const controllers = require('./controllers');

const router = Router();

router
    .get("", controllers.getAllFeeds)
    .post("", controllers.addFeed)
    .delete("/:guid", controllers.deleteFeed)
;

module.exports = router;
