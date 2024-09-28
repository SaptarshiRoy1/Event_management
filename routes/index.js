var express = require('express');
var router = express.Router();
var userModel=require("./users")
var eventModel = require("./events")
const localStrategy = require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/register', function(req, res, next) {
  res.render('index');
});

router.post("/register",(req,res)=>{
  var userdata = new userModel({
    username:req.body.username,
    email:req.body.email,
    fullname:req.body.fullname,
  });
  userModel.register(userdata,req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})



// CHECKING FUNCTIONS FOR LOGIN------------
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect("/login")
  }  
  }


// Login---------------
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post("/loggedin",passport.authenticate("local",{
  successRedirect:"/profile",
  // failureFlash:true,
  failureRedirect:"/login",
}),function(){})



//Profile---------------
// router.get('/profile',(req,res,next)=>{
//   res.render("profile");
// });

router.get('/profile',isLoggedIn,async function(req, res, next) {
  let user1 = await userModel.findOne({username: req.session.passport.user}).populate("events")
  res.render("profile",{user1});
});



//add event---------------
router.get('/addevent',(req,res,next)=>{
  res.render("eventCards");
});


router.get('/add1',isLoggedIn,async (req,res,next)=>{
  let newevent = await eventModel({
      eventname:"Vacation",
      date:new Date("2022-06-02T09:00:00Z"),
      description:"#travel",
      location:"Duke Hotel"
  })
  newevent.save()
    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.events.push(newevent._id);
    await user1.save();
  res.redirect("profile");
});

router.get('/add2',isLoggedIn,async (req,res,next)=>{
  let newevent = await eventModel({
      eventname:"Conferance meeting",
      date:new Date("2022-02-04T07:00:00Z"),
      description:"#conference",
      location:"Theatre Lara"
  })
  newevent.save()
    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.events.push(newevent._id);
    await user1.save();
  res.redirect("profile");
});

router.get('/add3',isLoggedIn,async (req,res,next)=>{
  let newevent = await eventModel({
      eventname:"Marriage Event",
      date:new Date("2022-02-03T04:00:00Z"),
      description:"#ceremony",
      location:"Madrid Center"
  })
  newevent.save()
    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.events.push(newevent._id);
    await user1.save();
  res.redirect("profile");
});

router.get('/add4',isLoggedIn,async (req,res,next)=>{
  let newevent = await eventModel({
      eventname:"Party/Celebration",
      date:new Date("2022-02-06T05:00:00Z"),
      description:"#party",
      location:"Big Top Stage"
  });
  newevent.save()
    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.events.push(newevent._id);
    await user1.save();
  res.redirect("profile");
});




//create event------------------
router.get('/createevent',(req,res,next)=>{
  res.render("createEvent");
})

router.post("/createevent",isLoggedIn,async (req,res)=>{
  var eventdata = new eventModel({
      eventname:req.body.eventName,
      date:req.body.date,
      description:req.body.description,
      location:req.body.location
    });
    eventdata.save();

    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.events.push(eventdata._id)
    await user1.save();

    res.redirect("createEvent")
})



router.get('/about',(req,res,next)=>{
  res.render("about");
});



module.exports = router;
