const { query } = require('express');
const { connect } = require('../../services/db');
const conn = require('../../services/db');
const AppError = require('../../utils/appError');

exports.addNewRequest = (req, res, next) => {
    console.log("udhskjbgfuisdhfuiodshf")
    let sql = "SELECT id FROM user WHERE email=?"
    conn.query(sql, [req.body.email], (err, data) => {
        if(err) return next(new AppError(err,500));
        console.log(data);
        let id = data[0].id;
        try {

            // to declare some path to store your converted image
            const path = './public/images/requested_vegetables/'+Date.now()+req.body.fileName;
            const path1 = 'http://localhost:3002/images/requested_vegetables/'+Date.now()+req.body.fileName;
            console.log(req.headers.host);
            const imgdata = req.body.base64URL;
    
            // to convert base64 format into random filename
            const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            require("fs").writeFileSync(path, base64Data,  {encoding: 'base64'});

            console.log("Attention!!!!!!!!!!!! "+req.body.fileName)

            
            sql = "INSERT INTO selling_request (price,quantity,economic_center,status,vegetable,farmer_id) VALUES (?,?,?,?,?,?)";
            console.log("Query running??");
            let values = [req.body.price, req.body.quantity,req.body.ecocenter,1,req.body.vegetable,id];
            let q = conn.query(sql, values, function(err, result, fields){
            if(err) return next(new AppError(err,500));
            res.status(201).json({
            status: 'successfully add the selling request'
            });
            console.log("Your insertion data reds:"+result.insertId)
            console.log("The PATH NEW!!!!!: "+path1)
            let sql2 = "INSERT INTO selling_request_images (image,selling_request_id,vegetable) VALUES (?,?,?)";
            console.log("Query2 runninG!!!!!!!!!");
            let values1 = [path1,result.insertId,req.body.vegetable];
            let q1 = conn.query(sql2, values1, function(err, result, fields){
            if(err) return next(new AppError(err,500));
            res.status(201).json({
            status: 'successfully add the selling request images'
            });
            
            
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

exports.getVegetableList = (req, res, next) => {
    
        sql = "SELECT * FROM vegetable";
        let q = conn.query(sql,(err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully got the vege list',
                data: data1
            });
        });  
        console.log(q.sql);    

    };

    exports.getEconomicCentersList = (req, res, next) => {
    
        sql = "SELECT * FROM economic_center";
        let q = conn.query(sql,(err, data1) => {
            if(err) return next(new AppError(err,500));
            res.status(200).json({
                status: 'successfully got the economic centers list',
                data: data1
            });
        });  
        console.log(q.sql);    

    };