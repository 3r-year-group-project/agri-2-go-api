const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/farmer/registration/registration');
const fControllers = require('../../controllers/farmer/farmercontroller');

router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

router.route('/sellrequest/insert').post(fControllers.addNewRequest);

router.route('/sellrequest/getVegetableList').post(fControllers.getVegetableList);

router.route('/sellrequest/getEconomicCentersList').post(fControllers.getEconomicCentersList);
module.exports = router;