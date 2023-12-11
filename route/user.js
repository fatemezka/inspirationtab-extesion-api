const router = require('express').Router({ mergeParams: true });

const requestHandler = require('../middleware/requestHandler');

const infoController = require('../controller/user/get');
const loginController = require('../controller/user/login');
const checkController = require('../controller/user/check');
const updateController = require('../controller/user/update');
const confirmController = require('../controller/user/confirm');

router.get('/info', requestHandler(infoController));
router.post('/login', requestHandler(loginController));
router.post('/check', requestHandler(checkController));
router.put('/update', requestHandler(updateController));
router.get('/confirm/:user_id', requestHandler(confirmController));

module.exports = router;