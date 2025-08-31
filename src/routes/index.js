const router = require('express').Router();

// routes
router.use('/catways', require('./catways'));

module.exports = router;
