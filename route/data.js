const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const getAllController = require('../controller/data/getAll');
const getImageController = require('../controller/data/getImage');
const getQuoteController = require('../controller/data/getQuote');
const getMantraController = require('../controller/data/getMantra');

router.get('/all', requestHandler(getAllController));
router.get('/image', requestHandler(getImageController));
router.get('/quote', requestHandler(getQuoteController));
router.get('/mantra', requestHandler(getMantraController));

module.exports = router;