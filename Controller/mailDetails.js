
const pool=require("../database");


//get all flight  details  

module.exports.totalsuccesfulflights= async (mail) => {
    try {
        email=mail;
     
      var total_succesfulflights= await pool.query("select count(flight_id) from flight_description where result=true and date=CURRENT_DATE and emailid=$1",[email]);
      console.log(total_succesfulflights.rows);
      console.log(total_succesfulflights.rows[0].count+"hellonitte")
      return total_succesfulflights.rows[0].count;
    }
    catch (e) {
      console.error(e)
    
  
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




  module.exports.totalcrashes= async (mail) => {
    try {
        email=mail;
     console.log("in totalcrashes")
      var total_crashes= await pool.query("select count(flight_id) from flight_description where result=false and date=CURRENT_DATE and emailid=$1",[email]);
      console.log(total_crashes.rows);
      console.log(total_crashes.rows[0].count+"hellonitte")
    
      return total_crashes.rows[0].count;
    }
    catch (e) {
      console.error(e)

  
    }
  }

  module.exports.successfulflightgraph= async (mail) => {
    try {
        email=mail;
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
    //   res.json({
    //     errors: 'Invalid'
    //   });
  
    }
  }

  module.exports.totalflighttimegraph= async (mail) => {
    try {
      email=mail;
     console.log("in total flight graph")
     var result2 = await pool.query('select d.drone_name as label,sum(duration)as value from drones d,flight_description where d.drone_id=flight_description.drone_id and emailid=$1 group by d.drone_name',[email]);
    return result2.rows;
      
    }
    catch (e) {
      console.error(e)
    //   res.json({
    //     errors: 'Invalid'
    //   });
  
    }
  }

  module.exports.damageditemsgraph= async (mail) => {
    try {
      email=mail;
     console.log("in damaged items graph")
     var result3 = await pool.query('SELECT fci.items_name as label, SUM(cd.items_cost) AS value FROM flight_crash_items fci JOIN flight_description fd ON fci.flight_id = fd.flight_id JOIN cost_details cd ON fci.items_name = cd.items_name WHERE fd.emailid =$1 GROUP BY fci.items_name',[email]);
      return result3.rows;
      
    }
    catch (e) {
      console.error(e)
    //   res.json({
    //     errors: 'Invalid'
    //   });
  
    }
  }

  module.exports.batteryusagegraph= async (mail) => {
    try {
      email=mail;
     console.log("in battery usage graph")
     var result4 = await pool.query('select batteryid as label,count(batteryid)as value from flight_description where emailid=$1 group by batteryid',[email]);
      return result4.rows;
      
    }
    catch (e) {
      console.error(e)
    //   res.json({
    //     errors: 'Invalid'
    //   });
  
    }
  }
  
  
  module.exports.simulationgraphmem= async (mail) => {
    try {
      email=mail;
     console.log("simulation graph mem");
      var result5= await pool.query("select names as label,sum(total_minutes) as value ,date(date) as day from simulation where email=$1 group by names,date(date)order by day ",[email]);
      console.log(result5.rows);
      return result5.rows;

    }
    catch (e) {
      console.error(e)
    //   res.json({
    //     errors: 'Invalid'
    //   });
  
    }
  }



  
module.exports.reportDetails=async(mail)=>{
    try{
     const email=mail;
     console.log(email);
    
    
    
     const flightResult = await pool.query(
      `SELECT date, copilot, duration, batteryid, takeoffvoltage, landingvoltage, windspeed, winddirection , flightdescription
       FROM Flight_description 
       WHERE emailid = $1`,
      [email]
    );
    
    const profile_data=await pool.query(
      `SELECT * FROM profile_data  WHERE emailid = $1`,
      [email]
    )
    
    
    let tabledetails , maindetails = [];
    if (flightResult.rows.length > 0 || profile_data.rows.length > 0){
      tabledetails = flightResult.rows;
      maindetails=profile_data.rows;
      console.log(tabledetails);
      console.log(maindetails);
    }
    
    
    return {tabledetails, maindetails};
    
    }
    catch(e){
      console.log("error::",e)
    }
    
    };
    
    
    
    
    
    //succesful flights
    module.exports.flightdetails = async (mail) => {
      try {
        const email = mail;
        console.log(email);
    
        // Get all drone IDs and names
        const droneQuery = await pool.query(`SELECT drone_id, drone_name FROM drones`);
        const drones = droneQuery.rows;
    
        // Get flight durations for each drone and calculate the total duration
        const results = [];
        let totalDuration = 0;
    
        for (const drone of drones) {
          const planeId = drone.drone_id;
          const droneName = drone.drone_name;
    
          const durationQuery = await pool.query(
            `SELECT duration FROM flight_description WHERE drone_id = $1 AND emailid = $2`,
            [planeId, email]
          );
          
          const durations = durationQuery.rows.map(row => parseInt(row.duration, 10));
          const droneDuration = durations.reduce((acc, curr) => acc + curr, 0);
    
          results.push({
            planeId,
            droneName,
            duration: droneDuration, // Modified: Use the sum of durations for the drone
          });
    
          totalDuration += droneDuration;
        }
    
        console.log(results);
        console.log(totalDuration);
    
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
         
        const itemcostQuery = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name', [email]);
        const itemcost = itemcostQuery.rows.map(item => ({
          label: item.label,
          value: parseFloat(item.value)
        }));
        
        console.log(itemcost);
    
        const query4 = await pool.query(`
          SELECT
            fd.flight_id,
            fd.mode,
            fd.date,
            fd.drone_id,
            fd.emailid,
            fd.duration,
            fd.result,
            fd.batteryid,
            fd.takeoffvoltage,
            fd.landingvoltage,
            fd.windspeed,
            fd.winddirection,
            fd.copilot,
            d.drone_name
          
          FROM
            flight_description fd
          JOIN
            drones d ON d.drone_id = fd.drone_id
          WHERE
            fd.result = true
            AND fd.emailid = $1;
        `, [email]);
    
        console.log(query4);
        const crashDetails = query4.rows;
        if(crashDetails[0].drone_id){
          const droneId = crashDetails[0].drone_id;
          };
    
        const crashdetails = await pool.query(`
              
        
        
        SELECT
      fd.drone_id,
      d.drone_name,
      fd.flight_id,
      fd.mode,
      fd.date,
      fd.duration,
      fd.emailid,
      fd.result,
      fd.copilot,
      c.total_cost
    FROM
      flight_description fd
    JOIN
      drones d ON fd.drone_id = d.drone_id
    LEFT JOIN
      (
          SELECT
              SUM(c.items_cost) AS total_cost,
              f.flight_id
          FROM
              cost_details c
          JOIN
              flight_crash_items f ON f.items_name = c.items_name
          GROUP BY
              f.flight_id
      ) AS c ON c.flight_id = fd.flight_id
    WHERE
      fd.emailid = $1
      AND fd.result = false;
        `, [email]);
    
        const items_name=(await pool.query('select items_name from cost_details')).rows;
    
        const crashdetailsrows = crashdetails.rows;
        let totalsum = 0;
    
    if (crashdetailsrows.length > 0) {
        crashdetailsrows.forEach(row => {
          console.log("Row:", row);
          console.log("Rowtotal:", row.total_cost);
            if (row.total_cost) {
                totalsum += Number(row.total_cost);
                console.log("Updated totalsum:", totalsum);
            }
        });
    }
    console.log("totalsum:", totalsum);
    
    
    let totaldur=0;
    
    const dur=await pool.query(`select duration from flight_description WHERE emailid = $1`,
      [email])
    const durationrow=dur.rows;
    
    
    if (durationrow && durationrow.length > 0) {
      durationrow.forEach(row => {
        console.log("Row:", row);
        
          if (row && row.duration ) {
              totaldur+=Number(row.duration);
              console.log("Updated totalsum:", totaldur);
          }
      });
    }
    
    
    
    
    
    
    
    
        console.log("hello this is crash details...........")
        console.log(crashdetailsrows);
        console.log("hello this is crash details...........")
        const flighttime = await pool.query(
          'SELECT drone_name AS label, SUM(duration) AS count FROM flight_description, drones WHERE flight_description.drone_id = drones.drone_id AND emailid = $1 GROUP BY drones.drone_name',
          [email]
        );
        console.log("items_name in controller........")
        console.log(items_name)
        console.log("items_name in controller........")
        
    
        return { totalDuration, results, crashDetails, crashdetailsrows, trueCount, falseCount, itemcost,flighttime ,items_name,totalsum,totaldur};
      } catch (err) {
        console.log('In controller catch..............')
        console.log(err);
        return { totalDuration: 0, results: [], query4: [], crashdetails: [], trueCount: 0, falseCount: 0, itemcost: [] ,flighttime:[],totalsum:0,totaldur:0};
      }
    };


  
