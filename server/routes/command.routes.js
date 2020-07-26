const cont = require('../controllers/command.controller')
const router = require('express').Router();

router.patch('/:uid', cont.newCommand);

module.exports = router;