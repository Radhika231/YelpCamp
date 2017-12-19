var mongoose = require('mongoose'),
    passportLocalMongoose=require("passport-local-mongoose")

var userSchema=new mongoose.Schema({
    username:String,
    password:String
});
userSchema.plugin(passportLocalMongoose); //plugs in the functions that come with passport local mongoose inside userSchema table/collection
module.exports=mongoose.model("User",userSchema);