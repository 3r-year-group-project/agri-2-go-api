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
            farmerid:req.body.farmerid
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

                    sql2 = "insert into paid_orders (min_advance,farmer_id,buyer_id,request_id,paymentIntentId) values(?,?,?,?,?)"
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
