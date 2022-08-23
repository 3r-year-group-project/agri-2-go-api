const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');


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
