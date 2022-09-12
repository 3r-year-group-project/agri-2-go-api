const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/users/index');

// get user type
router.route('/role/:email').get(controllers.getUserType);

// get all notifications
router.route('/notifications/:email').get(controllers.getAllNotifications);

module.exports = router;
