const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const getAllController = require('../controller/setting/getAll');
const putController = require('../controller/setting/put');
const deleteController = require('../controller/setting/delete');

router.get('/all', requestHandler(getAllController));
router.put('/:id', requestHandler(putController));
router.delete('/:id', requestHandler(deleteController));

module.exports = router;