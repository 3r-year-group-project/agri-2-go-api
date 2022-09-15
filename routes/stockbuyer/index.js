const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/stockbuyer/registration/register');
const requestController = require('../../controllers/stockbuyer/requestHandler/index');
const paymentController = require('../../controllers/stockbuyer/paymentHandler/index')
router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

router.route('/registration/shopdetails')
    .post(controllers.insertShopDetails);

router.route('/requesthandler/requestlist')
    .post(requestController.getRequestList);

router.route('/requesthandler/decline')
    .post(requestController.declineRequest);
   
router.route('/paymethandler/pay')
    .post(paymentController.pay);

router.post('/webhook', paymentController.webhookhandler);

module.exports = router;