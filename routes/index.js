var express = require('express');
var router = express.Router();
var userModel=require("./users")
var eventModel = require("./events")
const ticketModel = require('./ticket')
const localStrategy = require("passport-local");
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));
const nodemailer = require('nodemailer');



/* GET home page. --------------------------------------------*/
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
  if (!validatePassword(req.body.password)) {
    // res.redirect("/register")
    // console.log("Error")
    return res.send(`<script>alert('invalid password');window.location.href="/register";</script>`); //browser js
  } 

  userModel.register(userdata,req.body.password)
  .then(function (registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})


//function for password validation-------------------
function validatePassword(password){
  if(password.length >= 4 &&password.length<=8){
    for(let i=0;i<password.length;i++){
      let char = password[i];
      if(!char.match(/[a-zA-Z0-9]/))
        return false;
    }
    return true;
  }else{
    return false;
  }
}

// CHECKING FUNCTIONS FOR LOGIN---------------
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect("/login")
  }  
  }


// Login----------------------------------------------
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post("/loggedin",passport.authenticate("local",{
  successRedirect:"/profile",
  // failureFlash:true,
  failureRedirect:"/login",
}),function(){})



//Profile-----------------------------------------------
// router.get('/profile',(req,res,next)=>{
//   res.render("profile");
// });

router.get('/profile',isLoggedIn,async function(req, res, next) {
  let user1 = await userModel.findOne({username: req.session.passport.user}).populate("bookedEvents").populate("createdEvents")
  res.render("profile",{user1});
});



//add event---------------------------------------------
router.get('/addevent',async (req,res,next)=>{
  const events = await eventModel.find();
  // console.log(events)
  res.render("eventCards",{events});
});

// router.get('/add1',isLoggedIn,async (req,res,next)=>{
//   let newevent = await eventModel.findOne({ eventname: "Vacation" });

//   if (!newevent) {
//       newevent = new eventModel({
//           eventname: "Vacation",
//           date: new Date("2022-06-02T09:00:00Z"),
//           description: "#travel",
//           location: "Duke Hotel",
//           ticketPrices:7
//       });
//       await newevent.save();
//   } 
//     var user1 = await userModel.findOne({username: req.session.passport.user});
//     user1.bookedEvents.push(newevent._id);
//     await user1.save();
//   res.redirect("profile");
// });

// router.get('/add2',isLoggedIn,async (req,res,next)=>{
//   let newevent = await eventModel.findOne({eventname:"Conferance meeting"});
//   if(!newevent){
//   let newevent = await eventModel({
//       eventname:"Conferance meeting",
//       date:new Date("2022-02-04T07:00:00Z"),
//       description:"#conference",
//       location:"Theatre Lara",
//       ticketPrices:7
//   })
//   newevent.save()
// }
//     var user1 = await userModel.findOne({username: req.session.passport.user});
//     user1.bookedEvents.push(newevent._id);
//     await user1.save();
//   res.redirect("profile");
// });

// router.get('/add3',isLoggedIn,async (req,res,next)=>{
//   let newevent = await eventModel.findOne({eventname:"Marriage Event"});
// if(!newevent){
//   let newevent = await eventModel({
//       eventname:"Marriage Event",
//       date:new Date("2022-02-03T04:00:00Z"),
//       description:"#ceremony",
//       location:"Madrid Center",
//       ticketPrices:7
//   })
//   newevent.save()
// }
//     var user1 = await userModel.findOne({username: req.session.passport.user});
//     user1.bookedEvents.push(newevent._id);
//     await user1.save();
//   res.redirect("profile");
// });

// router.get('/add4',isLoggedIn,async (req,res,next)=>{
//   let newevent = await eventModel.findOne({eventname:"Party/Celebration"})
//   if(!newevent){
//   let newevent = await eventModel({
//       eventname:"Party/Celebration",
//       date:new Date("2022-02-06T05:00:00Z"),
//       description:"#party",
//       location:"Big Top Stage",
//       ticketPrices:7
//   });
//   newevent.save();
// }
//     var user1 = await userModel.findOne({username: req.session.passport.user});
//     user1.bookedEvents.push(newevent._id);
//     await user1.save();
//   res.redirect("profile");
// });




//create event---------------------------------------------------
router.get('/createevent',(req,res,next)=>{
  res.render("createEvent");
})

