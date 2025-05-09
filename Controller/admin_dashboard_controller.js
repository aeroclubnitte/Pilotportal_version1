// handles storing new test created 
const { check } = require("express-validator");
const pool=require("../database");


//get all flight  details  

module.exports.totalsuccesfulflights= async (req, res) => {
    try {
     console.log("hello welcome..................")
      var total_succesfulflights= await pool.query("select count(flight_id) from flight_description where result=true and date=CURRENT_DATE");
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

  module.exports.totalcrashes= async (req, res) => {
    try {
     console.log("hello welcome..................")
      var total_crashes= await pool.query("select count(flight_id) from flight_description where result=false and date=CURRENT_DATE");
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
     console.log("hello welcome..................")
     var result1 = await pool.query('select name as label,count(flight_id) as value from flight_description,signup where result=true and flight_description.emailid=signup.emailid group by name');
     console.log("iam checking..................")
     console.log(result1.rows)
     console.log("iam checking..................")
      return result1.rows;
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }

  module.exports.crashgraph= async (req, res) => {
    try {
     console.log("hello welcome..................")
     console.log("hello nishmitha s")
     var result2 = await pool.query('select name as label,count(flight_id) as value from flight_description,signup where result=false and flight_description.emailid=signup.emailid group by name');
     console.log(result2);
     console.log("hello nishmitha s")
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
     console.log("hello welcome..................")
     var result3 = await pool.query('SELECT items_name AS label, COUNT(items_name) AS value FROM flight_crash_items GROUP BY items_name');
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
     console.log("hello welcome..................")
     var result4 = await pool.query('select batteryid as label,count(batteryid)as value from flight_description group by batteryid');
      return result4.rows;
      
    }
    catch (e) {
      console.error(e)
      res.json({
        errors: 'Invalid'
      });
  
    }
  }
  
  
  module.exports.simulationgraph= async (req, res) => {
    try {
     console.log("hello welcome..................")
      var result5= await pool.query("select names as label,sum(total_minutes) as value from simulation group by names");
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