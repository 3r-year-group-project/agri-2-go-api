const conn = require('../../services/db');
const AppError = require('../../utils/appError');

exports.getUserType = (req, res, next) => {   
    conn.query(`SELECT user_type FROM user WHERE user_id=${req.params.id}`, (err,data,fields)=>{
        if(err) return next(new AppError(err));
        if(!(data && (data.length >0))){
            let sql = "INSERT INTO user(user_id,user_type) VALUES (?,0)";
            conn.query(sql,[req.params.id],(err,res2) => {
                if(err) return next(new AppError(err,500));
                res.status(201).json(
                    {
                        status : 'success',
                        data : {
                            user_type : 0
                        }
                    }
                );
            });

        }else{
            res.status(200).json({
                status : 'success',
                length : data.length,
                data : data
            });
        }
        
        
    });
    
};

exports.sayHello = () => {
    console.log('Hello world!');
}