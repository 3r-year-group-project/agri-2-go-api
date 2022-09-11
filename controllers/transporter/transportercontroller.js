const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');

async function getUserID(email){
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [email], (err, data) => {
        if(err) return next(new AppError(err,500));
        return id;
    }
    );
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

exports.getAllRequest = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
        conn.query("SELECT transport_request.id , transport_request.date , user.first_name , user.last_name , user.address1 , shop.shop_address , transport_request.payment, vegitable.name, user.phone FROM transport_request,user,shop,vegitable WHERE user.id = transport_request.seller_id AND transport_request.transporter_id = ? AND transport_request.shop_id = shop.id AND transport_request.status = '0' AND vegitable.id = transport_request.vege_id  ORDER BY id DESC", [transporter_id], (err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully get all requests',
                data: data1
            });
        });  
    
};


exports.takeRequest = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
    conn.query('SELECT * FROM transport_request WHERE id=? AND status!=?',[req.body.id,0],(err,data1)=>{
        if(err) return next(new AppError(err,500));
        if(data1.length>0){
            res.status(200).json({
                status: 'already taken',
                data: data1
            });
        }
        else{           
            conn.query('UPDATE transport_request SET transporter_id=? , status=? WHERE id=?',[transporter_id,1,req.body.id],(err,data)=>{
                if(err) return next(new AppError(err,500));
                res.status(200).json({
                    status: 'successfully taken',
                    data: data
                });
            });
        }
    });
};

exports.declineRequest = async (req, res, next) => {
    let transporter_id = await getUserID(req.body.email);
    conn.query('SELECT * FROM transport_request WHERE id=? AND status!=?',[req.body.id,0],(err,data1)=>{
        if(err) return next(new AppError(err,500));
        if(data1.length>0){
            res.status(200).json({
                status: 'already taken',
                data: data1
            });
        }
        else{           
            conn.query('UPDATE transport_request SET transporter_id=? , status=? WHERE id=?',[transporter_id,1,req.body.id],(err,data)=>{
                if(err) return next(new AppError(err,500));
                res.status(200).json({
                    status: 'successfully taken',
                    data: data
                });
            });
        }
    });
};