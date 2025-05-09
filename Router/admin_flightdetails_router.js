const express = require("express");
const flightdetails = require("../Controller/admin_flightdetails_controller");
const router = express.Router();

// const app=express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const multer = require('multer');

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())

//get flight details
router.get('/flightdetails',async(req,res)=>{
    res.render("flightdetails")
})

//get list of flight details already in db
router.get("/newflightdetails", async (req, res) => {
   console.log("hi")
   logindetails = req.body
   console.log(logindetails+"123");
   console.log(flightdetails)
  {    
      console.log("hello this to check d..........")
      var d = await flightdetails.succesfulflightdetails(req, res);
      console.log(d+"this is d..................");
      var n = d.length;
      console.log(n)
      res.render('flightdetails', { layout: false,  flight:d, detail: logindetails, flight_id: " " });
      
   }
   
});


//get list of crash details already in db
router.get("/crashdetails", async (req, res) => {
    console.log("hi")
    logindetails = req.body
    console.log(logindetails+"123");
    console.log(flightdetails)
   {    
       console.log("hello this to check d..........")
       var{ crash_details,items_name}= await flightdetails.crashdetails(req, res);
       console.log(crash_details+"this is d..................");
       console.log("admin_items_name_in_controller");
       console.log(items_name)
       console.log(crash_details)
       console.log("admin_items_name_in_controller");
       var n = crash_details.length;
       naa=JSON.stringify(crash_details);
       console.log(n)
       console.log("check  check check..........................")
       console.log(naa)
       console.log("check check......................")  
       res.render('crashdetails', { layout: false,  flight:crash_details, detail: logindetails, flight_id: " " ,items_name:items_name});
       
    }
    
 });
 router.get("/all_succesfulflightdetails",async(req, res) => {
    console.log("hello this to check d..........")
      var d = await flightdetails.succesfulflightdetails(req, res);
      console.log(d+"this is d..................");
      var n = d.length;
      console.log(n)
      res.render('flightdetails', { layout: false,  flight:d, flight_id: " " });
      
 })

 /*delete succesful flight details*/
router.post("/all_succesfulflightdetails", async (req, res) => {
    var name = req.body;
    console.log(name)
    console.log(name.deletessuccesfulflightdetails+'deletedID====----------')
    console.log(name.flight_id+'deletedID====----------')
    console.log(name)
    console.log("trialdemo----------")
    
    console.log("trialdemo----------")
    if (name.deletessuccesfulflightdetails!= undefined) {
        var remove = await flightdetails.deletessuccesfulflightdetails(req, res);
        console.log('checkingggggg--------')
        console.log(remove);
        console.log('checkingggggg--------')
      
         var a = await flightdetails.succesfulflightdetails(req, res);
         var s = await flightdetails.get_succesfulflightdetails(req, res);

        console.log("deleted succesfully...")
        res.render('flightdetails', { layout: false, flight:a,flight_id:req.body});
 }
 else
 if (name.editsuccesfulflightdetails!= undefined) {
     var edits = await flightdetails.edit_succesfulflightdetails(req, res);
      console.log("this is to check successfulflight_details................") 
      console.log(edits);
      console.log("this is to check successfulflight_details................") 
     var d = await flightdetails.get_succesfulflightdetails(req, res);
      console.log(d);
     console.log("hiiiiiiiiiii")
         res.render('edit_succesful_flight_details', { layout: false, schedule_details: edits });
     
 }
 
  }
)

 
/*Edit succesful flight details*/
router.post("/edit_succesfulflightdetails", async (req, res) => {
    console.log("edit");
    console.log("error debugging successful....")
    var Edit = await flightdetails.editsuccesfulflightdetails(req, res);
    console.log(Edit)
    console.log("Edited Succesfully...")
    flight_id=req.body;
    var a = await flightdetails.succesfulflightdetails(req, res);
    var d = await flightdetails.get_succesfulflightdetails(req, res);
    res.render('flightdetails', { layout: false, flight:a,flight_id:req.body.flight_id })
   })
   

/*delete crash details*/

