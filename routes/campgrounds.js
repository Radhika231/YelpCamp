var express=require('express');
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware"); //automatically includes index.js as it is supposed to be the main file
  
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
             res.render('campgrounds/index',{campgrounds:camps,currentUser:req.user});
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
   }
   var newcamp={"name":name,"price":price,"image":image,"description":desc,"author":author};

   //create a new campground & save to db
   Campground.create(newcamp,function(err,newlycreated)
   {
       if(err)
       {
           console.log(err);
       }
       else{
           res.redirect('/campgrounds');
       }
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
    //find & update
    //redirect somewhere
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
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