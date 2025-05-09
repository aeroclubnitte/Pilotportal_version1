// handles storing new test created 
const { check } = require("express-validator");
const pool=require("../database");

//get list of flight schedules  

module.exports.flightlist = async (req, res) => {
  try {
   console.log("hello welcome..................")
    var flight_list = await pool.query("select flight_id, email, date, time, description, copilot, called from schedule");
    console.log(flight_list.rows);
    console.log("hello nishmitha..................")
    console.log(flight_list.rows[0].flight_id+"hellonitte")
    return flight_list.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

module.exports.get_flight = async (req, res) => {
  try {
    var get_flight = await pool.query("select flight_id, email, date, time, description, copilot, called from schedule where flight_id=$1",[req.body.flight_id]);
    
   
    return get_flight.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

/*schedule new flight*/
module.exports.flight_schedule_insert=async (req,res)=>{
   try{
       console.log(req.body)
       var {email, date, time, description, copilot}= req.body;
      var flight_schedule_insert = await pool.query("insert into schedule (email, date, time, description, copilot) values ($1, $2, $3, $4, $5)",[email, date, time, description, copilot])
   }
   catch (e) {
    console.error(e)
    res.json(500);}

}

/*delete a flight schedule*/
module.exports.deleteschedules = async (req, res) => {
   try {
       var remove = []
       var Data = req.body;
       console.log(Data)
       console.log("qb")
       var schedules = await pool.query("select * from schedule")
       console.log(schedules.rows[0].flight_id)
       console.log("hello")
       var b = await pool.query("delete from schedule where flight_id =$1", [Data.deleteschedule])
         
           console.log(b)


       
   var new_list_after_delete = await pool.query("select flight_id, email, date, time, description, copilot, called  from schedule");
       console.log(new_list_after_delete.rows);
       console.log("New flight Schedules...")
       return new_list_after_delete.rows;

   } catch (err) {
       console.log(err)
       res.status(401).json("Cannot Delete a Schedule........")
   }
}


/*edit flight schedules*/

module.exports.editschedules = async (req, res) => {
   try {
       var flightinfo = req.body
       console.log(flightinfo)
       console.log(flightinfo.flight_id+"helloworld12345")
       console.log("1")
       
       var edit_schedule = await pool.query("update schedule set email=$1,date=$2,time=$3,description=$4,copilot=$5,called=$6 where flight_id=$7", [flightinfo.email, flightinfo.date, flightinfo.time, flightinfo.description, flightinfo.copilot, flightinfo.called,flightinfo.flight_id])
       console.log(edit_schedule);
       console.log("edited")
       var after_edit_schedule_list = await pool.query("select flight_id, email, date, time, description, copilot, called  from schedule");
       console.log(after_edit_schedule_list.rows);
       console.log("after")
       return after_edit_schedule_list.rows;
   } catch (err) {
       console.log(err)
       res.status(401).json('Cannot Reschedule..........')
   }
};


module.exports.edit_schedules = async (req, res) => {
   try {
       var editData = req.body
       
       var edit_info = await pool.query("select * from schedule where flight_id=$1", [editData.editschedule]);
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

/*Edit the flight schedule form*/
module.exports.alterScheduleTable=async(req,res)=>{
   let create_column='alter table schedule'
   let create=' add column '
     let column_name=req.body.fieldname;
     let column_query=create_column.concat(create).concat(column_name).concat( ' varchar')
     await pool.query(column_query)
     console.log(column_query);
     console.log("query string.....");
   
   }




   module.exports.simulate_ret_admin=async (req,res)=>{
    try{
      //const email = req.cookies.email;
        // console.log(req.body)

        // var simulate_ret_admin=req.body;
        //var { name,date, start_time,end_time, description}= req.body;
       var simulate_retr_admin= await pool.query("select * from simulation " )
       console.log("retrieving");
       console.log(simulate_retr_admin.rows)
       return simulate_retr_admin.rows;
    }
    catch (e) {
     console.error(e)
     res.json(500);}
  
  }
       