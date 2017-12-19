var express=require('express');
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware"); 

//==============================
//COMMENTS ROUTES (nested routes)
//==============================

//comments new
router.get('/new',middleware.isLoggedIn,function(req, res) {
    //find campground by id
    Campground.findById(req.params.id,function(err,foundcamp)
    {
        if(err) console.log(err)
        else res.render("comments/new",{campground:foundcamp});
    });
});

//comments save
router.post('/',middleware.isLoggedIn,function(req,res){
   //lookup campground by id
   //create new comment
   //show comment
   //redirect
   Campground.findById(req.params.id,function(err, foundcamp) {
       if(err) 
       {    
           console.log(err);
           res.redirect("/campgrounds");
       }
       else
       {
           Comment.create(req.body.comment,function(err,comment)
           {
               if(err)
               {
                    req.flash("error","Something went wrong.");
                    console.log(err);
                }
                else
                {
                    //add username & id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundcamp.comments.push(comment);
                    foundcamp.save();
                    req.flash("success","Successfully added comment.");
                    res.redirect("/campgrounds/"+foundcamp._id);
                }
            });
        }
    });
}); 

//Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res)
{
    Campground.findById(req.params.id,function(err, foundcamp) {
        if(err || !foundcamp)
        {
            req.flash("error","Campground not found");
            res.redirect("back");
        }
    });
    Comment.findById(req.params.comment_id,function(err, foundcomment) {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{campground_id:req.params.id,comment:foundcomment});
        }
    });
});

//Comment UPDATE
router.put("/:comment_id",function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedcomment) {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","Comment deleted.");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports=router;