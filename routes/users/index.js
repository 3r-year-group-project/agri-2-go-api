const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/users/index');

// get user type
router.route('/role/:email').get(controllers.getUserType);

// get all notifications
router.route('/notifications/:email').get(controllers.getAllNotifications);

//clear read notification
router.route('/notifications/clear/:email').put(controllers.clearNotifications);

//get all revenue rates to display in payment page
router.route('/revenue/rates').get(controllers.getRevenueRates);

module.exports = router;
