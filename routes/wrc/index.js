const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/wrc/registration/register');
const wastageController = require('../../controllers/wastage/index');
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

module.exports = router;