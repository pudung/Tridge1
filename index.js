var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var path = require('path');
var http = require('http');
var static = require('serve-static');
var MongoStore = require('connect-mongo')(session); // session을 mongodb에 저장

// added for passport 
var methodOverride = require("method-override");
var flash = require("connect-flash");
var passport = require("./config/passport");

var multer =  require('multer');

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local',{ useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	// we're connected!
});

// Other settings
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use('/uploads', static(path.join(__dirname, 'uploads'))); // 1124 추가

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride("_method"));
app.use(flash());

// passport
app.use(session({
	secret: "MySecret",
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use("/", require("./routes/home"));
app.use("/tutors", require("./routes/tutor")); // 수정 by bk
app.use("/users", require("./routes/users"));


// listen on port 8080
app.listen(3000, function () {
	console.log('Express app listening on port 3000');
});
