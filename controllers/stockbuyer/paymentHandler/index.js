const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');
const Stripe = require('stripe');
require("dotenv").config()
const stripe= Stripe(process.env.STRIPE_KEY || 'sk_test_51LglIkSEWPhl7RJJa4iAmrJoot0BLYTQ24ZxOWWE4zemDtGWOfQMtw0GAi7wxSqTJuBIfZ875h8QHsvcphDcKcFs00P0ezgPnO');

exports.pay= async (req,res,next)=>{

   
    const customer = await stripe.customers.create({
        metadata: {
         id: req.body.id,
        userId:req.body.email
        },
      });

      
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: 'lkr',
                product_data: {
                  name: "Advance payment for "+ req.body.cropName+" order",
                  images: req.body.images.map((d)=>d.image),
                },
                unit_amount: req.body.minAdvance*100,
              },
              quantity: 1,
            },
            
          ],
          mode: 'payment',
          metadata:{
            reqid: req.body.id,
            buyerId:req.body.email,
            
        },
          success_url: `${process.env.CLIENT_URL}/stockbuyer/dash/farmerrequests`,
          cancel_url: `${process.env.CLIENT_URL}/stockbuyer/dash/farmerrequests`,
        });
      
        res.send({url:session.url});
    
      

}

exports.webhookhandler=(req, res,next) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
       
      
          try {
           
         
            var buyerid;
            var reqid=data.metadata.reqid
            var farmerid=data.metadata.farmerid



            conn.beginTransaction((err)=>{
                if(err) return next(new AppError(err,500));
                sql1 = "select id from user where email=?";
                conn.query(sql1, [data.metadata.buyerId],(err,data1)=>{
                    if (err) { 
                        conn.rollback(()=> {
                            console.log(err.message)
                            return next(new AppError(err,500))
                        });
                      }
                  
                    buyerid=data1[0].id

                    sql2 = "insert into paid_orders (min_advance,farmer_id,buyer_id,request_id,advancePaymentIntentId) values(?,?,?,?,?)"
                conn.query(sql2, [data.amount_total/100,farmerid,buyerid,reqid,data.payment_intent],(err,data2)=>{
                    if (err) { 
                        conn.rollback(()=> {
                            console.log(err.message)
                            return next(new AppError(err,500))
                        });
                      }

                      sql3 = "UPDATE selling_request SET status=?  WHERE id=?";
                values = [2, data.metadata.reqid];
                conn.query(sql3, values,(err,data3)=>{
                    if (err) { 
                        conn.rollback(()=> {
                            return next(new AppError(err,500))
                        });
                      }
                      conn.commit((err) =>{
                        if (err) { 
                          conn.rollback(()=> {
                            console.log(err.message)
                            return next(new AppError(err,500));
                          });
                        }
                        console.log('Transaction Completed Successfully.');
                        // conn.end();
                      });
                    
                    
                });
                   
                });
                });
                

                

                

            })

            

            
            // createOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        
       
    }

    res.status(200).end();
}










exports.payRemainingAmount = async (req,res,next)=>{


  const sql = "select * from paid_orders left outer join selling_request on selling_request.id=paid_orders.request_id where order_id=?"

  conn.query(sql, [req.body.id],async (err,data1)=>{
    if(err) return next(new AppError(err,500));

    if (data1[0]?.code==req.body.code) {

    
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'lkr',
              product_data: {
                name: "Remaining payment for "+ req.body.item+" order\n",
                images: [req.body.image],
              },
              unit_amount: (req.body.unit_price*req.body.quantity*100 - req.body.advance*100),
            },
            quantity: 1,
          },
          
        ],
        mode: 'payment',
        metadata:{
          orderid: req.body.id,
          date:req.body.date,
          recived_amount:req.body.quantity
          
      },
        success_url: `${process.env.CLIENT_URL}/stockbuyer/dash/orders`,
        cancel_url: `${process.env.CLIENT_URL}/stockbuyer/dash/orders`,
      });
    
      res.send({url:session.url});
    }else{
      res.send({
        statusCode:110,
        message:"Code is mismatched with your order"
      });
      

    }


});
     
    

}





exports.remainWebhookhandler=(req, res,next) => {
  let data;
  let eventType;

  // Check if webhook signing is configured.
  let webhookSecret;
  //webhookSecret = process.env.STRIPE_WEB_HOOK;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the checkout.session.completed event
  if (eventType === "checkout.session.completed") {
        try {
          
          var orderid=data.metadata.orderid
          var farmerid=data.metadata.farmerid
          var recieved_date=data.metadata.date
          var recieved_quantity=data.metadata.recived_amount
          console.log(orderid,data.amount_total/100)
          var date_time = new Date();
          sql = "UPDATE paid_orders SET remaining_payment=?  , remaining_IntentPaymentId=?, remaining_payment_date=?, order_status=?,comment_on_order=?,recieved_date=?,recieved_quantity=? where order_id=?";
          values = [data.amount_total/100, data.payment_intent,date_time,'delivered','',recieved_date,recieved_quantity,orderid];
          conn.query(sql, values,(err,data1)=>{
            console.log(err)
              if(err) return next(new AppError(err,500));
             
          });

          

          
          // createOrder(customer, data);
        } catch (err) {
          console.log(typeof createOrder);
          console.log(err);
        }
      
     
  }

  res.status(200).end();
}


