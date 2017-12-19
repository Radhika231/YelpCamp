var mongoose=require('mongoose'),
    Campground=require('./models/campground'),
    Comment=require('./models/comment');

//add few campgrounds
var data=[{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",description:"Salmon Creek is an unincorporated community settlement and census-designated place (CDP) in Sonoma County, California, U.S. It is located on the Pacific coast about 90 minutes drive north of San Francisco, between the towns of Jenner and Bodega Bay, California. The population was 86 at the 2010 census."},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",description:"Granite Hill Campground offers everything from private tentsites to spacious pull-thru sites, offers group camping and rustic cabin rentals (800) 642-8368."},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",description:"The Mountain Goats are an American indie folk band formed in Claremont, California by singer-songwriter John Darnielle. The band is currently based in Durham, North Carolina."}
        ];

//clear campgrounds collection before running server
function seedDB()
{
    Campground.remove({},function(err){
        if(err)
            console.log(err);
        else
        {
            //after deleting the campgrounds we have to run this- (hence in callback function)
            console.log("Removed Campgrounds");
            data.forEach(function(seed){
            Campground.create(seed,function(err,campground)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                   console.log("Added a campground");
                   //create a comment on each campground
                   Comment.create(
                   {
                       text:"This place is great, but I wish there was internet.",
                       author:"Homer"
                   },function(err,comment)
                   {
                       if(!err)
                       {
                           campground.comments.push(comment);
                           campground.save();
                           console.log("Created new comment");
                       }
                   });
                }
            });

            });
        }
    });
   
}

module.exports=seedDB;



/*var campgrounds = [
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];*/