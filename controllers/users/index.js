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
        userType = "";
        switch(data[0].user_type){
            case 7: userType = "transporter"; break;
            case 1: userType = "admin"; break;
            case 5: userType = "stockBuyer"; break;
            case 3: userType = "farmer"; break;
            case 8: userType = "wrc"; break;
        };
        conn.query('SELECT * FROM notification WHERE user_id=? AND status = 0',[userId],(err,data1) => {
            if(err) return next(new AppError(err));
            let data2 = [];
            data1.map((item) => {
                let date1 = new Date(item.create_date);
                data2.push({
                    alert:item.alert,
                    date: date1.toLocaleTimeString('en-US'),
                });
            });
            res.status(200).json({
                status : 'successfully get the notifications',
                data : {
                    userType : userType,
                    notification : data2,
                }
            });
        }
    );
    });

       
    
    
}