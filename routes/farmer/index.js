const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/farmer/registration/registration');

router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);
module.exports = router;