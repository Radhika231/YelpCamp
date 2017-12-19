var express=require('express');
var router=express.Router();
var User=require("../models/user");
var passport=require('passport');

//===========================
//      AUTH ROUTES
//===========================
//Register route
router.get("/register",function(req, res) {
    res.render("register");
});

//handling user sign up
router.post("/register",function(req, res) {
    var newUser=new User({username:req.body.username});
    //hashes the password & stores it
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            req.flash("error",err.message);
            res.locals.error = req.flash("error");//needed when redirecting to same page for flash message to be displayed
            return res.render("register");
        }
        else
        {
            //local is the strategy to use
            passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
          
        }
    });
    
});

//Login Routes
router.get("/login",function(req, res) {
    res.render("login");
});

//middleware- code that runs before the final callback. sit between beginning & end of the route.
router.post("/login", passport.authenticate("local",{
                successRedirect:"/campgrounds",
                failureRedirect:"/login"
            }), function(req,res){
});

//Logout Routes
router.get("/logout",function(req, res) {
    req.flash("error","Logged you out!");
    req.logout();//passport is destroying the user data in the session
    res.redirect("/campgrounds");
});


module.exports=router;