 var mongoose=mongoose=require('mongoose');

//Schema Set UP
var campgroundSchema=new mongoose.Schema({
    name:String,
    price:String,
    location:String,
    lat:Number,
    lng:Number,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"//name of the model
        }]
})
module.exports=mongoose.model("Campground",campgroundSchema);