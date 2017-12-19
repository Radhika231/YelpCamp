var express                 =require('express'),
    app                     =express(),
    bodyparser              =require('body-parser'),
    mongoose                =require('mongoose'),
    Campground              =require('./models/campground'),
    Comment                 =require('./models/comment'),
    seedDB                  =require('./seeds'),
    passport                =require('passport'),
    localStrategy           =require('passport-local'),
    passportLocalMongoose   =require("passport-local-mongoose"),
    User                    =require("./models/user"),
    methodOverride          =require('method-override'),
    flash                   =require("connect-flash");

//Requiring Routes
var campgroundRoutes        =require("./routes/campgrounds"),
    commentRoutes           =require("./routes/comments"),
    authRoutes              =require("./routes/index");

var url=process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
    secret:"Rusty is the best & cutest dog in the world" ,//will be used to encode decode
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//encoding & decoding session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//seedDB(); //seed the database

//middleware for user to be accessible in each template
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();//to move on to next code. This is the middleware that runs for every route.
});

app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.get('/',function(req,res)
{
    res.render("landing");
});


app.listen(process.env.PORT,process.env.ip)
{
    console.log("Server started");
}