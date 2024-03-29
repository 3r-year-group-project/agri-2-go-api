const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');


exports.getRequestList=(req,res,next)=>{
    
    const sql = "select name from economic_center where id in (select DISTINCT eco_center_id from shop inner join user ON user.id=shop.user_id where email=?)";
    conn.query(sql,[req.body.email],(err,data1)=>{
        if (err){console.log(err) 
        return next(new AppError(err,500));}
     
        const sql1 ="select user.first_name,user.last_name,user.id,selling_request.id as selling_req_id,price,date,deal_date,code,quantity,selling_request.economic_center,status,vegetable,farmer_id from selling_request inner join user on user.id=selling_request.farmer_id where selling_request.economic_center=? and selling_request.status=? and selling_request.id not in (select decline_request.request_id from decline_request inner join user on user.id=decline_request.shop_id where user.email=?)";
        conn.query(sql1,[data1[0].name,1,req.body.email],(err,data2)=>{
            if (err) {console.log(err) 
                return next(new AppError(err,500));}
            const sql2="select * from selling_request_images where selling_request_id in (select id from selling_request where economic_center=?and selling_request.status=? and id not in (select request_id from decline_request inner join user on user.id=decline_request.shop_id where user.email=?) )";
            conn.query(sql2,[data1[0].name,1,req.body.email],(err,data3)=>{
                if (err) {console.log(err) 
                    return next(new AppError(err,500));}
                res.status(200).json(
                    { status:'successfully get the images and farmer request details',
                     data:data2,
                     img:data3
                    }
                 )
            })
            
            
            ;})



        
    })

}
exports.declineRequest=(req,res,next)=>{
    const sql = "INSERT INTO decline_request (request_id,shop_id) values(?,?)";
    const sql1 ="select id from user where email=?"
    conn.query(sql1,[req.body.email],(err,data1)=>{
       
        if (err) return next(new AppError(err,500))
        conn.query(sql,[req.body.id,data1[0].id],(err,data2)=>{
          
            if (err) return next(new AppError(err,500))
                res.status(200).json(
                    { status:'successfully add decline request details',
                     data:data2,
                     
                    }
                 )
          
    })})
}

exports.getStockDetails=(req,res,next)=>{
    console.log("siudhfiudsfhidsu!!!!!!!!!!!!!!!!!!")
    let sql = "SELECT id FROM user WHERE email=?"
    return new Promise((resolve)=>{
        conn.query(sql, [req.body.email], (err, data) => {
            if(err) return next(new AppError(err,500));
            let id = data[0].id;  
            console.log("ID is : "+id) 

            sql = "SELECT s.id,s.price,s.quantity,s.date,s.economic_center,s.vegetable,s.deal_date,u.first_name FROM selling_request s,paid_orders p,user u WHERE p.request_id = s.id AND u.id = s.farmer_id AND s.status = 2 AND p.buyer_id = ?";
            let q = conn.query(sql, [id], (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the stock',
                data: data1
            });
        });  
        console.log(q.sql); 
        }
        );
        
    });
}



exports.addWastageDetails=(req,res,next)=>{
    console.log(req.body.id)
    console.log(req.body.data.quantity)
    const sql = "INSERT INTO wastage_details (order_id,vegetable,quantity,quality,price) values(?,?,?,?,?)";
    const sql1 ="SELECT quantity from selling_request WHERE id=? "
    const sql2 = "UPDATE selling_request SET quantity=? WHERE ID=?";
    conn.query(sql,[req.body.id,req.body.vegetable,req.body.data.quantity,req.body.data.quality,req.body.data.price],(err,data1)=>{
       
        if (err) return next(new AppError(err,500))
        conn.query(sql1,[req.body.id],(err,data2)=>{
            console.log("Previous Quantity : "+data2[0].quantity)
            console.log("Request Quantity : "+req.body.data.quantity)
            let newQuantity = data2[0].quantity - req.body.data.quantity;
            console.log("New Quantity : "+newQuantity);
            conn.query(sql2,[newQuantity,req.body.id],(err,data2)=>{

                if (err) return next(new AppError(err,500))
                res.status(200).json(
                    { status:'successfully added wastage details',
                     data:data2,
                     
                    }
                 )
            })

          
            
          
    })})
}

exports.sellStock=(req,res,next) => {
    const sql = "INSERT INTO stocks_selling_details (order_id,price,quantity) values(?,?,?)";
    const sql1 ="SELECT quantity from selling_request WHERE id=? "
    const sql2 = "UPDATE selling_request SET quantity=? WHERE ID=?";
    console.log(req.body.id)

    conn.query(sql,[req.body.id,req.body.data.price,req.body.data.quantity],(err,data1)=>{
       
        if (err) return next(new AppError(err,500))
        conn.query(sql1,[req.body.id],(err,data2)=>{
            console.log("Previous Quantity : "+data2[0].quantity)
            console.log("Request Quantity : "+req.body.data.quantity)
            let newQuantity = data2[0].quantity - req.body.data.quantity;
            console.log("New Quantity : "+newQuantity);
            conn.query(sql2,[newQuantity,req.body.id],(err,data2)=>{

                if (err) return next(new AppError(err,500))
                res.status(200).json(
                    { status:'successfully sold the stock',
                     data:data2,
                     
                    }
                 )
            })

          
            
          
    })})

}

exports.getTransactionDetails = (req,res,next) => {
    console.log("Stock buyer tarsanctions!!!")
    let sql1 = "SELECT id FROM user WHERE email=?"
        conn.query(sql1, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;


        let sql2 = "SELECT p.date_time,p.status,p.min_advance,u.first_name,u.last_name FROM paid_orders p,user u WHERE p.buyer_id = ? AND p.farmer_id=u.id" 
        conn.query(sql2,[id],(err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got the stock buyer transactions',
            data: data1
        });
    }); 



        })

    

}


exports.getWastageStocksDetails = (req,res,next) => {
    console.log("Stock buyer wastage details loading!!!!")
    let sql1 = "SELECT id FROM user WHERE email=?"
    conn.query(sql1, [req.body.email], (err, data) => {
    if(err) return next(new AppError(err,500));
    console.log(data);
    let id = data[0].id;

    let sql2 = "SELECT o.order_date,o.order_name,o.pickup_date,o.status,d.quality,d.quantity,d.price,u.first_name,u.last_name FROM wastage_orders o,wastage_details d,user u WHERE o.order_id=d.id AND o.wrc_id=u.id AND o.seller_id = ?";
    conn.query(sql2,[id],(err, data1) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully got the stock buyer wastage stock details',
            data: data1
        });
    }); 



        })
}