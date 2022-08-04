var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const router = require('./routes/index');
var usersRouter = require('./routes/users/index');
const AppError = require('./utils/appError');
const { error } = require('console');
const errorHandler = require('./utils/errorHandler');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);
app.use('/api/users', usersRouter);

app.all("*",(req,res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

module.exports = app;
