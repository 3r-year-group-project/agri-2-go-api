const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/stockbuyer/registration/register');
router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

router.route('/registration/shopdetails')
    .post(controllers.insertShopDetails);

module.exports = router;