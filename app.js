//INCLUDES
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var seedDB = require("./seeds");

var app = express();

//Initial config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());

mongoose.connect((process.env.DATABASEURL && (process.env.NODE_ENV === "production"))?process.env.DATABASEURL:"mongodb://localhost/yelp_camp");
mongoose.Promise = global.Promise;

//seedDB();

app.use(methodOverride("_method"));

app.use(require("express-session")({secret: "c9d320e9-d84a-4f94-bc34-f85c7151bd3e", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Application listening on "+process.env.IP+":"+process.env.PORT); 
});