router.post("/all_crashdetails", async (req, res) => {
    var name = req.body;
    console.log(name)
    console.log(name.deletecrashdetails+'deletedID====----------')
    console.log(name.flight_id+'deletedID====----------')
    console.log(name)
    console.log("trialdemo----------")
    
    console.log("trialdemo----------")
    if (name.deletecrashdetails!= undefined) {
        var remove = await flightdetails.deletecrashdetails(req, res);
        console.log('checkingggggg--------')
        console.log(remove);
        console.log('checkingggggg--------')
      
        var{ crash_details,items_name}= await flightdetails.crashdetails(req, res);
        console.log(d+"this is d..................");
        var n = crash_details.length;
        console.log(n)
        console.log("deleted succesfully...");
        res.render('crashdetails', { layout: false,  flight:crash_details, detail: logindetails, flight_id: " ",items_name });
     
 }
 else
 if (name.editcrashdetails!= undefined) {
     var edits = await flightdetails.edit_crashdetails(req, res);
      console.log("this is to check crash_details................") 
      console.log(edits);
      console.log("this is to check crash_details................") 
     var d = await flightdetails.get_crashdetails(req, res);
      console.log(d);
     console.log("hiiiiiiiiiii")
         res.render('edit_crash_details', { layout: false, schedule_details: edits });
     
 }
 
  }
)

/*Edit crash details*/
router.post("/edit_crashdetails", async (req, res) => {
    console.log("edit");
    console.log("error debugging successful....")
    var Edit = await flightdetails.editcrashdetails(req, res);
    console.log(Edit)
    console.log("Edited crash details successfully...")
    flight_id=req.body;
    var {crash_details,items_name}= await flightdetails.crashdetails(req, res);
    var a = await flightdetails.detailedcrashdetails(req, res);
    var d = await flightdetails.get_crashdetails(req, res);
    res.render('crashdetails', { layout: false, flight:crash_details,flight_id:req.body.flight_id,items_name })
   })
 
/*Edit succesful flight details*/
router.post("/edit_succesfulflightdetails", async (req, res) => {
    console.log("edit");
    console.log("error debugging successful....")
    var Edit = await flightdetails.editsuccesfulflightdetails(req, res);
    console.log(Edit)
    console.log("Edited Succesfully...")
    flight_id=req.body;
    var a = await flightdetails.succesfulflightdetails(req, res);
    var d = await flightdetails.get_succesfulflightdetails(req, res);
    res.render('flightdetails', { layout: false, flight:a,flight_id:req.body.flight_id })
   })
   
/*add flight details*/
router.get('/add_successful_flight_details',async(req,res)=>{
    
    const data=await flightdetails.alldroneslistdata(req,res);
    console.log(data);
    const c=await flightdetails.allflightdata(req,res);
    console.log(c);
   
})
router.post('/add_successful_flight_details',async(req,res)=>{
    
    const h=req.body;
    console.log(h)
    console.log("Hi")
    const y=await flightdetails.addflightdetails(req,res);
    console.log(y);
})

router.post('/add_crash_details',async(req,res)=>{
    const p=req.body
    console.log(p);
    const t=await flightdetails.addcrashdetails(req,res);
    console.log(t)
    
})




router.post('/insertdamagedparts', async (req, res) => {
    try {
      console.log("admin_insert_damagedparts_router");
      console.log("admin_insert_damaged_parts_router1");
   
      const { flightId, selectedItems } = req.body;
      console.log(req.body);
      console.log("Flight ID:", flightId);
      console.log("Flight ID type:", typeof flightId);
      console.log("Selected Items:", selectedItems);
      const item= await flightdetails.insertdamageditems(req,res);
      
    } catch (err) {
      console.error('Error', err);
      
    }
  });   
  


  // Router handling the delete operation for simulation
router.post("/all_simulationdetails", async (req, res) => {
    var flight_id = req.body.deleteSimulation; 
    
    try {
        var remove = await flightdetails.deleteSimulation(flight_id); 
        console.log("Deleted successfully...");

        var simulations = await flightdetails.simulationdetails(req, res);
        res.render('simulation_display_admin', { layout: false, simulations: simulations });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting simulation details.");
    }
});

/*Edit simulation flight details*/
router.post("/edit_simulationdetails", async (req, res) => {
  try {
    await flightdetails.edit_simulationdetails(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error editing simulation details");
  }
});

router.post("/update_simulation_details", async (req, res) => {
  try {
    await flightdetails.edit_simulation_details(req, res);
    var simulations = await flightdetails.successfulsimdetails(req, res);
    res.render('simulation_display_admin', { layout: false, simulations: simulations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating simulation details");
  }
});


module.exports=router;