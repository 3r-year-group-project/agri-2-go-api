const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/stockbuyer/registration/register');
const requestController = require('../../controllers/stockbuyer/requestHandler/index');
const paymentController = require('../../controllers/stockbuyer/paymentHandler/index')
const orderController = require('../../controllers/stockbuyer/orderHandler/index')
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

router.route('/registration/shopdetails')
    .post(controllers.insertShopDetails);


router.route('/requesthandler/requestlist')
    .post(requestController.getRequestList);
router.route('/requesthandler/decline')
    .post(requestController.declineRequest);

router.route('/stocks/getstock')
    .post(requestController.getStockDetails);    

router.route('/stocks/addwastagedetails')
    .post(requestController.addWastageDetails);

router.route('/stocks/sellstocks')
    .post(requestController.sellStock); 

router.route('/transactions/getdetails')
    .post(requestController.getTransactionDetails)   
    
router.route('/wastagestocks/getdetails')
    .post(requestController.getWastageStocksDetails)    
    
router.route('')    
module.exports = router;