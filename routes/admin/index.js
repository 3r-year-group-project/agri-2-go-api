const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/admin/handleUsers/index');
const vegetableController= require('../../controllers/admin/handleVegetable/index');
const multer = require('multer')
const path = require('path')

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './src/assets/images/vegetable/')     // './src/assets/images/vehicle/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
router.route('/handluser/userlist')
    .get(userControllers.getUserList);

router.route('/handluser/blockuser/:ID')
    .get(userControllers.blockUser);
router.route('/handluser/unblockuser/:ID')
    .get(userControllers.unblockUser);
router.post('/handlevegetable/add',upload.single('image'),vegetableController.addVegetable);
router.route('/handlevegetable/getall')
    .get(vegetableController.getAllVegetable);
router.route('/handlevegetable/delete/:ID')
    .get(vegetableController.deleteVeg);
module.exports = router;