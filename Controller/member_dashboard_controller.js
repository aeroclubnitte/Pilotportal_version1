// handles storing new test created 
const { check } = require("express-validator");
const pool=require("../database");


//get all flight  details  

module.exports.totalsuccesfulflights= async (req, res) => {
    try {
        email=req.cookies.email;
     console.log("hello welcome..................")
      var total_succesfulflights= await pool.query("select count(flight_id) from flight_description where result=true and date=CURRENT_DATE and emailid=$1",[email]);
      console.log(total_succesfulflights.rows);
      console.log(total_succesfulflights.rows[0].count+"hellonitte")
      return total_succesfulflights.rows[0].count;
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }



module.exports.isEmailInProfileData = async (email) => {
    //const client = await pool.connect();
    try {
      const res = await pool.query('SELECT 1 FROM profile_data WHERE emailid = $1', [email]);
      return res.rows.length > 0;
    }
    catch(e) {
      console.log(e);
    }
  };




  module.exports.totalcrashes= async (req, res) => {
    try {
        email=req.cookies.email;
     console.log("hello welcome..................")
      var total_crashes= await pool.query("select count(flight_id) from flight_description where result=false and date=CURRENT_DATE and emailid=$1",[email]);
      console.log(total_crashes.rows);
      console.log(total_crashes.rows[0].count+"hellonitte")
    
      return total_crashes.rows[0].count;
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

  module.exports.successfulflightgraph= async (req, res) => {
    try {
        email=req.cookies.email;
        const trueCountQuery = await pool.query(
            "SELECT COUNT(flight_id) AS trueCount FROM flight_description WHERE result='true' AND emailid=$1",
            [email]
          );
          const falseCountQuery = await pool.query(
            "SELECT COUNT(flight_id) AS falseCount FROM flight_description WHERE result='false' AND emailid=$1",
            [email]
          );
      
          const trueCount = trueCountQuery.rows[0].truecount;
          const falseCount = falseCountQuery.rows[0].falsecount;
           
      return {trueCount,falseCount};
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

  module.exports.totalflighttimegraph= async (req, res) => {
    try {
      email=req.cookies.email;
     console.log("hello welcome to this flying ..................")
     var result2 = await pool.query('select d.drone_name as label,sum(duration)as value from drones d,flight_description where d.drone_id=flight_description.drone_id and emailid=$1 group by d.drone_name',[email]);
    return result2.rows;
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

  module.exports.damageditemsgraph= async (req, res) => {
    try {
      email=req.cookies.email;
     console.log("hello welcome..................")//below they have used 2 joins together
     var result3 = await pool.query('SELECT fci.items_name as label, SUM(cd.items_cost) AS value FROM flight_crash_items fci JOIN flight_description fd ON fci.flight_id = fd.flight_id JOIN cost_details cd ON fci.items_name = cd.items_name WHERE fd.emailid =$1 GROUP BY fci.items_name',[email]);
      return result3.rows;
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

  module.exports.batteryusagegraph= async (req, res) => {
    try {
      email=req.cookies.email;
     console.log("hello welcome..................")
     var result4 = await pool.query('select batteryid as label,count(batteryid)as value from flight_description where emailid=$1 group by batteryid',[email]);
      return result4.rows;
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }
  
  
  module.exports.simulationgraphmem= async (req, res) => {
    try {
      email=req.cookies.email;
     console.log("hello welcome..................")
      var result5= await pool.query("select names as label,sum(total_minutes) as value ,date(date) as day from simulation where email=$1 group by names,date(date)order by day ",[email]);
      console.log(result5.rows);
      return result5.rows;

    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }



  