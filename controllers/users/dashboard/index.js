const { query } = require('express');
const conn = require('../../../services/db')
const AppError = require('../../../utils/appError');

exports.bestSales = (req, res, next) => {
    let sql = "SELECT vegetable, SUM(quantity) as `total_sales` FROM `selling_request` WHERE status=2 GROUP BY vegetable ORDER BY total_sales;";
    let q = conn.query(sql, (err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got best sales',
            data: data1
        });
    });  
    console.log(q.sql);
};

exports.userCounts = (req, res, next) => {
    let sql = "SELECT user_type, COUNT(user_type) AS user_count FROM `user` WHERE user_type!=1 GROUP BY user_type UNION ALL SELECT 'SUM' user_type, COUNT(user_type) FROM `user`;"
    let q = conn.query(sql, (err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got user counts',
            data: data1
        });
    });  
    console.log(q.sql);
};