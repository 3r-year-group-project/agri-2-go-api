const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/sendEmail');
const sendText = require('../../utils/sendText');

function getUserID(email){
    let sql = "SELECT id FROM user WHERE email=?"
    return new Promise((resolve)=>{
        conn.query(sql, [email], (err, data) => {
            if(err) return next(new AppError(err,500));
            resolve(data[0].id);    
        }
        );
        
    });
    
}

exports.addNewRequest = (req, res, next) => {
    let status = 1;
    console.log("udhskjbgfuisdhfuiodshf");
    let randomCode = Math.floor(1000 + Math.random() * 9999);
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;
        try {

            // to declare some path to store your converted image
            const path = './public/images/requested_vegetables/'+Date.now()+req.body.fileName;
            const path1 = 'http://localhost:3002/images/requested_vegetables/'+Date.now()+req.body.fileName;
            console.log(req.headers.host);
            const imgdata = req.body.base64URL;
    
            // to convert base64 format into random filename
            const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            require("fs").writeFileSync(path, base64Data,  {encoding: 'base64'});

            console.log("Attention!!!!!!!!!!!! "+req.body.fileName)
            console.log("Date!!!!!!!!!!!!!!!!!!!!"+req.body.date);

            
            sql = "INSERT INTO selling_request (price,quantity,economic_center,vegetable,farmer_id,status,deal_date,code) VALUES (?,?,?,?,?,?,?,?)";
            console.log("Query running??");
            let values = [req.body.price, req.body.quantity,req.body.ecocenter,req.body.vegetable,id,status,req.body.date,randomCode];
            let q = conn.query(sql, values, function(err, result, fields){
            if(err) return next(new AppError(err,500));
            
            let sql2 = "INSERT INTO selling_request_images (image,selling_request_id,vegetable) VALUES (?,?,?)";
            let values1 = [path1,result.insertId,req.body.vegetable];
            let q1 = conn.query(sql2, values1, function(err, result, fields){
            if(err) return next(new AppError(err,500));
            res.status(201).json({
            status: 'successfully add the selling request images'
            });
            
            
        });
            
        });

        conn.query('SELECT id FROM economic_center WHERE name=?',
                [req.body.ecocenter],(err, data3) => {
                    if(err) return next(new AppError(err,500));
                    let ecocenterId = data3[0].id;
                    let sql3 = "SELECT user_id FROM shop WHERE eco_center_id=?";
                    conn.query(sql3,[ecocenterId],(err, data4) => {
                        if(err) return next(new AppError(err,500));
                        data4.map((item) => {
                            conn.query('SELECT email,phone FROM user WHERE id=?',[item.user_id],(err,data6)=>{
                                if(err) return next(new AppError(err,500));
                                console.log(data6);
                                let email = data6[0].email;
                                let phone = data6[0].phone;
                                let message = "You have a new request from "+req.body.email;
                                sendEmail.sendEmail(email,'Agri2-GO','You have a new selling request from a farmer. Please check your dashboard for more details.');
                                sendText.sendText(phone,'You have a new selling request from a farmer. Please check your dashboard for more details.');
                            });
                            
                            let sql4 = "INSERT INTO notification (user_id,alert) VALUES (?,?)";
                            conn.query(sql4,[item.user_id,2],(err, data5) => {
                                if(err) return next(new AppError(err,500));
                            });
                        });
                    });
                }
                );
        
        
        
        
        
    
    
        } catch (e) {
            console.log(e);
            next(e);
        }
        
    }
    );
    
};

