const { query } = require('express');
const { connect } = require('../../../services/db');
const conn = require('../../../services/db');
const AppError = require('../../../utils/appError');

exports.getUserList =(req, res, next) => {
    let sql = "SELECT * FROM user  where user_type!=?"
    conn.query(sql, [1], (err, data1) => {
        if(err) return next(new AppError(err,500));
        
            res.status(200).json({
                status: 'successfully get the users',
                data: data1
            });
          
    }
    );
    };


exports.blockUser = (req,res,next)=>{
   
    conn.query("UPDATE user SET user_status=? WHERE id=?", ['BLOCKED', req.params.ID],((err, res2)=>{
        if(err) return next(new AppError(err,500));
        res.status(204).json({
            status: "successfully update the user status"
        });
    }));
}
exports.unblockUser = (req,res,next)=>{
   
    conn.query("UPDATE user SET user_status=? WHERE id=?", ['UNBLOCKED', req.params.ID],((err, res2)=>{
        if(err) return next(new AppError(err,500));
        res.status(204).json({
            status: "successfully update the user status"
        });
    }));
}
