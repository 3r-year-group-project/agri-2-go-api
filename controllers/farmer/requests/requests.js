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

        sql = "SELECT S.id as request_id, S.price, S.quantity, S.vegetable, E.id as economic_center_id, E.name as economic_center FROM selling_request as S INNER JOIN economic_center as E ON s.economic_center=e.name WHERE S.farmer_id=? AND S.status=?;";
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

exports.resendRequestStateUpdate = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;

        sql = "UPDATE selling_request SET status=? WHERE id=?;";
        let q = conn.query(sql, [REQUEST_STATE.CANCEL, req.body.id], (err, data1) => {
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

exports.declinesCount = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        let id = data[0].id;

        sql = "SELECT request_id, COUNT(id) AS declines_count FROM decline_request GROUP BY request_id;";
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