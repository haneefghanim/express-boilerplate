var express = require('express'),
    router = express.Router(),
    errors = require('../lib/errors.js');

router.get('/', function(req, res) {
    return res.send('Hello world!');
});

/**
 * Catch-all route for unknown urls.
 */
router.use(function(req, res, next) {
    return errors.display(errors.NotFound(), res);
});

module.exports = router;