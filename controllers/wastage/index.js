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