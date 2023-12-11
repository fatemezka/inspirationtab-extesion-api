const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const addController = require('../controller/search/add');

router.post('/', requestHandler(addController));

module.exports = router;