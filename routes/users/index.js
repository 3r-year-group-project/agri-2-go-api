const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/users/index');

/* GET users listing. */
router.route('/role/:id').get(controllers.getUserType);

module.exports = router;
