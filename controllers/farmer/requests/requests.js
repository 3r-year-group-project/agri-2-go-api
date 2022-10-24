const { query } = require('express');
const conn = require('../../../services/db')
const AppError = require('../../../utils/appError');
const emailSender = require('../../../utils/sendEmail');
const smsSender = require('../../../utils/sendText');

function getUserID(email){
    let sql = "SELECT id FROM user WHERE email=?"
    return new Promise((resolve)=>{
        conn.query(sql, [email], (err, data) => {
            if(err) return next(new AppError(err,500));
            resolve(data[0].id);    
        }
        );
        
    });
    
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

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

        sql = "SELECT S.id as request_id, S.price, S.quantity, S.vegetable, E.id as economic_center_id, E.name as economic_center FROM selling_request as S INNER JOIN economic_center as E ON S.economic_center=E.name WHERE S.farmer_id=? AND S.status=?;";
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

exports.orders = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        let id = data[0].id;

        sql = "SELECT E.longitude, E.latitude, S.deal_date, S.code , S.id as request_id, S.price, S.quantity, S.vegetable, E.id as economic_center_id, E.name as economic_center FROM selling_request as S INNER JOIN economic_center as E ON S.economic_center=E.name WHERE S.farmer_id=? AND S.status=?;"
        let q = conn.query(sql, [id, REQUEST_STATE.ACCEPT], (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the sent requests',
                data: data1
            });
        });  
        // console.log(q.sql); 
    });
};

exports.getBestTransporters = (req, res, next) => {
    console.log(req.body);
    let s = conn.query('SELECT vehicle.type,vehicle.user_id, vehicle.image,vehicle.id,location.longitude,location.latitude,trip_cost.cost_0_50,trip_cost.cost_50_150,trip_cost.cost_150_250,trip_cost.cost_250_500,trip_cost.cost_500_750,trip_cost.cost_750_1000,trip_cost.cost_1000_1500,trip_cost.cost_1500_2000,trip_cost.pickup_radius FROM vehicle,location,trip_cost WHERE vehicle.capacity > ? AND vehicle.user_id NOT IN(SELECT transport_request.transporter_id FROM transport_request WHERE transport_request.date=?) AND location.user_id = vehicle.user_id AND trip_cost.user_id = vehicle.user_id',[req.body.quantity,req.body.dealDate],(err, data) => {
        let availVehicle = [];
        if(err) return next(new AppError(err,500));
        console.log("data",data);
        data.map((item) => {
            let dist = distance(req.body.lat,req.body.lon,item.latitude,item.longitude,"K");
            console.log("dist",dist);
            if(dist <= item.pickup_radius){
                let wholeTrip = (dist+req.body.distance) * 2;
                switch(true){
                    case wholeTrip <= 50: 
                        item.cost = item.cost_0_50*wholeTrip;
                        break;
                    case wholeTrip <= 150:
                        item.cost = item.cost_50_150*wholeTrip;
                        break;
                    case wholeTrip <= 250:
                        item.cost = item.cost_150_250*wholeTrip;
                        break;
                    case wholeTrip <= 500:
                        item.cost = item.cost_250_500*wholeTrip;
                        break;
                    case wholeTrip <= 750:
                        item.cost = item.cost_500_750*wholeTrip;
                        break;
                    case wholeTrip <= 1000:
                        item.cost = item.cost_750_1000*wholeTrip;
                        break;
                    case wholeTrip <= 1500:
                        item.cost = item.cost_1000_1500*wholeTrip;
                        break;
                    case wholeTrip <= 2000:
                        item.cost = item.cost_1500_2000*wholeTrip;
                        break;
                    case wholeTrip > 2000:
                        item.cost = item.cost_1500_2000*wholeTrip;
                        break;

                }
                availVehicle.push(item);
                
            }
        });
        res.status(200).json({
            status: 'successfully get the best transporters',
            data: availVehicle.sort((a,b) => a.cost - b.cost)
        });
    });
    

};

exports.getLocation = async (req, res, next) => {
    let farmerId = await getUserID(req.params.email);
    let sql = "SELECT longitude, latitude FROM location WHERE user_id=" + farmerId;
    conn.query(sql,(err,data)=>{
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully get the location',
            data: data
        });
    });
};


function getUserIDOfTheVechile(id){
    let sql = "SELECT user_id FROM vehicle WHERE id=?"
    return new Promise((resolve)=>{
        conn.query(sql, [id], (err, data) => {
            if(err) return next(new AppError(err,500));
            resolve(data[0].user_id);    
        }
        );
        
    });
    
}





exports.sendRequest = async (req, res, next) => {
    let farmerId = await getUserID(req.body.email);
    let transporterId = await getUserIDOfTheVechile(req.body.vehicleId);
    let values = [req.body.dealDate, farmerId, transporterId,1,req.body.cost, req.body.distance, req.body.id];
    conn.query("INSERT INTO notification (user_id, alert) VALUES (?, ?) ",[transporterId,0],(err,data)=>{
        if(err) return next(new AppError(err,500));
        conn.query('SELECT email,phone FROM user WHERE id=?',[transporterId],(err,data6)=>{
            if(err) return next(new AppError(err,500));
            console.log(data6);
            let email = data6[0].email;
            let phone = data6[0].phone;
            sendEmail.sendEmail(email,'Agri2-GO','You have a new transport request check the Agri2-GO app');
            sendText.sendText(phone,'You have a new transport request check the Agri2-GO app');
        });
        
    });
    let s = conn.query('INSERT INTO transport_request( date, farmer_id, transporter_id, status, payment,distance, selling_request_id) VALUES (?,?,?,?,?,?,?)',values,(err,data)=>{
        if(err) return next(new AppError(err,500));
        res.status(201).json({
            status: 'successfully send a transport request',
            data: data
        });
    });
    console.log(s.sql);
};


exports.getSalesDetails = async (req, res, next) => {

    console.log("Ammo ammo mama duwanoo!")

}