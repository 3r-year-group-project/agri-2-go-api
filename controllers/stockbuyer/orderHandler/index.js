const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');

exports.getOrders= async (req,res,next)=>{
    const sql = "SELECT  * FROM paid_orders left outer join user on user.id=paid_orders.buyer_id left outer join selling_request on selling_request.id=paid_orders.request_id left outer join selling_request_images on selling_request_images.selling_request_id=paid_orders.request_id where email=? group by request_id  order by paid_orders.order_status";
    conn.query(sql,[req.params.email],(err,data)=>{
        if (err) return next(new AppError(err,500));
        const sql1= "select u.first_name,u.last_name,l.address,l.latitude,l.longitude,u.id from user u inner join paid_orders p on p.farmer_id=u.id inner join location l on l.user_id=u.id" ;
        conn.query(sql1,[],(err,data1)=>{
            console.log(err)
            if (err) return next(new AppError(err,500));
            res.status(200).json(
               {status:'successfully get the orders details',
            data:data,
            farmers:data1}
            )
        })
       
    })

}

exports.updateOrderStatus=async (req,res,next)=>{
    sql = "UPDATE paid_orders SET comment_on_order=? , order_status=? where order_id=?";
            values = [req.body.reason, 'not delivered', req.body.id];
            conn.query(sql, values,(err,data1)=>{
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully update order status'
                })
            });
}
exports.updateMarkAsRecieved=async (req,res,next)=>{
    sql = "UPDATE paid_orders SET comment_on_order=? , order_status=? where order_id=?";
            values = [req.body.reason, 'not delivered', req.body.id];
            conn.query(sql, values,(err,data1)=>{
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully update order status'
                })
            });
}