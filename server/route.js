const {Router} = require('express');
const controllers = require('./controllers');

const router = Router();

router
    .get("", controllers.getAllFeeds)
    .post("", controllers.addFeed)
;

module.exports = router;