exports.getVegetableList = (req, res, next) => {

    console.log("Running!!!!!!!!!!!!!!!!")
    
        sql = "SELECT * FROM vegetable";
        let q = conn.query(sql,(err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully got the vege list',
                data: data1
            });
        });  
        console.log(q.sql);    

    };

    exports.getEconomicCentersList = (req, res, next) => {
    
        sql = "SELECT * FROM economic_center";
        let q = conn.query(sql,(err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully got the economic centers list',
                data: data1
            });
        });  
        console.log(q.sql);    

    };


    exports.getFarmerDetails = (req, res, next) => {
        let sql = "SELECT user.first_name , user.last_name, location.address , bank_account.bank_name, bank_account.branch_name , bank_account.account_name, bank_account.account_number FROM user,location,bank_account WHERE user.id = bank_account.user_id AND user.id = location.user_id AND user.email =  ?";
        let q = conn.query(sql, [req.params.email], (err, data) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully got the farmer details',
                data: data
            });
        });
    };

    exports.updateFarmerLocation = async (req, res, next) => {
        let farmerId = await getUserID(req.body.email);
        let values = [req.body.address,req.body.lon, req.body.lat,farmerId];
        let s = conn.query('UPDATE location SET address=?,longitude=?,latitude=? WHERE user_id=?',values,(err, data) => {
            if(err) return next(new AppError(err,500));
            res.status(204).json({
                status: 'successfully updated the farmer location',
                data: data
            });
        });
        console.log(s.sql);
    };

    exports.changeFarmerUserDetails = async (req, res, next) => {
        console.log("Running!!!!!!!!!!!!!!!!");
        console.log(req.body);
        let farmerId = await getUserID(req.body.email);
        let sql = "UPDATE user SET ";
        let values = [];
        let userUpdateStatus = false;
        if(req.body.firstName){
            sql+= "first_name=?";
            values.push(req.body.firstName);
            userUpdateStatus = true;
        }
        if(req.body.lastName && userUpdateStatus){
            sql+= ", last_name=?";
            values.push(req.body.lastName);
            userUpdateStatus = true;
        }else if(req.body.lastName && !userUpdateStatus){
            sql+= " last_name=?";
            values.push(req.body.lastName);
            userUpdateStatus = true;
        }
        if(userUpdateStatus){
            sql+= " WHERE id=?";
            values.push(farmerId);
            console.log("Running!!!!!!!!!!!!!!!! sql")
            let s = conn.query(sql,values,(err, data) => {
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully updated the farmer details',
                    data: data
                });
            });
        }else{
            res.status(204).json({
                status: 'farmer details did not update',
                
            });
        }
    };

    exports.changeFarmerBankDetails = async (req, res, next) => {
        console.log(req.body);
        let farmerId = await getUserID(req.body.email);
        let sql = "UPDATE bank_account SET ";
        let values = [];
        let userUpdateStatus = false;
        if(req.body.bankName != ''){
            sql+= "bank_name=?";
            values.push(req.body.bankName);
            userUpdateStatus = true;
        }
        if(req.body.branchName && userUpdateStatus){
            sql+= ", branch_name=?";
            values.push(req.body.branchName);
            userUpdateStatus = true;
        }else if(req.body.branchName && !userUpdateStatus){
            sql+= " branch_name=?";
            values.push(req.body.branchName);
            userUpdateStatus = true;
        }
        if(req.body.accountName && userUpdateStatus){
            sql+= ", account_name=?";
            values.push(req.body.accountName);
            userUpdateStatus = true;
        }else if(req.body.accountName && !userUpdateStatus){
            sql+= " account_name=?";
            values.push(req.body.accountName);
            userUpdateStatus = true;
        }
        if(req.body.accountNumber && userUpdateStatus){
            sql+= ", account_number=?";
            values.push(req.body.accountNumber);
            userUpdateStatus = true;
        }else if(req.body.accountNumber && !userUpdateStatus){
            sql+= " account_number=?";
            values.push(req.body.accountNumber);
            userUpdateStatus = true;
        }
        if(userUpdateStatus){
            sql+= " WHERE user_id=?";
            values.push(farmerId);
            let s = conn.query(sql,values,(err, data) => {
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully updated the farmer bank details',
                    data: data
                });
            });
            console.log(s.sql);
        }else{
            res.status(200).json({
                status: 'farmer bank details did not update',
            });
        }
    };

    exports.getTransactionDetails = (req,res,next) => {
        console.log("Transactions are running!!!!!!!!")
        let sql1 = "SELECT id FROM user WHERE email=?"
        conn.query(sql1, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;

        let sql2 = "SELECT p.date_time,p.min_advance,p.status,u.first_name,u.last_name FROM paid_orders p,user u WHERE p.farmer_id = ? AND p.buyer_id = u.id"; 
        let values = [id]
        let q = conn.query(sql2, values, (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the transactions',
                data: data1
            });
        }); 

        
        })

    }

    exports.getSalesDetails = async (req, res, next) => {

        console.log("Ammo ammo mama duwanoo!")
        let sql1 = "SELECT id FROM user WHERE email=?"
        conn.query(sql1, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;

        let sql2 = "SELECT status,vegetable,price,initial_quantity FROM selling_request WHERE farmer_id = ?"
        let values = [id]
        let q = conn.query(sql2, values, (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully sales details obtained',
                data: data1
            });
        });

        })
    
    }