const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/farmer/registration/registration');

router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

router.route('/requests/sentrequests')
    .post(requstsControllers.sentRequsts);

router.route('/requests/declines_limit')
    .post(requstsControllers.declinesLimit);

module.exports = router;