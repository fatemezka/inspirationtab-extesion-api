const router = require('express').Router({ mergeParams: true });

 router.use('/data', require('./data'));
 router.use('/todo', require('./todo'));
 router.use('/link', require('./link'));
 router.use('/user', require('./user'));
 router.use('/favorite', require('./favorite'));
 router.use('/search', require('./search'));
 router.use('/setting', require('./setting'));

module.exports = router;
