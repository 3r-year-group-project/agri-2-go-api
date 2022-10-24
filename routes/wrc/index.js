const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/wrc/registration/register');
const dashboardController = require('../../controllers/users/dashboard/index')

router.route('/dashboard/best_selling_items')
    .get(dashboardController.bestSales)

router.route('/dashboard/user_counts')
    .get(dashboardController.userCounts)

router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

module.exports = router;