router.post("/createevent",isLoggedIn,async (req,res)=>{
  var eventdata = new eventModel({
      eventname:req.body.eventName,
      date:req.body.date,
      description:req.body.description,
      location:req.body.location,
      ticketPrices:req.body.ticketPrices,
      Availability:req.body.Availability,
      refundPolicy:req.body.refundPolicy,
      createdBy:req.session.passport.user
    });
    eventdata.save();

    var user1 = await userModel.findOne({username: req.session.passport.user});
    user1.createdEvents.push(eventdata._id)
    await user1.save();

    //return res.send(`<script>aleart('Event Created')</script>`)
    res.redirect("createEvent");
})



router.get('/about',(req,res,next)=>{
  res.render("about");
});


// Edit and Delete Created/Booked Event------------------------
router.get('/delete/:id', async (req, res) => {
  const event = await eventModel.findById(req.params.id);
  const user1 = await userModel.findOne({username:req.session.passport.user});
  user1.createdEvents.pull(event);
  await user1.save();
  // await ticketModel.find.delete({eventname:event.eventname});
  await eventModel.deleteOne(event);

  res.redirect('/profile');
});

router.get('/delete-booked-events/:id',async function(req, res){
  const event = await eventModel.findById(req.params.id);
  const user1 = await userModel.findOne({username:req.session.passport.user});
  const ticket = await ticketModel.findOne({eventname:event.eventname,username:user1.username});
  const organizer = await userModel.findOne({username:ticket.organizers});
  user1.bookedEvents.pull(req.params.id);
  await user1.save();
  event.Availability = event.Availability+1;
  event.ticketId.pull(ticket._id);
  await event.save();
  organizer.attendeeTicketId.pull(ticket._id);
  await organizer.save();
  await ticketModel.deleteOne(ticket);

  res.redirect('/profile');
})


router.get('/edit/:id', async (req, res) => {
  const event = await eventModel.findById(req.params.id);
  res.render('editEvent', { event });  //event to update is also passed
});

// Update a created event------------
router.post('/edit/:id', async (req, res) => {
  const { eventname, date, location, description, ticketPrices, Availability, refundPolicy } = req.body;
  // console.log(eventModel.findById(req.params.id))
  await eventModel.findByIdAndUpdate(req.params.id, {
      eventname,
      date,
      location,
      description,
      ticketPrices,
      Availability,
      refundPolicy,
  });
  res.redirect('/profile');
});





// BOOKING AND ADDING EVENTS---------------
router.get('/booking/:id',isLoggedIn,async (req,res,next)=> {
  const event = await eventModel.findById(req.params.id);
  if(event.Availability<1)
    {
      // res.redirect('/addevent');
      return res.send(`<script>alert('Sorry! ticket sold out');window.location.href="/addevent";</script>`);
    }
    else{
    res.render('ticket', { event});
    }
})



router.post('/booking/:id', async (req, res) => {
  const event = await eventModel.findById(req.params.id);
  console.log(event)
  var ticket = new ticketModel({
    eventId:event._id,
    eventname:event.eventname,
    attendeename:req.body.name,
    username:req.session.passport.user,
    email:req.body.email,
    price:event.ticketPrices,
    organizers:event.createdBy,
    // ticketType:req.body.ticketType,
  });
  ticket.save()

  event.ticketId.push(ticket._id)
  event.Availability=event.Availability-1
  await event.save();

    const user1 = await userModel.findOne({username:req.session.passport.user})
    user1.bookedEvents.push(req.params.id)
    await user1.save();

    const organizer = await userModel.findOne({username:ticket.organizers})
    organizer.attendeeTicketId.push(ticket._id)
    await organizer.save()
  res.redirect('/profile'); 
});




router.get('/contact', async (req, res) => {
  const user1 = await userModel.findOne({username:req.session.passport.user}).populate('attendeeTicketId')
  res.render('attendee',{user1});
});










// SEND EMAIL ROUTE-----------------
// router.get('/email/:id',async (req,res)=>{

//   var user1 = await userModel.findOne({
//         username: req.session.passport.user
//       });
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: user1.email,
//       pass: 'irxs epst zqrp qkkw'
//     }
//   });
  
      
//       var mailto = req.params.id;
  
//       const emailContent = `
//       <p>Dear Attendee,</p>
//       <p>Here are your Booking Status:</p>
//        <ul>
//            <li>Ticket Confirmed: </li>
//       </ul>
//       <p>Thank you!</p>
//       `;
  
//   var mailOptions = {
//     from: user1.email,
//     to: mailto,
//     subject: 'Booking Details',
//     html: emailContent,
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
//   res.send('<script>alert("Mail has been sent successfully!"); window.location="/profile";</script>');
//   res.render("profile");
//   })






module.exports = router;
