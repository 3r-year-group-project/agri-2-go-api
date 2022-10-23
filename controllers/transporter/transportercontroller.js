const { Console } = require('console');
const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');

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

exports.addNewVehicle = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;
        try {

            // to declare some path to store your converted image
            const path = './public/images/vehicle/'+Date.now()+req.body.fileName;
            const path1 = 'http://localhost:3002/images/vehicle/'+Date.now()+req.body.fileName;
            console.log(req.headers.host);
            const imgdata = req.body.base64URL;
    
            // to convert base64 format into random filename
            const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            require("fs").writeFileSync(path, base64Data,  {encoding: 'base64'});
            sql = "INSERT INTO vehicle (type, capacity, contact_number, image, driver_name, vehicle_number, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            let values = [req.body.vehicleType, req.body.vehicleCapacity, req.body.contactNumber, path1, req.body.driverName, req.body.vehicleNumber, id];
            let q = conn.query(sql, values, (err, data) => {
            if(err) return next(new AppError(err,500));
            res.status(201).json({
            status: 'successfully add the vehicle'
            });
        });
        console.log(q.sql);
    
    
        } catch (e) {
            console.log(e);
            next(e);
        }
        
    }
    );
    
};

exports.getVehicle = (req, res, next) => {
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;

        sql = "SELECT * FROM vehicle WHERE user_id=? ORDER BY id DESC";
        let q = conn.query(sql, [id], (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get the vehicle',
                data: data1
            });
        });  
        console.log(q.sql);     
    }
    );
    };

exports.removeVehicle = (req, res, next) => {
    let sql = "DELETE FROM vehicle WHERE id=?";
    conn.query(sql, [req.body.id], (err, data) => {
        if(err) return next(new AppError(err,500));
        res.status(200).json({
            status: 'successfully remove the vehicle'
        });
    });

};

function getBuyerAddress(id){
    let sql = "SELECT location.address FROM location, paid_orders WHERE location.user_id=paid_orders.buyer_id AND paid_orders.request_id =?"
    return new Promise((resolve)=>{
        conn.query(sql, [id], (err, data) => {
            if(err) return next(new AppError(err,500));
            resolve(data[0].address);    
        }
        );
        
    });
    
}

exports.getAllRequest = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
        let s = conn.query("SELECT (SELECT location.address FROM location, paid_orders WHERE location.user_id=paid_orders.buyer_id AND paid_orders.request_id =transport_request.selling_request_id) AS buyer_address,transport_request.selling_request_id,transport_request.id, transport_request.date, transport_request.payment, selling_request.vegetable,user.first_name AS farmer_first_name, user.last_name AS farmer_last_name, location.address,selling_request.quantity,user.phone FROM transport_request,selling_request,user,location WHERE transport_request.selling_request_id=selling_request.id AND user.id = transport_request.farmer_id AND transport_request.transporter_id = ? AND transport_request.status = 1 AND location.user_id=transport_request.farmer_id;", [transporter_id], async (err, data1) => {
            if(err) return next(new AppError(err,500));
            // let dataToSend = [];
            // let address;
            // await data1.map(async element => {
            //     address = await getBuyerAddress(element.selling_request_id);
            //     element.buyer_address = address;
            //     dataToSend.push(element);
            // });
            
            // console.log(dataToSend);

            res.status(200).json({
                status: 'successfully get all requests',
                data: data1
            });
        });
        console.log(s.sql); 
    
};




exports.takeRequest = async (req, res, next) => {
    conn.query('UPDATE transport_request SET status=2 WHERE selling_request_id=(SELECT selling_request_id FROM transport_request WHERE id=?)',[req.body.id],
    (err, data1) => {
        if(err) return next(new AppError(err,500));
        conn.query('UPDATE transport_request SET status = 3 WHERE id = ?', [req.body.id], (err, data) => {
            if(err) return next(new AppError(err,500));

            conn.query('SELECT farmer_id FROM transport_request WHERE id=? ', [req.body.id], (err, data2) => {
                if(err) return next(new AppError(err,500));
                let farmerId = data2[0].farmer_id;
                conn.query('INSERT INTO notification( user_id, alert) VALUES (?,?)',[farmerId,1],(err,data4)=>{
                    if(err) return next(new AppError(err,500));
                });

                conn.query('SELECT email,phone FROM user WHERE id=?',[farmerId],(err,data6)=>{
                    if(err) return next(new AppError(err,500));
                    console.log(data6);
                    let email = data6[0].email;
                    let phone = data6[0].phone;
                    let message = "You have a new request from "+req.body.email;
                    sendEmail.sendEmail(email,'Agri2-GO','Your transport request is canceled');
                    sendText.sendText(phone,'Your transport request is canceled.');
                });

            });

            res.status(204).json({
                status: 'successfully take the request'
            });
        });
    });
    
};

