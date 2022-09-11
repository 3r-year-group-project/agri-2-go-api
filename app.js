var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


const router = require('./routes/index');
const usersRouter = require('./routes/users/index');
const farmerRouter = require('./routes/farmer/index');
const wrcRouter = require('./routes/wrc/index');
const stockbuyerRouter = require('./routes/stockbuyer/index');
const transporterRouter = require('./routes/transporter/index');
const grocerysellerRouter = require('./routes/groceryseller/index');
const customerRouter = require('./routes/customer/index');
const adminRouter = require('./routes/admin/index');

const AppError = require('./utils/appError');
const { error } = require('console');
const errorHandler = require('./utils/errorHandler');

var app = express();


app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true,limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



app.use('/api', router);
app.use('/api/users', usersRouter);
app.use('/api/farmer',farmerRouter);
app.use('/api/wrc',wrcRouter);
app.use('/api/stockbuyer',stockbuyerRouter);
app.use('/api/transporter',transporterRouter);
app.use('/api/groceryseller',grocerysellerRouter);
app.use('/api/customer',customerRouter);
app.use('/api/admin',adminRouter);
app.use("/public", express.static(path.join(__dirname, 'public')));



app.all("*",(req,res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
