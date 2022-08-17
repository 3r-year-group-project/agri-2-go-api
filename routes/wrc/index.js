const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/wrc/registration/register');
router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

module.exports = router;