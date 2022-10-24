const conn = require('../../services/db');
const AppError = require('../../utils/appError');

exports.getUserType = (req, res, next) => {
    conn.query('SELECT id,user_type FROM user WHERE email=?',[req.params.email],(err,data,fields) => {
        if(err) return next(new AppError(err));
        if(!(data && (data.length >0))){
            
            let sql = "INSERT INTO user(email,user_type) VALUES (?,0)";
            conn.query(sql,[req.params.email],(err,res2) => {
                if(err) return next(new AppError(err,500));
                res.status(201).json(
                    {
                        status : 'successfully add new user into the database',
                        data : {
                            user_type : 0,
                            id : data.id
                        }
                    }
                );
            });

        }else{
            res.status(200).json({
                status : 'get the user from the database',
                data : data
            });
        }
        
        
    });
    
};

exports.getWastageOrders = async(req, res, next) =>{
    console.log('reaches')
    
    let sqlQuery = "SELECT * FROM wastage_orders";
    conn.query(sqlQuery,(err, results)=>{
        if(err) return next(new AppError(err));
        res.status(200).json({
            status: 'GetPaidOrders',
            data: results
        })
        console.log(results)
    })
}

exports.wastageOrderFunctions = async(req, res, next) => {
    const {operation, orderId} = req.body
    console.log(operation)
    console.log(orderId)
    switch(operation){
        case "MarkCollected":
           {
                console.log('exec')
                let sqlQuery = `UPDATE wastage_orders SET status = 'completed' WHERE order_id = ${orderId};`;
                conn.query(sqlQuery,(err, results)=>{
                    if(err) return next(new AppError(err));
                    
                        res.status(200).json({
                            status: 'worders_status_change',
                            data: results
                        })
                    console.log(results)
                })
            };
        
            // case "Cancel":
            //     {
            //          console.log('exec')
            //          let sqlQuery = `UPDATE wastage_orders SET status = 'cancelled' WHERE order_id = ${orderId};`;
            //          conn.query(sqlQuery,(err, results)=>{
            //              if(err) return next(new AppError(err));
                         
            //                  res.status(200).json({
            //                      status: 'worders_status_change',
            //                      data: results
            //                  })
            //              console.log(results)
            //          })
            //      };
        break;
    }

}  

exports.getWastageDetails = async(req, res, next)=> {
    let sqlQuery = "SELECT * FROM wastage_details";
    conn.query(sqlQuery,(err, results)=>{
        if(err) return next(new AppError(err));
        res.status(200).json({
            status: 'GetPaidOrders',
            data: results
        })
        console.log(results)
    })
}

exports.getWastageDetailsOrderId = async(req,res, next)=>{

    const order_id = req.params 
    let sqlQuery = `SELECT * FROM wastage_details WHERE id=${order_id.id}`
    conn.query(sqlQuery,(err, results)=>{
        if(err) console.log(err);
        res.status(200).json({
            status: 'GetPaidOrders',
            data: results
        })
    })
}

exports.getUserInfo = async(req, res)=>{

    const order_id = req.params
    // let sqlQuery = `SELECT first_name, last_name FROM user WHERE id = (SELECT buyer_id FROM paid_orders WHERE
    // request_id = (SELECT order_id FROM wastage_details WHERE id=${order_id.id}))`

    let sqlQuery = `SELECT id,first_name,last_name,address1, city FROM user WHERE id=(SELECT buyer_id FROM paid_orders WHERE request_id = (SELECT order_id FROM wastage_details WHERE id=${order_id.id}))`
    conn.query(sqlQuery, (err, results)=>{
        if(err) console.log(err);
        res.status(200).json({
            status: 'GetPaidOrders',
            data: results
        })
        console.log(results, 'sellersInfo')
    })
}

exports.addWastageOrderRequest = async(req, res, next)=>{

     const {userInfo, orderInfo, pickUpDate, sellerInfo, wastage_details_id} = req.body

     console.log(userInfo)
     console.log(orderInfo)
     console.log(pickUpDate)
     console.log(sellerInfo, 'sellerInfo')
     console.log(wastage_details_id, 'wastage+details_id')

     let userId;
     let currentDate = new Date().toJSON().slice(0, 10);

     
     let sqlQuery1 = `SELECT id FROM user WHERE email like '${userInfo.email}'`
     await conn.query(sqlQuery1, (err, results)=>{
        if(err) return console.log(err)

        userId = results
        console.log(userId[0].id, 'userId')

        addRequestOrder(userInfo, orderInfo, pickUpDate, sellerInfo, wastage_details_id, userId)
      
        // res.status(200).json({
        //     status: 'GetPaidOrders',
        //     data: results
        // })

     })

        

const addRequestOrder = async(userInfo, orderInfo, pickUpDate, sellerInfo, wastage_details_id, userId)=>{
    let sqlQuery2 = `INSERT INTO wastage_orders (order_date, order_id, wrc_id, seller_id, order_name, pickup_date, status ) VALUES ( '${currentDate}', ${wastage_details_id}, ${userId[0].id}, ${sellerInfo.id}, '${orderInfo.vegetable}', '${pickUpDate}','pending')`
        
    await conn.query(sqlQuery2, (err, results)=>{
         if(err) return console.log(err)
         console.log(results)
     })
}
}

exports.createWastageTypes =  async(req, res, next) => {
    let data = {category: req.body.category, quality_level: req.body.level, price:req.body.price};
    
    let sqlQuery = "INSERT INTO wastage_types SET ?";
    
    conn.query(sqlQuery, data,(err, results) => {
      if(err) return next(new AppError(err));
      res.status(200).json({
        status : 'Wastage created',
        data : results
    });
    });
}

exports.updateWastageTypes =  async(req, res, next) => {
    let sqlQuery = "UPDATE wastage_types SET category='"+req.body.category+"', quality_level='"+req.body.level+"', price='"+req.body.price+"' WHERE id="+req.params.id;
    
    conn.query(sqlQuery, (err, results) => {
      if(err) return next(new AppError(err));
      res.status(200).json({
        status : 'Wastage updated',
        data : results
    });
    });
}


exports.removeWastageTypes =  async (req, res, next) => {
    let sqlQuery = "DELETE FROM wastage_types WHERE id="+req.params.id+"";
      
    conn.query(sqlQuery, (err, results) => {
      if(err) return next(new AppError(err));
        res.status(200).json({
            status : 'Wastage type Removed',
            data : req.params.id
        });
    });
}


exports.getWastageTypes =  async (req, res, next) => {
    
    conn.query('SELECT * FROM wastage_types',(err,data) => {
        if(err) return next(new AppError(err));
        res.status(200).json({
            status : 'All wastage types',
            data : data
        });
        
    });  
}

exports.getSingleWastageType =  async (req, res, next) => {
    
    conn.query('SELECT * FROM wastage_types where id=?',[req.params.id],(err,data) => {
        if(err) return next(new AppError(err));
        res.status(200).json({
            status : 'Single Wastage type',
            data : data
        });
        
    });  
}