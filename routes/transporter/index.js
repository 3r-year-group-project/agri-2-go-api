const express = require('express');
const router = express.Router();
const controllers = require('../../controllers/transporter/registration/register');
const tControllers = require('../../controllers/transporter/transportercontroller');
const dashboardController = require('../../controllers/users/dashboard/index')
const multer = require('multer')
const path = require('path')

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/assets/images/vehicle/')     // './src/assets/images/vehicle/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

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

router.post('/vehicle/insert',upload.single('image'),tControllers.addNewVehicle);

router.route('/vehicle/getall')
    .post(tControllers.getVehicle);

router.route('/vehicle/delete')
    .post(tControllers.removeVehicle);

router.route('/request/getall')
    .post(tControllers.getAllRequest);

router.route('/request/accept')
    .post(tControllers.takeRequest);

router.route('/request/decline')
    .post(tControllers.declineRequest);

router.route('/chargers/exist/:email')
    .get(tControllers.checkExistChargers);

router.route('/Chargers/setcharges')
    .post(tControllers.setChargers);
    
router.route('/request/getall/accepted')
    .post(tControllers.getAllAcceptedRequest);

router.route('/request/starttrip')
    .post(tControllers.startTrip);


module.exports = router;