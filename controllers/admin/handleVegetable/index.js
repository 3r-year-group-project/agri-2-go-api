const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');


exports.addVegetable=(req,res,next)=>{
try {
  
    // to declare some path to store your converted image
    const path = './public/images/vegetable/'+Date.now()+req.body.fileName;
    const path1 = 'http://localhost:3002/images/vegetable/'+Date.now()+req.body.fileName;
    console.log(req.headers.host);
    const imgdata = req.body.base64URL;

    // to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/,'');
    
    require("fs").writeFileSync(path, base64Data,  {encoding: 'base64'});

    var sql ="INSERT INTO `vegetable` (name, description, image) VALUES (?, ?, ?)"
    values = [req.body.name, req.body.description, path1];
    conn.query(sql, values,(err,data1)=>{
        if(err) return next(new AppError(err,500));
        res.status(201).json({
            status: 'successfully inserted vegetable details',
            data:data1
        })
    });
} catch (error) {
    console.log(error);
}
    

}
exports.getAllVegetable=(req,res,next)=>{
    const sql = "SELECT * FROM vegetable";
    conn.query(sql,[],(err,data1)=>{
        if (err) return next(new AppError(err,500));
        res.status(200).json(
           { status:'successfully get the vegetables details',
        data:data1}
        )
    })

}
exports.deleteVeg=(req,res,next)=>{
    const sql = "DELETE  FROM vegetable WHERE id=?";
    values= [req.params.ID]
    conn.query(sql,values,(err,data1)=>{
        if (err) return next(new AppError(err,500));
        res.status(200).json(
           { status:'successfully get the delete veg details',
        data:data1}
        )
    })

}