exports.declineRequest = async (req, res, next) => {
    conn.query('UPDATE transport_request  SET status=2 WHERE id=?',[req.body.id],(err, data1) => {
        if(err) return next(new AppError(err,500));

        conn.query('SELECT farmer_id FROM transport_request WHERE id=? ', [req.body.id], (err, data2) => {
            if(err) return next(new AppError(err,500));
            let farmerId = data2[0].farmer_id;
            conn.query('INSERT INTO notification( user_id, alert) VALUES (?,?)',[farmerId,2],(err,data4)=>{
                if(err) return next(new AppError(err,500));
            });

            conn.query('SELECT email,phone FROM user WHERE id=?',[farmerId],(err,data6)=>{
                if(err) return next(new AppError(err,500));
                console.log(data6);
                let email = data6[0].email;
                let phone = data6[0].phone;
                let message = "You have a new request from "+req.body.email;
                sendEmail.sendEmail(email,'Agri2-GO','Your transport request is canceled');
                sendText.sendText(phone,'Your transport request is canceled.');
            });
        });

        res.status(204).json({
            status: 'successfully decline the request'
        });
    });
};

exports.checkExistChargers = async (req, res, next) => {

    let transporter_id = await getUserID(req.params.email);

    conn.query('SELECT * FROM trip_cost WHERE trip_cost.user_id = ?',[transporter_id],async (err,data1)=>{
    let transporter_id = await getUserID(req.body.email);
    console.log("transporter id",transporter_id);
    conn.query('SELECT * FROM transport_request WHERE id=? AND status!=?',[req.body.id,0],(err,data1)=>{
        if(err) return next(new AppError(err,500));
        if(data1.length>0){
            res.status(200).json({
                status: 'already exist',
                data: data1,
                code:true
            });
        }
        else{           
            res.status(200).json({
                status: 'not exist',
                data: data1,
                code:false
            });
        }
    });
});
};

exports.setChargers = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
    console.log(req.body);
    if(req.body.existCode === false){
        let sql = conn.query('INSERT INTO trip_cost(user_id, pickup_radius,cost_0_50, cost_50_150, cost_150_250, cost_250_500, cost_500_750, cost_750_1000, cost_1000_1500, cost_1500_2000) VALUES (?,?,?,?,?,?,?,?,?,?)',[
            transporter_id,
            req.body.pickUpRadius,
            req.body.price0To50,
            req.body.price50To150,
            req.body.price150To250,
            req.body.price250To500,
            req.body.price500To750,
            req.body.price750To1000,
            req.body.price1000To1500,
            req.body.price1500To2000,
        ],(err,data)=>{
            if(err) return next(new AppError(err,500));
            res.status(201).json({
                status: 'successfully insert the chargers',
                data: data               
            });

        });
        console.log(sql.sql);
    }else{
        let s = conn.query('UPDATE trip_cost SET pickup_radius=?,cost_0_50=?,cost_50_150=?,cost_150_250=?,cost_250_500=?,cost_500_750=?,cost_750_1000=?,cost_1000_1500=?,cost_1500_2000=? WHERE user_id=?',[
            req.body.pickUpRadius,
            req.body.price0To50,
            req.body.price50To150,
            req.body.price150To250,
            req.body.price250To500,
            req.body.price500To750,
            req.body.price750To1000,
            req.body.price1000To1500,
            req.body.price1500To2000,
            transporter_id,
        ],(err,data)=>{
            if(err) return next(new AppError(err,500));
            res.status(204).json({
                status: 'successfully update the chargers',
                data: data               
            });
        });
        console.log(s.sql);
    }
};


