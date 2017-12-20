var express=require('express');
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware"); //automatically includes index.js as it is supposed to be the main file
var geocoder=require("geocoder");

//INDEX Route
router.get('/',function(req,res)
{
    //get all campgrounds from db
    Campground.find({},function(err,camps)
    {
        if(err)
        {
            console.log(err);
        }
        else{
             res.render('campgrounds/index',{campgrounds:camps,page:'campgrounds'});
        }
    })
    
});

//CREATE Route
router.post('/',middleware.isLoggedIn,function(req,res)
{
    //get data from form
    //redirect back to /campgrounds
   var name=req.body.campname;
   var price=req.body.campprice;
   var image=req.body.campimage;
   var desc=req.body.campdesc;
   var author={
       id:req.user._id,
       username:req.user.username
   };
    geocoder.geocode(req.body.camplocation, function (err, data) 
    {
        if (err || data.status === 'ZERO_RESULTS') 
        {
            console.log(err);
            console.log(data.status);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newcamp={"name":name,"price":price,"image":image,"description":desc,"author":author,location: location, lat: lat, lng: lng};

        //create a new campground & save to db
        Campground.create(newcamp,function(err,newlycreated)
        {
             if(err)
            {
                console.log(err);
            }
            else
            {
                 res.redirect('/campgrounds');
            }
        });
    });
});

//NEW ROUTE
router.get('/new',middleware.isLoggedIn,function(req,res){
     res.render("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get('/:id',function(req,res)
{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp)
    {
        //if id is valid but not in db, foundcamp=null
        if(err || !foundcamp)
        {
            req.flash("error","Campground not found.");
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/show",{campground:foundcamp});
        }
    });
    
});

//Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
          Campground.findById(req.params.id,function(err,foundcamp)
        {
            if(err)
            {
                req.flash("error","Campground not found.");
            }
             res.render("campgrounds/edit",{campground:foundcamp});
        });
});
   

//Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req, res) {
    geocoder.geocode(req.body.campground.location, function (err, data) 
    {
        if (err || data.status === 'ZERO_RESULTS') 
        {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newcamp={"name":req.body.campground.name,"price":req.body.campground.price,"image":req.body.campground.image,"description":req.body.campground.description,location: location, lat: lat, lng: lng};

        //find & update
        //redirect somewhere
        Campground.findByIdAndUpdate(req.params.id,{$set:newcamp},function(err,updatedcamp){
            if(err)
            {
                res.redirect("/campgrounds");
            }
            else
            {
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });
});

//Destroy/delete campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find & delete
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err)
       {
           res.redirect("/campgrounds");
       }
        res.redirect("/campgrounds");
   })
})


module.exports=router;