const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const getAllController = require('../controller/favorite/getAll');
const putController = require('../controller/favorite/put');
const deleteController = require('../controller/favorite/delete');

router.get('/all', requestHandler(getAllController));
router.put('/:id', requestHandler(putController));
router.delete('/:id', requestHandler(deleteController));

module.exports = router;