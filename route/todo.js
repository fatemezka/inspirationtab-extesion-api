const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const getAllController = require('../controller/todo/getAll');
const getController = require('../controller/todo/get');
const completeController = require('../controller/todo/complete');
const putController = require('../controller/todo/put');
const deleteController = require('../controller/todo/delete');

router.get('/all', requestHandler(getAllController));
router.get('/:id', requestHandler(getController));
router.put('/complete/:id', requestHandler(completeController));
router.put('/:id', requestHandler(putController));
router.delete('/:id', requestHandler(deleteController));

module.exports = router;