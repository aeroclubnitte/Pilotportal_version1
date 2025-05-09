const express = require("express");
const router = express.Router();
const flight_schedule_controller= require("../Controller/flight_schedule_controller.js");
const  Router  = require("express");
const jwt=require("jsonwebtoken");
const session = require('express-session');

// const app=express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())
require('dotenv/config');
const flightdetail = require("../Controller/member_dashboard_controller");

//sanjana commented
router.get("/newflightmem", async (req, res) => {
    const email = req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
    console.log("hello this is my new trial ......................")
    console.log(email)
    console.log("hello this is my new trial ......................")
    console.log("hi")
    // logindetails = req.body
    // console.log(logindetails+"123");
    // console.log(flight_schedule_controller)
   {    
       console.log("hello this to check d..........")
       var d = await flight_schedule_controller.flightlistmem(req, res);
       console.log(d+"this is d..................");
       var n = d.length;
       console.log(n)
       res.render('upcomingflightschedulesmem', { layout: false,  flight:d,  flight_id: " " ,email,emailExists});
       
    }
    
 });




/*Flight schedule form*/
router.post("/newflightmem", async (req, res) => {
    const email = req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
    console.log("hi");
    console.log("hi")
    logindetails = req.body
    console.log(logindetails);
    let flight_schedule_insert = await flight_schedule_controller.flight_schedule_insertmem(req,res);
    let flight_schedule_view = await flight_schedule_controller.get_flightmem(req,res);
    console.log("hi11");
    console.log(flight_schedule_view)
    console.log("hello this to check d..........")
      var d = await flight_schedule_controller.flightlistmem(req, res);
      console.log(d+"this is d..................");
      var n = d.length;
      console.log(n)
    res.render('upcomingflightschedulesmem', { layout: false, flight:d, detail: logindetails, flight_id: " ",email,emailExists });
})


router.post("/view_flight_form", async (req, res) => {
    const email = req.cookies.email;
    
    
    console.log(req.body);
    
    let flight_schedule_insert = await flight_schedule_controller.flight_schedule_insertmem(req,res);
    //let flight_schedule_view = await flight_schedule_controller.flight_schedule_view(req,res);
    //console.log("hi11");
    //console.log(flight_schedule_view)
    //res.render('form', { layout: false, flight_schedule_view_1 : flight_schedule_view});
})

router.get("/view_flight_form", async (req, res) => {
    const email=req.cookies.email
    const emailExists = await flightdetail.isEmailInProfileData(email);
    //const email = req.cookies.email;
    logindetails = req.body
    let flight_schedule_view = await flight_schedule_controller.flight_schedule_view(req,res);
    res.render('form', { layout: false,flight_schedule_view_1 : flight_schedule_view, flight_id: " " ,email,emailExists});
    
})


/*Edit the flight schedule*/
router.post("/reschedule", async (req, res) => {
    const email = req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
    console.log("edit");
    console.log("error debugging successful....")
    var Edit = await flight_schedule_controller.editschedulesmem(req, res);
    console.log(Edit)
    console.log("Edited Succesfully...")
    flight_id=req.body;
    var a = await flight_schedule_controller.flightlistmem(req, res);
    var d = await flight_schedule_controller.get_flightmem(req, res);
    res.render('upcomingflightschedulesmem', { layout: false, flight:a,flight_id:req.body.flight_id ,email,emailExists})
   })

    

   router.post("/all_schedulesmem", async (req, res) => {
    const email = req.cookies.email;
    const emailExists =await flightdetail.isEmailInProfileData(email);
    var name = req.body;
    console.log(name)
    console.log(name.deleteschedule+'deletedID====----------')
    console.log(name.flight_id+'deletedID====----------')
    console.log(name)
    console.log("trialdemo----------")
    
    console.log("trialdemo----------")
    if (name.deleteschedule != undefined) {
        var remove = await flight_schedule_controller.deleteschedulesmem(req, res);
        console.log('checkingggggg--------')
        console.log(remove);
        console.log('checkingggggg--------')
      
         var a = await flight_schedule_controller.flightlistmem(req, res);
         var s = await flight_schedule_controller.get_flightmem(req, res);

        console.log("deleted succesfully...")
        res.render('upcomingflightschedulesmem', { layout: false, flight:a,flight_id:req.body,email,emailExists});
 }
 else
 if (name.editschedule != undefined) {
     var edits = await flight_schedule_controller.edit_schedulesmem(req, res);
     console.log(edits);
     var d = await flight_schedule_controller.get_flightmem(req, res);
      console.log(d);
     console.log("hiiiiiiiiiii")
         res.render('reschedule', { layout: false, schedule_details: edits ,email,emailExists});
     
 }
 
         
         

     }
)


/*Edit the flight schedule*/
router.post("/edit_schedulemem", async (req, res) => {
    const email=req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
    console.log("edit");
    console.log("error debugging successful....")
    var Edit = await flight_schedule_controller.editschedulesmem(req, res);
    console.log(Edit)
    console.log("Edited Succesfully...")
    flight_id=req.body;
    var a = await flight_schedule_controller.flightlistmem(req, res);
    var d = await flight_schedule_controller.get_flightmem(req, res);
    res.render('upcomingflightschedulesmem', { layout: false, flight:a,flight_id:req.body.flight_id,emailExists})
   })
   
   /*Edit the flight schedule form*/
   router.post('/update_formmem',async(req,res)=>{
    const email=req.cookies.email;
    const emailExists = await flightdetail.isEmailInProfileData(email);
       console.log('hi');
       await flight_schedule_controller.alterScheduleTablemem(req, res);
       const submit=req.body;
       var d = await flight_schedule_controller.get_flightmem(req, res);
       // var Edit = await all_questions.getQuestions(req, res);
       console.log(submit.flight_id+"kite")
       
       flight_id=req.body;
       // //  if(submit)
       //     await all_questions.addtoevents(req, res);
           res.render('upcomingflightschedulesmem', { layout: false,Question:Edit, flight:d ,flight_schedule_controller:submit ,flight_id:submit.flight_id,emailExists})
           console.log("hfvtb")
       
         
       // res.send('hi')
   })
   

   router.get('/simulation_details',async(req,res)=>{
    res.render('simulation_display')
  })
  
  router.get('/add_simulation',async(req,res)=>{
    res.render('add_simulation_details')
  })

  router.post("/simulate",async(req,res)=>{
    
  {
  var d=await flight_schedule_controller.simulate_insert(req,res);
  var simulate_detail= await flight_schedule_controller.simulate_ret(req,res);
  res.render('simulation_display',{layout:false,simulations:simulate_detail});
}
  
  });


  router.get("/simulate", async (req, res) => {
    {
    var simulate_detail= await flight_schedule_controller.simulate_ret(req,res);
    res.render('simulation_display',{layout:false,simulations:simulate_detail});
}
 } );

module.exports = router



