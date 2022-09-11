const { query } = require('express');
const conn = require('../../../services/db')
const AppError = require('../../../utils/appError');

const REQUEST_STATE = {
    ACTIVE:1,
    ACCEPT:2, 
    CANCEL:3
}

exports.sentRequsts = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;

        sql = "SELECT request_id, price, quantity, economic_center, id as economic_center_id, vegetable, declines FROM (SELECT request_id, price, quantity, economic_center, vegetable, COUNT(request_id) as declines FROM selling_request INNER JOIN decline_request ON selling_request.id=decline_request.request_id WHERE farmer_id=? and status=? GROUP BY request_id) AS A INNER JOIN economic_center ON A.economic_center=economic_center.name;";
        let q = conn.query(sql, [id, REQUEST_STATE.ACTIVE], (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the sent requests',
                data: data1
            });
        });  
        console.log(q.sql);     
    }
    );  
};

exports.declinesLimit = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        let id = data[0].id;

        sql = "SELECT eco_center_id, COUNT(id) as shop_count FROM shop GROUP BY eco_center_id;";
        let q = conn.query(sql, (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the decline limit',
                data: data1
            });
        });  
        console.log(q.sql);     
    }
    );  
};