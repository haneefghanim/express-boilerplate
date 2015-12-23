var express = require('express'),
    router = express.Router(),
    errors = require('../lib/errors.js');

router.get('/example', function (req, res) {
    return res.json('Success!');
});

/**
 * Catch-all route for unknown API methods
 */
router.use(function(req, res, next) {
    return errors.handle(errors.NotFound(), res);
});

module.exports = router;