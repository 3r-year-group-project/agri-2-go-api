const conn = require('../../services/db');
const AppError = require('../../utils/appError');

exports.getUserType = (req, res, next) => {
    conn.query('SELECT id,user_type FROM user WHERE email=?',[req.params.email],(err,data,fields) => {
        console.log(err);
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

exports.sayHello = () => {
    console.log('Hello world!');
}

exports.getAllNotifications =  async (req, res, next) => {
    
    conn.query('SELECT * FROM user WHERE email=?',[req.params.email],(err,data) => {
        if(err) return next(new AppError(err));
        userId = data[0].id;
        conn.query('SELECT * FROM notification WHERE user_id=?',[userId],(err,data) => {
            if(err) return next(new AppError(err));
            res.status(200).json({
                status : 'successfully get the notifications',
                data : data
            });
        }
    );
    });

       
    
    
}