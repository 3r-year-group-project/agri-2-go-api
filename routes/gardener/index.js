const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/gardener/registration/registration');
router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

module.exports = router;