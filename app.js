const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");
const passport = require("passport");
const jwtStrategy  = require("./strategies/jwt")
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// const dev_db_url = "mongodb+srv://alexbrik528:IV6KrvQF8FxgDJ7K@cluster0.9ihei4n.mongodb.net/users_and_movies?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI // || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.set('trust proxy', 1);

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(compression());

app.use(helmet());

app.use(cors());



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

passport.use(jwtStrategy); // maybe this should be higher up

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
