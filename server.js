const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const multerS3 = require('multer-s3')//not needed, included as an option
const aws = require('aws-sdk')// not needed, included as an option
const awsConfig = require('./config/awsConfig.js')
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const morgan   = require('morgan');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const ObjectId = require('mongodb').ObjectID
const multer = require('multer')
const multerAzure = require('multer-azure')
var db;
const configDB = require('./config/database.js');
const port     = process.env.PORT || 4000;
const s3 = new aws.S3({//not needed
  accessKeyID    : awsConfig.accessKeyID,
  secretAccessKey: awsConfig.secretAccessKey,
  region         : awsConfig.region,
  Bucket         : 'science-docs-articles'
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
require('./config/passport')(passport);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, multer, ObjectId, path, s3, multerS3, multerAzure );
});
app.listen(port);
console.log(`Listening on port ${port}`)
