const { Console } = require('console');
const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/sendEmail');
const sendText = require('../../utils/sendText');

exports.FarmerRevenue = (req, res, next) => {
    conn.query('SELECT revenue_rate FROM revenue_rates WHERE user_type="3"',(err, result1) => {
        if (err) {
            return next(new AppError(err, 500));
        }
        let farmerRevenueRate = (100-result1[0].revenue_rate)/100;
        let sql = 'SELECT paid_orders.order_id,((SUM(paid_orders.min_advance+paid_orders.remaining_payment) - transport_request.payment)*'+farmerRevenueRate+') AS money , bank_account.bank_name , bank_account.branch_name, bank_account.account_name, bank_account.account_number FROM bank_account,paid_orders,transport_request WHERE paid_orders.payment_status = "RELEASED" AND paid_orders.farmer_id = bank_account.user_id AND paid_orders.fund_release_status="0" AND transport_request.selling_request_id=paid_orders.request_id GROUP BY paid_orders.order_id';
        console.log(sql);
        conn.query(sql,(err, result) => {
            if (err) {
                return next(new AppError(err, 500));
            }
        
           
    
            res.status(200).json({
                status: 'successfully retrieved users revenue',
                data : result
                });
            
        });
    });
    
};

exports.releaseFarmerFund = (req, res, next) => {
    console.log(req.params.id);
    let sql = 'UPDATE paid_orders SET fund_release_status="1" WHERE order_id = ?';
    let sql2 = conn.query(sql,[req.params.id],(err, result) => {
        if (err) {
            return next(new AppError(err, 500));
        }
        let sql1 = conn.query('SELECT farmer_id FROM paid_orders WHERE order_id=?',[req.params.id],(err, result3) => {
            let farmerId = result3[0].farmer_id;
            conn.query('SELECT email,phone FROM user WHERE id=?',[farmerId],(err,data6)=>{
                if(err) return next(new AppError(err,500));
                console.log(data6);
                let email = data6[0].email;
                let phone = data6[0].phone;
                sendEmail.sendEmail(email,'Agri2-GO','Your fund has been released. Please check your dashboard for more details.');
                sendText.sendText(phone,'Your fund has been released. Please check your dashboard for more details.');
            });
        });
        console.log(sql1.sql);
        res.status(200).json({
            status: 'successfully released funds',
            data : result
            });
    });
    console.log(sql2.sql);
};

exports.getTransporterRevenue = (req, res, next) => {
    conn.query('SELECT revenue_rate FROM revenue_rates WHERE user_type="7"',(err, result1) => {
        let transporterRate = (100 - result1[0].revenue_rate)/100;
        let sql = conn.query('SELECT transport_request.id,(transport_request.payment * '+transporterRate+') AS money , bank_account.bank_name, bank_account.branch_name, bank_account.account_name, bank_account.account_number FROM transport_request,bank_account WHERE bank_account.user_id=transport_request.transporter_id AND transport_request.fund_release_status = "0"',(err, result2) => {
            if (err) {
                return next(new AppError(err, 500));
            }
            
            res.status(200).json({
                status: 'successfully retrieved users revenue',
                data : result2
                });
        }); 

        console.log(sql.sql);

    });
    
};

exports.releaseTransporterFund = (req, res, next) => {
    let sql = 'UPDATE transport_request SET fund_release_status="1" WHERE id = ?';
    conn.query(sql,[req.params.id],(err, result) => {
        if (err) {
            return next(new AppError(err, 500));
        }
        conn.query('SELECT transporter_id FROM transport_request WHERE id=?',[req.params.id],(err, result3) => {
            if(err) return next(new AppError(err,500));
            let transporterId = result3[0].transporter_id;
        
            conn.query('SELECT email,phone FROM user WHERE id=?',[transporterId],(err,data6)=>{
                if(err) return next(new AppError(err,500));
                console.log(data6);
                let email = data6[0].email;
                let phone = data6[0].phone;
                sendEmail.sendEmail(email,'Agri2-GO','Your fund has been released. Please check your dashboard for more details.');
                sendText.sendText(phone,'Your fund has been released. Please check your dashboard for more details.');
            });

            });
        
        res.status(200).json({
            status: 'successfully released funds',
            data : result
            });
    });
};

exports.updateRevenueRate = (req, res, next) => {
    conn.query('UPDATE revenue_rates SET revenue_rate=? WHERE user_type=7',[req.body.transporterRate],(err, result1) => {
        if (err) {
            return next(new AppError(err, 500));
        }
        conn.query('UPDATE revenue_rates SET revenue_rate=? WHERE user_type=3',[req.body.farmerRate],(err, result2) => {
            if (err) {
                return next(new AppError(err, 500));
            }
            conn.query('UPDATE revenue_rates SET revenue_rate=? WHERE user_type=8',[req.body.wastageRate],(err, result3) => {
                if (err) {
                    return next(new AppError(err, 500));
                }
                res.status(200).json({
                    status: 'successfully updated revenue rates',
                    });
            });
    });
});
};