exports.getAllAcceptedRequest = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
        let s = conn.query("SELECT (SELECT location.address FROM location, paid_orders WHERE location.user_id=paid_orders.buyer_id AND paid_orders.request_id =transport_request.selling_request_id) AS buyer_address,transport_request.selling_request_id,transport_request.id, transport_request.date, transport_request.payment, selling_request.vegetable,user.first_name AS farmer_first_name, user.last_name AS farmer_last_name, location.address,selling_request.quantity,user.phone,transport_request.status FROM transport_request,selling_request,user,location WHERE transport_request.selling_request_id=selling_request.id AND user.id = transport_request.farmer_id AND transport_request.transporter_id = ? AND transport_request.status IN (3,4) AND location.user_id=transport_request.farmer_id;", [transporter_id], async (err, data1) => {
            if(err) return next(new AppError(err,500));
            // let dataToSend = [];
            // let address;
            // await data1.map(async element => {
            //     address = await getBuyerAddress(element.selling_request_id);
            //     element.buyer_address = address;
            //     dataToSend.push(element);
            // });
            
            // console.log(dataToSend);

            res.status(200).json({
                status: 'successfully get all requests',
                data: data1
            });
        });
        console.log(s.sql); 
};

exports.startTrip = async (req, res, next) => {
    console.log(req.body);
    conn.query('SELECT selling_request.id FROM selling_request,transport_request WHERE selling_request.id = transport_request.selling_request_id AND transport_request.id=? AND selling_request.code=?'
    ,[req.body.id,req.body.code],(err,data1)=>{
        if(err) return next(new AppError(err,500));
        if(data1.length>0){
            conn.query('UPDATE transport_request SET status=4 WHERE id=?',[req.body.id],(err,data)=>{
                if(err) return next(new AppError(err,500));
                res.status(204).json({
                    status: 'successfully start the trip',
                    stCode:1
                });
            });
        }else{
            res.status(200).json({
                status: 'wrong code',
                stCode:0
            });
        }
    });
};

exports.checkExistChargers = async (req, res, next) => {
    let transporter_id = await getUserID(req.params.email);
    conn.query('SELECT * FROM trip_cost WHERE trip_cost.user_id = ?',[transporter_id],(err,data1)=>{
        if(err) return next(new AppError(err,500));
        if(data1.length>0){
            res.status(200).json({
                status: 'already exist',
                data: data1,
                code:true
            });
        }
        else{           
            res.status(200).json({
                status: 'not exist',
                data: data1,
                code:false
            });
        }
    });
};

exports.setChargers = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
    console.log(req.body);
    if(req.body.existCode === false){
        let sql = conn.query('INSERT INTO trip_cost(user_id, pickup_radius,cost_0_50, cost_50_150, cost_150_250, cost_250_500, cost_500_750, cost_750_1000, cost_1000_1500, cost_1500_2000) VALUES (?,?,?,?,?,?,?,?,?,?)',[
            transporter_id,
            req.body.pickUpRadius,
            req.body.price0To50,
            req.body.price50To150,
            req.body.price150To250,
            req.body.price250To500,
            req.body.price500To750,
            req.body.price750To1000,
            req.body.price1000To1500,
            req.body.price1500To2000,
        ],(err,data)=>{
            if(err) return next(new AppError(err,500));
            res.status(201).json({
                status: 'successfully insert the chargers',
                data: data               
            });

        });
        console.log(sql.sql);
    }else{
        let s = conn.query('UPDATE trip_cost SET pickup_radius=?,cost_0_50=?,cost_50_150=?,cost_150_250=?,cost_250_500=?,cost_500_750=?,cost_750_1000=?,cost_1000_1500=?,cost_1500_2000=? WHERE user_id=?',[
            req.body.pickUpRadius,
            req.body.price0To50,
            req.body.price50To150,
            req.body.price150To250,
            req.body.price250To500,
            req.body.price500To750,
            req.body.price750To1000,
            req.body.price1000To1500,
            req.body.price1500To2000,
            transporter_id,
        ],(err,data)=>{
            if(err) return next(new AppError(err,500));
            res.status(204).json({
                status: 'successfully update the chargers',
                data: data               
            });
        });
        console.log(s.sql);
    }
};