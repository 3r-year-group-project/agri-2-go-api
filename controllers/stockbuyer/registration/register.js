const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');

//update payment plan
exports.paymentplanInsert = (req, res, next) => {
    let paymentplan = 0;
    if(req.body.package == "free"){
        paymentplan = 1;
    }else if(req.body.package == "basic"){
        paymentplan = 2;
    }else if(req.body.package == "professional"){
        paymentplan = 3;
    }
    conn.query("UPDATE user SET payment_plan=? WHERE id=?", [paymentplan, req.body.id],((err, res2)=>{
        if(err) return next(new AppError(err,500));
        res.status(204).json({
            status: "successfully update the user paymentplan"
        });
    }));
};

exports.updateCardPayment = (req,res,next)=>{
    let sql = "SELECT * FROM payment_card WHERE user_id=?";
    var values;
    conn.query(sql,[req.body.id],(err, data)=>{
        console.log(data);
        if(!(data && (data.length >0))){
            if(err) return next(new AppError(err,500));
            sql = "INSERT INTO `payment_card` (holder, card_number, expiry_date, cvv, user_id) VALUES (?, ?, ?, ?, ?)"; 
            values = [req.body.holder, req.body.cardNumber, req.body.expiry,req.body.cvv, req.body.id];
            let q = conn.query(sql,values,(err,data)=>{
                if(err) return next(new AppError(err,500));
                res.status(201).json({ status:"successfully add the payment details"});
                });
                
        }else{
            sql = "UPDATE payment_card SET holder=? , card_number=?, expiry_date=?, cvv=? WHERE user_id=?";
            values = [req.body.holder, req.body.cardNumber, req.body.expiry,req.body.cvv, req.body.id];
            conn.query(sql, values,(err,data1)=>{
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully updateCardPayment details'
                })
            });

        }
    })
};

exports.updatePersonalDetails = (req, res, next) => {
   let sql = "UPDATE user SET first_name = ? , last_name = ? , user_type = ? , address1 = ? , address2 = ? , create_date=CURDATE(),city = ? WHERE id = ?";
   let values = [
        req.body.firstName,
        req.body.lastName,
        req.body.userType,
        req.body.address1,
        req.body.address2 == "empty" ? "" : req.body.address2,
        req.body.city,
        req.body.id

   ];
   console.log(values);
   var q = conn.query(sql,values,(err,data) => {
         if(err) return next(new AppError(err,500));
        res.status(204).json({
            status:"successfully finished personal details"
        }           
        );
   });
   console.log(q.sql) 
}

exports.insertShopDetails = (req, res, next) => {

    
    let sql = "INSERT INTO shop(shop_name, shop_address, open_time, close_time, user_id) VALUES (?,?,?,?,?)";
    let values = [
        req.body.shopName,
        req.body.shopAddress,
        req.body.startTime,
        req.body.endTime,
        req.body.id
    ];

    console.log(values);

    conn.query(sql,values,(err,data)=>{
        if(err) return next(new AppError(err,500));
        sql1 = "UPDATE user SET user_type = ? , create_date=CURDATE() WHERE id = ?";
        let v1 = [
            req.body.userType,
            req.body.id

        ];
        conn.query(sql1,v1,(err1,data2)=>{
            res.status(201).json({
                status:"successfully finished shop details"
            });
        });
    });

    
    

}