const cont = require('../controllers/user.controller');
const router = require('express').Router();

router.post('/', cont.register);


module.exports = router;