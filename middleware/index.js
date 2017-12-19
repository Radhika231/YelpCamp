var Campground=require("../models/campground");
var Comment=require("../models/comment");

//all middleware goes here
var middlewareObj={};

//middleware
//is user logged in
//if not redirect
//does user own campground
//if not redirect
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req,res,next)
{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,foundcamp)
        {
            //if error or foundcamp = null
            //if id is valid but cant find in database sends null
            if(err || !foundcamp)
            {
                req.flash("error","Campground not found.");
                res.redirect("back");
            }
            else
            {
                //mongoose object & string hence use equals & not ===
                if(foundcamp.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

//is user logged in
//if not redirect
//does user own campground
//if not redirect
middlewareObj.checkCommentOwnership=function checkCommentOwnership(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,foundcomment)
        {
            if(err || !foundcomment)
            {
                req.flash("error","Comment not found.");
                res.redirect("back");
            }
            else
            {
                //mongoose object & string hence use equals & not ===
                if(foundcomment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

//middleware
//next is the next thing to be called
middlewareObj.isLoggedIn=function isLoggedIn(req,res,next)
{
    //isAuthenticated-comes with passport
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","You need to be logged in to do that.");//success= green flash message. This won't display/flash it
    res.redirect("/login");//have to handle the flash in /login
}
module.exports=middlewareObj