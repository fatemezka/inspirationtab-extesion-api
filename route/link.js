const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const getAllController = require('../controller/link/getAll');
const putController = require('../controller/link/put');
const deleteController = require('../controller/link/delete');

router.get('/all', requestHandler(getAllController));
router.put('/:id', requestHandler(putController));
router.delete('/:id', requestHandler(deleteController));

module.exports = router;