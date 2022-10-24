const conn = require('../../../services/db')
const AppError = require('../../../utils/appError')

exports.minMaxPrice = (req, res, next) => {
    let request_ids = [-1]
    let sql = "SELECT id FROM `selling_request` WHERE economic_center=? AND vegetable=? AND status=2;"
    let values = [req.body.market, req.body.vegetable]
    let request_id = conn.query(sql, values, (err, request_id_data) => {
        if(err) return next(new AppError(err,500))
        request_id_data.forEach(element => request_ids.push(element.id));
        sql = "SELECT MIN((min_advance + remaining_payment) * ? / recieved_quantity) AS MinimumPrice, MAX((min_advance + remaining_payment) * ? / recieved_quantity) AS MaximumPrice, recieved_date as Date FROM `paid_orders` WHERE request_id IN (?) GROUP BY recieved_date;"
        values = [req.body.quantity, req.body.quantity, request_ids]
        let price_fluctuations = conn.query(sql, values, (err, data1) => {
            if(err) return next(new AppError(err,500))
            res.status(200).json({
                status: 'successfully got price fluctuations',
                data: data1
            });
        });
    });
};

exports.markets = (req, res, next) => {
    let sql = "SELECT name AS label, id FROM `economic_center`;"
    let q = conn.query(sql, (err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got markets',
            data: data1
        });
    });  
    console.log(q.sql);
};

exports.vegetables = (req, res, next) => {
    let sql = "SELECT name AS label, id FROM `vegetable`;"
    let q = conn.query(sql, (err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got vegetables',
            data: data1
        });
    });  
    console.log(q.sql);
};