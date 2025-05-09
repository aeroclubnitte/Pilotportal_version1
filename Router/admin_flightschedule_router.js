const express = require("express");
const flightdetails = require("../Controller/admin_flightschedule_controller");
const router = express.Router();

//get flight schedules
router.get('/scheduleflights',async(req,res)=>{
    res.render("scheduleflights")
})

//get list of flightschedules already in db
router.get("/newflight", async (req, res) => {
   console.log("hi")
   logindetails = req.body
   console.log(logindetails+"123");
   console.log(flightdetails)
  {    
      console.log("hello this to check d..........")
      var d = await flightdetails.flightlist(req, res);
      console.log(d+"this is d..................");
      var n = d.length;
      console.log(n)
      res.render('upcomingflightschedules', { layout: false,  flight:d, detail: logindetails, flight_id: " " });
      
   }
   
});

/*Flight schedule form*/
router.post("/newflight", async (req, res) => {
    console.log("hi");
    console.log("hi")
    logindetails = req.body
    console.log(logindetails);
    let flight_schedule_insert = await flightdetails.flight_schedule_insert(req,res);
    let flight_schedule_view = await flightdetails.get_flight(req,res);
    console.log("hi11");
    console.log(flight_schedule_view)
    console.log("hello this to check d..........")
      var d = await flightdetails.flightlist(req, res);
      console.log(d+"this is d..................");
      var n = d.length;
      console.log(n)
    res.render('upcomingflightschedules', { layout: false, flight:d, detail: logindetails, flight_id: " " });
})

router.get("/view_flight_forms", async (req, res) => {
    let flight_schedule_view = await flightdetails.get_flight(req,res);
    res.render('scheduleform', { layout: false,flight_schedule_view_1 : flight_schedule_view});
    
})

/*delete scheduled flight*/
router.post("/all_schedules", async (req, res) => {
    var name = req.body;
    console.log(name)
    console.log(name.deleteschedule+'deletedID====----------')
    console.log(name.flight_id+'deletedID====----------')
    console.log(name)
    console.log("trialdemo----------")
    
    console.log("trialdemo----------")
    if (name.deleteschedule != undefined) {
        var remove = await flightdetails.deleteschedules(req, res);
        console.log('checkingggggg--------')
        console.log(remove);
        console.log('checkingggggg--------')
      
         var a = await flightdetails.flightlist(req, res);
         var s = await flightdetails.get_flight(req, res);

        console.log("deleted succesfully...")
        res.render('upcomingflightschedules', { layout: false, flight:a,flight_id:req.body});
 }
 else
 if (name.editschedule != undefined) {
     var edits = await flightdetails.edit_schedules(req, res);
     console.log(edits);
     var d = await flightdetails.get_flight(req, res);
      console.log(d);
     console.log("hiiiiiiiiiii")
         res.render('rescheduleform', { layout: false, schedule_details: edits });
     
 }
 
         
         

     }
)

/*Edit the flight schedule*/
router.post("/edit_schedule", async (req, res) => {
 console.log("edit");
 console.log("error debugging successful....")
 var Edit = await flightdetails.editschedules(req, res);
 console.log(Edit)
 console.log("Edited Succesfully...")
 flight_id=req.body;
 var a = await flightdetails.flightlist(req, res);
 var d = await flightdetails.get_flight(req, res);
 res.render('upcomingflightschedules', { layout: false, flight:a,flight_id:req.body.flight_id })
})

/*Edit the flight schedule form*/
router.post('/update_form',async(req,res)=>{
    console.log('hi');
    await flightdetails.alterScheduleTable(req, res);
    const submit=req.body;
    var d = await flightdetails.get_flight(req, res);
    // var Edit = await all_questions.getQuestions(req, res);
    console.log(submit.flight_id+"kite")
    
    flight_id=req.body;
    // //  if(submit)
    //     await all_questions.addtoevents(req, res);
        res.render('upcomingflightschedules', { layout: false,Question:Edit, flight:d ,flightdetails:submit ,flight_id:submit.flight_id})
        console.log("hfvtb")
    
      
    // res.send('hi')
})



router.post("/simulate_admin",async(req,res)=>{
    
    {
    //var d=await flight_schedule_controller.simulate_insert(req,res);
    var simulate_detail= await flightdetails.simulate_ret_admin(req,res);
    res.render('simulation_display_admin',{layout:false,simulations:simulate_detail});
  }
});

 router.get("/simulate_admin", async (req, res) => {
    {
    var simulate_detail= await flightdetails.simulate_ret_admin(req,res);
    res.render('simulation_display_admin',{layout:false,simulations:simulate_detail});
}
 } );


module.exports=router;