const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/farmer/registration/registration');

const fControllers = require('../../controllers/farmer/farmercontroller');
const requstsControllers = require('../../controllers/farmer/requests/requests');


router.route('/registration/paymentPlan')
    .post(controllers.paymentplanInsert);

router.route('/registration/cardDetails')
    .post(controllers.updateCardPayment);

router.route('/registration/personDetails')
    .post(controllers.updatePersonalDetails);

router.route('/sellrequest/insert')
.post(fControllers.addNewRequest);

router.route('/sellrequest/getVegetableList')
.post(fControllers.getVegetableList);

router.route('/sellrequest/getEconomicCentersList')
.post(fControllers.getEconomicCentersList);

router.route('/sellrequest/getEconomicCentersList').post(fControllers.getEconomicCentersList);

router.route('/requests/sentrequests')
    .post(requstsControllers.sentRequsts);

router.route('/requests/orders')
    .post(requstsControllers.orders);
    
router.route('/requests/resendrequest')
    .post(requstsControllers.resendRequestStateUpdate);

router.route('/requests/declines_limit')
    .post(requstsControllers.declinesLimit);

router.route('/transactions/getdetails')
    .post(fControllers.getTransactionDetails)    

router.route('/getFarmerDetails/:email')
    .get(fControllers.getFarmerDetails);

router.route('/updateLocation')
    .post(fControllers.updateFarmerLocation);

router.route('/updateBankDetails')
    .post(fControllers.changeFarmerBankDetails);

router.route('/updateFarmerDetails')
    .post(fControllers.changeFarmerUserDetails);


    
router.route('/requests/declines_count')
    .post(requstsControllers.declinesCount);

router.route('/requests/getBestTransporters')
    .post(requstsControllers.getBestTransporters);

router.route('/requests/getLocation/:email')
    .get(requstsControllers.getLocation);

router.route('/requests/sendRequest')
    .post(requstsControllers.sendRequest);

router.route('/sales/getsales')
    .post(fControllers.getSalesDetails)    

module.exports = router;