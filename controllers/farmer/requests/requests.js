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

        sql = "SELECT * FROM selling_request where status=? ORDER BY id DESC";
        let q = conn.query(sql, [REQUEST_STATE.ACTIVE], (err, data1) => {
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