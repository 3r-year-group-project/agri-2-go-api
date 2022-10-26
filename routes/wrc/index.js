const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/wrc/registration/register');
const wastageController = require('../../controllers/wastage/index');

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

    // wastage types routes
router.route('/wastage/:id')
    .post(wastageController.updateWastageTypes);
router.route('/wastage/:id')
    .delete(wastageController.removeWastageTypes);
router.route('/wastage/:id')
    .get(wastageController.getSingleWastageType);
router.route('/wastage')
    .get(wastageController.getWastageTypes); 
router.route('/wastage')
    .post(wastageController.createWastageTypes);
router.route('/wastage_orders')
    .get(wastageController.getWastageOrders);
router.route('/wastage_orders')
    .post(wastageController.wastageOrderFunctions);
router.route('/wastage_details')
    .get(wastageController.getWastageDetails)
router.route('/wastage_detail_item_info/:id')
    .get(wastageController.getWastageDetailsOrderId)
router.route('/wastage_detail_user/:id')
    .get(wastageController.getUserInfo)
router.route('/wastage_add_request')
    .post(wastageController.addWastageOrderRequest)
router.route('/wastage_decline_request')
    .post(wastageController.declineWastage)
router.route('/wastage_search')
    .post(wastageController.searchForWastageItems)
router.route('/order_list_status_filter')
    .post(wastageController.getWastageOrdersStatus)
router.route('/wastage_orders/getOrderDetails') 
    .post(wastageController.getWastageOrderDetails)

module.exports = router;