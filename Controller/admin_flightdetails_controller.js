// handles storing new test created 
const { check } = require("express-validator");
const pool=require("../database");
const express=require('express');
const uuid = require('uuid');
const jwt=require("jsonwebtoken");
const app=express();

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())



const { cookie } = require('express/lib/response');
const { use } = require('../Router');
require('dotenv').config();

//get all flight  details  

module.exports.flightdetails = async (req, res) => {
  try {
   console.log("hello welcome..................")
    var flight_details = await pool.query("select flight_id,mode,date,drone_id,emailid,duration,result,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot from flight_description");
    console.log(flight_details.rows);
    console.log("hello nishmitha..................")
    console.log(flight_details.rows[0].flight_id+"hellonitte")
    return flight_details.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

module.exports.get_flightdetails = async (req, res) => {
  try {
    var get_flightdetails = await pool.query("select mode,date,drone_id,emailid,duration,result,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot from flight_description where flight_id=$1",[req.body.flight_id]);
    
   
    return get_flightdetails.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

/*All succesful flight details*/
module.exports.succesfulflightdetails = async (req, res) => {
    try {
     console.log("hello welcome..................")
      var succesfulflight_details = await pool.query("select flight_id,mode,date,drone_id,emailid,duration,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot from flight_description where result=true");
      console.log(succesfulflight_details.rows);
      console.log("hello nishmitha..................")
      console.log(succesfulflight_details.rows[0].flight_id+"hellonitte")
      return succesfulflight_details.rows;
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

module.exports.get_succesfulflightdetails = async (req, res) => {
    try {
      var get_succesfulflightdetails = await pool.query("select mode,date,drone_id,emailid,duration,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot from flight_description where result=true and flight_id=$1",[req.body.flight_id]);
      
     
      return get_succesfulflightdetails.rows;
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }
  
/*All Crash details*/
module.exports.crashdetails = async (req, res) => {
    try {
     console.log("hello welcome..................")
      var crash_details = (await pool.query('SELECT fd.drone_id, d.drone_name,fd.flight_id,fd.mode,fd.date,fd.duration,fd.emailid,fd.result,fd.copilot,c.total_cost,cr.reason FROM flight_description fd JOIN drones d ON fd.drone_id = d.drone_id JOIN crash cr on fd.flight_id=cr.flight_id LEFT JOIN (SELECT SUM(c.items_cost) AS total_cost, f.flight_id FROM cost_details c JOIN flight_crash_items f ON f.items_name = c.items_name GROUP BY f.flight_id ) AS c ON c.flight_id = fd.flight_id WHERE fd.result = false')).rows
      console.log("this is my new crash check")
      console.log(crash_details);
      console.log("hello nishmitha..................")
      console.log(crash_details.flight_id+"hellonitte")
      const items_name=(await pool.query('select items_name from cost_details')).rows;
      console.log("items_name list");
      console.log(items_name)
      return {crash_details, items_name};
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

module.exports.get_crashdetails = async (req, res) => {
    try {
      var get_crashdetails = await pool.query("select f.flight_id,date,f.emailid,copilot,drone_name,damaged_parts,reason from flight_description f,crash c where f.flight_id=c.flight_id and f.result=false and f.flight_id=$1",[req.body.flight_id]);
      
     
      return get_crashdetails.rows;
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }
  
  /*Delete succesful flight details*/

module.exports.deletessuccesfulflightdetails = async (req, res) => {
   try {
       var remove = []
       var Data = req.body;
       console.log(Data)
       console.log("qb")
       var details = await pool.query("select * from flight_description where result=true")
       console.log(details.rows[0].flight_id)
       console.log("hello")
       var b = await pool.query("delete from flight_description where flight_id =$1", [Data.deletessuccesfulflightdetails])
         
           console.log(b)


       
   var new_list_after_delete = await pool.query("select flight_id, mode,date,drone_id,emailid,duration,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot from flight_description");
       console.log(new_list_after_delete.rows);
       console.log("New flight details...")
       return new_list_after_delete.rows;

   } catch (err) {
       console.log(err)
       res.status(401).json("Cannot Delete a succesful flight details........")
   }
}


/*edit succesful flight details*/

module.exports.editsuccesfulflightdetails = async (req, res) => {
    try {
        var flightinfo = req.body
        console.log("this is to debug the code.......................")
        console.log(flightinfo)
        console.log(flightinfo.flight_id+"helloworld12345")
        console.log("1")
        
        var edit_succesfulflightdetails = await pool.query("update flight_description set mode=$1,date=$2,drone_id=$3,emailid=$4,duration=$5,result=$6,batteryid=$7,takeoffvoltage=$8,landingvoltage=$9,windspeed=$10,winddirection=$11,copilot=$12 where flight_id=$13", [flightinfo.mode, flightinfo.date, flightinfo.drone_id, flightinfo.emailid, flightinfo.duration, flightinfo.result,flightinfo.batteryid, flightinfo.takeoffvoltage, flightinfo.landingvoltage,flightinfo.windspeed, flightinfo.winddirection, flightinfo.copilot,flightinfo.flight_id])
        console.log(edit_succesfulflightdetails);
        console.log("edited")
        var after_edit_successfulflight_list = await pool.query("select flight_id,mode,date,drone_id,emailid,duration,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,copilot,result from flight_description where result=true");
        console.log(after_edit_successfulflight_list.rows);
        console.log("after")
        return after_edit_successfulflight_list.rows;
    } catch (err) {
        console.log(err)
        res.status(401).json('Cannot Edit flight details..........')
    }
 };
 
 
 module.exports.edit_succesfulflightdetails = async (req, res) => {
    try {
        var editData = req.body
        
        var edit_info = await pool.query("select * from flight_description where result=true and flight_id=$1", [editData.editsuccesfulflightdetails]);
        console.log("edittinnng...")
        console.log(edit_info.rows);
        return edit_info.rows[0];
 
    }
    catch (e) {
        console.error(e)
        res.json({
            errors: 'Invalid'
        });
 
    }
 }
 
 /*delete crash details*/


module.exports.deletecrashdetails = async (req, res) => {
    try {
        var remove = []
        var Data = req.body;
        console.log(Data)
        console.log("qb")
        var details = await pool.query("select * from flight_description,crash where flight_description.flight_id=crash.flight_id and result=false")
        console.log(details.rows[0].flight_id)
        console.log("hello")
        var b = await pool.query("DELETE FROM flight_description USING crash WHERE flight_description.flight_id = crash.flight_id AND flight_description.flight_id=$1 AND crash.flight_id =$2;", [Data.deletecrashdetails,Data.deletecrashdetails])
          
            console.log(b)
        
    var new_list_after_delete = await pool.query("select flight_id,drone_name,damaged_parts,reason,emailid from crash");
        console.log(new_list_after_delete.rows);
        console.log("New flight details...")
        return new_list_after_delete.rows;
 
    } catch (err) {
        console.log(err)
        res.status(401).json("Cannot Delete a crash  details........")
    }
 }
 
 
/*edit crash details*/

module.exports.editcrashdetails = async (req, res) => {
    try {
        var flightinfo = req.body
        console.log("this is to debug the editcrashdetails code.......................")
        console.log(flightinfo)
        console.log(flightinfo.flight_id+"helloworld12345")
        console.log("1")
        var edit_crashdetails = await pool.query("UPDATE flight_description SET mode=$1,date=$2,drone_id=$3,emailid=$4, duration=$5,result=$6,batteryid=$7,takeoffvoltage=$8,landingvoltage=$9,windspeed=$10,winddirection=$11,copilot=$12 WHERE flight_id =$13", [flightinfo.mode, flightinfo.date, flightinfo.drone_id, flightinfo.emailid, flightinfo.duration, flightinfo.result,flightinfo.batteryid, flightinfo.takeoffvoltage, flightinfo.landingvoltage,flightinfo.windspeed, flightinfo.winddirection, flightinfo.copilot,flightinfo.flight_id])
        var edit_crashdetails2 = await pool.query("UPDATE crash SET drone_name=$1,damaged_parts=$2,reason=$3 WHERE flight_id =$4", [flightinfo.drone_name, flightinfo.damaged_parts, flightinfo.reason,flightinfo.flight_id])
        console.log(edit_crashdetails);
        console.log(edit_crashdetails2);
        console.log("edited crash details............")
        var after_edit_crashdetails_list = await pool.query("select * from crash,flight_description where flight_description.flight_id=crash.flight_id");
        console.log( after_edit_crashdetails_list .rows);
        console.log("after")
        return  after_edit_crashdetails_list .rows;
    } catch (err) {
        console.log(err)
        res.status(401).json('Cannot Edit flight details..........')
    }
 };
 
 
 module.exports.edit_crashdetails = async (req, res) => {
    try {
        var editData = req.body
        
        var edit_info = await pool.query("select f.flight_id,f.mode,f.date,f.drone_id,f.emailid,f.duration,f.batteryid,f.takeoffvoltage,f.landingvoltage,f.windspeed,f.winddirection,f.copilot,f.result,c.drone_name,c.damaged_parts,c.reason from flight_description f,crash c where f.flight_id=c.flight_id and c.flight_id=$1", [editData.editcrashdetails]);
        console.log("edittinnng...")
        console.log(edit_info.rows);
        return edit_info.rows[0];
 
    }
    catch (e) {
        console.error(e)
        res.json({
            errors: 'Invalid'
        });
 
    }
 }

 /*list of crash details along with flight_description table content*/
 module.exports.detailedcrashdetails = async (req, res) => {
  try {
   console.log("hello welcome..................")
    var detailedcrash_details = await pool.query('select f.flight_id,f.mode,f.date,f.drone_id,f.emailid,f.duration,f.result,f.batteryid,f.takeoffvoltage,f.landingvoltage,f.windspeed,f.winddirection,f.copilot,c.drone_name,c.damaged_parts,c.reason from flight_description f,crash c where f.flight_id=c.flight_id and f.result=false')
    console.log("hello this is detailed crash details.................")
    console.log(detailedcrash_details.rows);
    console.log("hello this is detailed crash details.................")
    console.log(detailedcrash_details.rows[0].flight_id+"hell this is crash id to be detailed")
    return detailedcrash_details.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }}


  /*add flightdetails*/
  module.exports.alldroneslistdata=async(req,res)=>{
    
    if(!req.cookies.authcookie)
    {
        return res.status(403).render('login', {message: 'Token Expired'});

    }
    else {
        const authcookie=await jwt.verify(req.cookies.authcookie,'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh')
        console.log(authcookie)
        if(authcookie.iat - new Date().getTime() < 60000){

    try{
        const {rows}=await pool.query("SELECT drone_name,drone_id FROM drones");
        console.log({rows})
        const {rows:batteries}=await pool.query("SELECT batteryid FROM batterylist");
        console.log({rows:batteries})
        const{rows:winddirection}=await pool.query("SELECT winddirection FROM winddirection");
        console.log({rows:winddirection})
        console.log("Hi")
        // const list=rows.map(row=>row.drone_id);
        const list = rows.map(row => ({ droneName: row.drone_name, droneId: row.drone_id }))
        console.log(list)
        const email=req.cookies.email
        console.log(email);
        const userId = uuid.v4()
        res.cookie('autoid',userId);
        res.render('add_successful_flight_details',{options:list,email:email,userId:userId,batteries:batteries,direction:winddirection})
       
          
    }
    catch(err){
        console.log(err)
    }
    }
    else
    {
        return res.send({code:404 ,message:'Token Expired'})
    }
}

}


module.exports.allflightdata=async(req,res)=>{
  try{
      const k=await pool.query("select * from flight_description");
      return k.rows;

  }
  catch(err){
      console.log(err)
  }

}

module.exports.addflightdetails=async(req,res)=>{
  try{
      const answer=req.body.answer;
      console.log(answer)
      const selectedDroneId=req.body.drone_id;
      console.log(selectedDroneId)
      const [drone_name,droneId]=selectedDroneId.split('-');
      console.log(drone_name,droneId)
      
      
          const query1= await pool.query(`SELECT drone_id FROM drones WHERE drone_name=$1`,[drone_name]);
          console.log(query1.rows);
          console.log(query1[2])

      if(answer==='yes'){
      console.log("let's fly");
      var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result}=req.body
      console.log(req.body)
      var result=true;
      var y=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result]);
      console.log(y);
      res.redirect('/all_succesfulflightdetails')
      }
      else if(answer==='no'){
          var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result}=req.body
          var result=false;
          var n=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result]);
          console.log("Insertion Successful")
      console.log(n);
      const email=req.cookies.email
      console.log(email);
      const autoid=req.cookies.autoid
      console.log(autoid)
          res.render('add_crash_details',{email:email,autoid:autoid});
      }
      else{
          res.status(400).send("Invalid answer'")
      }
  }
  catch(err){
      console.log(err)
  }
}

module.exports.addcrashdetails=async(req,res)=>{
  try{
      console.log("Crash Details Submission");
      let {drone_name,emailid,pilot_id,flight_id,damaged_parts,reason}=req.body;
      console.log({
          drone_name,emailid,pilot_id,flight_id,damaged_parts,reason
      })
      pool.query('INSERT INTO crash (drone_name,emailid,flight_id,damaged_parts,reason)values($1,$2,$3,$4,$5)',[drone_name,emailid,flight_id,damaged_parts,reason]);
      console.log("Submission Successful");
      res.redirect('/all_succesfulflightdetails');
  }
  catch(err){
      console.log(err)
  }
}

module.exports.insertdamageditems = async (req,res) => {
  try {
    console.log("Crash item details submission");
    var { flightId, selectedItems } = req.body;
    console.log({
      flightId,
      selectedItems
    });

    // Convert single item into an array
    if (typeof selectedItems === 'string') {
      selectedItems = [selectedItems];
    }

    for (var item of selectedItems) {
      await pool.query('INSERT INTO flight_crash_items (flight_id, items_name) VALUES ($1, $2)', [flightId, item]);
    }

    console.log("Submission Successful");
    res.redirect('/crashdetails');
  } catch (err) {
    console.log(err);
  }
};







/*deleting simulation*/

module.exports.simulationdetails = async (req, res) => {
  try {
   console.log("hello welcome..................")
    var simulation_details = await pool.query("select * from simulation");
    console.log(simulation_details.rows);
    console.log("hello nishmitha..................")
    console.log(simulation_details.rows[0].flight_id+"hellonitte")
    return simulation_details.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}


module.exports.get_simulationdetails = async (req, res) => {
  try {
    var get_simulationdetails = await pool.query("select * from simulation where flight_id=$1",[req.body.flight_id]);
    
   
    return get_simulationdetails.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}


/*deleting simulation*/
module.exports.deleteSimulation = async (flight_id) => {
  try {
      var result = await pool.query("DELETE FROM simulation WHERE flight_id = $1", [flight_id]);
      console.log(result.rowCount + " row deleted");
      return result.rowCount; 
  } catch (err) {
      console.error("Error deleting simulation:", err);
      throw err; 
};
}



/*All succesful sim details*/
module.exports.successfulsimdetails = async (req, res) => {
  try {
    var successfulsim_details = await pool.query("SELECT * FROM simulation");
    return successfulsim_details.rows;
  } catch (e) {
    console.error(e);
    res.json({ errors: 'Invalid' });
  }
};

module.exports.get_successfulsimdetails = async (req, res) => {
  try {
    var get_successfulsimdetails = await pool.query("SELECT * FROM simulation WHERE flight_id=$1", [req.body.flight_id]);
    return get_successfulsimdetails.rows[0];
  } catch (e) {
    console.error(e);
    res.json({ errors: 'Invalid' });
  }
};

module.exports.edit_simulation_details = async (req, res) => {
  try {
    var flightinfo = req.body;
    var edit_simulation_details = await pool.query("UPDATE simulation SET date=$1, names=$2, start_time=$3, end_time=$4, description=$5, total_minutes=$6 WHERE flight_id=$7", [flightinfo.date, flightinfo.names, flightinfo.start_time, flightinfo.end_time, flightinfo.description, flightinfo.total_minutes, flightinfo.flight_id]);
    var after_edit = await pool.query("SELECT * FROM simulation");
    return after_edit.rows;
  } catch (err) {
    console.log(err);
    res.status(401).json('Cannot Edit flight details..........');
  }
};

module.exports.edit_simulationdetails = async (req, res) => {
  try {
    var flight_id = req.body.flight_id;
    var edit_info = await pool.query("SELECT * FROM simulation WHERE flight_id=$1", [flight_id]);
    res.render('edit_simulation_details', { layout: false, simulation: edit_info.rows[0] });
  } catch (e) {
    console.error(e);
    res.json({ errors: 'Invalid' });
  }
};