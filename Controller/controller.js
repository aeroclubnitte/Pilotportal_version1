const express=require('express');
const uuid = require('uuid');
const jwt=require("jsonwebtoken");
const app=express();
const twilio = require('twilio');


const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())
const flightdetail = require("./member_dashboard_controller");

const pool=require("../database");
const { cookie } = require('express/lib/response');
const { use } = require('../Router');
require('dotenv').config();


const ejs =require('ejs');
const puppeteer=require('puppeteer');



// module.exports.generateReport=async(req,res)=>{

//  try{
//   const browser=await puppeteer.launch();
//   const page=await browser.newPage();
//   await page.goto(`${req.protocol}://${req.get('host')}`+"/pdftemplate",{
//     waitUntil:"networkidle2"
//   });
//  await page.setViewport({width:1680,height:1050});
  
//  const today=new Date();
//  const pdfn=await page.pdf({
//   path: `${
//     path.join(__dirname,'../uploads/pdfs',today.getTime()+".pdf")}`,
//     printBackground:true,
//     format:"A4"
    
//  });

//  await browser.close();
//  const pdfurl=path.join(__dirname,'../uploads/pdfs',today.getTime()+".pdf")

// res.set({
//   "Content-type":"application/pdf",
//   "Content-Length":pdfn.length
// });

// res.sendFile(pdfurl)


//  }catch(error){
//   console.log(error.message);
//  }



// }














module.exports.datahere=async(req,res)=>{
    try{
        const k=await pool.query("select * from signup");
        return k.rows;

    }
    catch(err){
        console.log(err)
    }

}


// module.exports.signup=async(req,res)=>{
//     try {
//         console.log("User Authentication");
//         let errors=[];
//         let {name,emailid,password,cpassword,phone_number}=req.body;

//         console.log({
//             name,emailid,password,cpassword,phone_number
//         })
       
//         if(!name||!emailid||!password||!cpassword||phone_number){
//             errors.push({message:"Please enter all fields"})
//         }
//         if(password.length<=6){
//             console.log('not 6 characters')
//             errors.push({message:"Password should be of at least 6 characters"});
//         }
//         if(password!=cpassword){
//             errors.push({message:"Password do not match"})
//         }
//         if(errors.length>0){
//             //Forms Validation has passed

//             pool.query(`SELECT * FROM signup WHERE emailid=$1`,[emailid],(err,results)=>{
//                 if(err){
//                     throw err;
//                 }
//                 console.log(results.rows);
//                 if(results.rows.length>0){
//                     errors.push({message:"email already registered "})
//                     console.log(errors)
//                     res.render("signup",{errors})
                    
//                 }else{
//                     pool.query("insert into signup (name,emailid,password,cpassword,phone_number)values($1,$2,$3,$4,$5)",[name,emailid,password,cpassword,phone_number]);
//                     res.redirect('/login')
//                 }
//             })
//         }




//         // console.log("hello");
//         // var{name,emailid,password,cpassword,phone_number}= req.body
//         // console.log(req.body)
//         // var x=await pool.query("insert into signup (name,emailid,password,cpassword,phone_number)values($1,$2,$3,$4,$5)",[name,emailid,password,cpassword,phone_number]);
//         // console.log(x)
//     }
//     catch(err){
//         console.log(err)
//     }

// }
//-------------------------------------------------------------------------------------
// module.exports.check=async(req,res)=>{
//     try{
//         console.log("User Authentication");
//         let {name,emailid,password,cpassword,phone_number}=req.body;

//         console.log({
//             name,emailid,password,cpassword,phone_number
//         })
//         let errors=[];
//         if(!name||!emailid||!password||!cpassword||phone_number){
//             errors.push({message:"Please enter all fields"})
//         }
//         if(password.length<6){
//             errors.push({message:"Password should be of at least 6 characters"});
//         }
//         if(password!=cpassword){
//             errors.push({message:"Password do not match"})
//         }
//         if(errors.length>0){
//             res.render('signup',{errors})
//         }
//         else{
//             //Forms Validation has passed

//             pool.query(`SELECT * FROM signup WHERE emailid=$1`,[emailid],(err,results)=>{
//                 if(err){
//                     throw err;
//                 }
//                 console.log(results.rows);
//                 if(results.rows.length>0){
//                     errors.push({message:"email already registered "})
//                     res.render("signup",{errors})
//                 }
//             })
//         }
//     }
//     catch(err){
//         console.log(err);
//     }
// }
//--------------------------------------------------------------------------------

// module.exports.logincheck = async (req, res) => {
//     try {
//       console.log("Checking Login Credentials");
//       let { emailid, password } = req.body;
//       console.log({
//         emailid,
//         password,
//       });
  
//       if (emailid === "infinitydronesadmin@gmail.com" && password === "Admin@2023@infinitydrones") {
//         console.log("Admin login successful");
//         const  = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');
  
//         console.log(token);
//         res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
//         res.cookie('email', emailid);
//         res.redirect('/admin');
//       } else {
//         pool.query(
//           'SELECT * FROM signup WHERE emailid = $1 AND password = $2',
//           [emailid, password],
//           (err, results) => {
//             console.log(results.rows);
//             if (err) {
//               throw err;
//             } else {
//               if (results.rows.length > 0) {
//                 console.log("Successful");
//                 const userEmail = results.rows[0].emailid;
//                 console.log(userEmail);
//                 const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');
                
//                 console.log(token);
//                 res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
//                 res.cookie('email', userEmail);
//                 res.redirect('/member_dashboard');
//               } else {
//                 console.log("Wrong Email password");
//                 res.render('login');
//               }
//             }
//           }
//         );
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//-----------------------------------------------------------------
const bcrypt = require('bcrypt');
module.exports.signup=async(req,res)=>{
    try {
        console.log("User Authentication");
        let errors=[];
        let {name,emailid,password,cpassword,phone_number}=req.body;

        console.log({
            name,emailid,password,cpassword,phone_number
        })
       
        if(!name||!emailid||!password||!cpassword||phone_number){
            errors.push({message:"Please enter all fields"})
        }
        if(password.length<=6){
            console.log('not 6 characters')
            errors.push({message:"Password should be of at least 6 characters"});
        }
        if(password!=cpassword){
            errors.push({message:"Password do not match"})
        }
        if(errors.length>0){
            //Forms Validation has passed

            pool.query(`SELECT * FROM signup WHERE emailid=$1`,[emailid],async(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                if(results.rows.length>0){
                    errors.push({message:"email already registered "})
                    console.log(errors)
                    res.render("signup",{errors})
                    
                }else{
                  try{
                    const hashedpassword= await bcrypt.hash(password,10);
                    const hashedcpassword= await bcrypt.hash(cpassword,10);
                    pool.query("insert into signup (name,emailid,password,cpassword,phone_number)values($1,$2,$3,$4,$5)",[name,emailid,hashedpassword,hashedcpassword,phone_number]);
                    res.redirect('/login')
                  }catch(error){
                    console.log("here is the error");
                    throw error;
                  }
                    
                }
            })
        }
      }
      catch(err){
          console.log(err)
      }
  
  }

module.exports.logincheck = async (req, res) => {
  try {
      console.log("Checking Login Credentials");
      let { emailid, password } = req.body;
      console.log({
          emailid,
          password,
      });

      if (emailid === "infinitydronesadmin@gmail.com" && password === "Admin@2023@infinitydrones") {
          console.log("Admin login successful");
          const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');

          console.log(token);
          res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
          res.cookie('email', emailid);
          res.redirect('/admin');
        } else {
            pool.query(
                'SELECT * FROM signup WHERE emailid = $1',
                [emailid],
                async (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        if (results.rows.length > 0) {
                            const storedHashedPassword = results.rows[0].password;
                            const isPasswordMatch = await bcrypt.compare(password, storedHashedPassword);
                            if (isPasswordMatch) {
                                console.log("Successful");
                                const userEmail = results.rows[0].emailid;
                                console.log(userEmail);
                                const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');
                              console.log("tokenhere")
                                console.log(token);
                                console.log("tokenhere2")
                                res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
                              
                                res.cookie('email', userEmail);
                                console.log("logincheck")
                                res.redirect('/member_dashboard');
                            } else {

                                console.log("Wrong Email password");
                                res.render('login');
                            }
                        } else {
                            console.log("User not found");
                            res.render('login');
                        }
                    }
                }
            );
        }
    } catch (err) {
        console.log(err);
    }
};  

  
module.exports.flightdata=async(req,res)=>{
    try{
        const k=await pool.query("select * from flight_description");
        return k.rows;

    }
    catch(err){
        console.log(err)
    }

}

module.exports.flying=async(req,res)=>{
  const email=req.cookies.email;
  const emailExists = await flightdetail.isEmailInProfileData(email);
    try{
      
        const answer=req.body.answer;
        console.log("flying answer.....................")
        console.log(answer)
        console.log("flying answer.....................")
        const selectedDroneId=req.body.drone_id;
        console.log(selectedDroneId)
        const [drone_name,droneId]=selectedDroneId.split('-');
        console.log(drone_name,droneId)
        
        
            const query1= await pool.query(`SELECT drone_id FROM drones WHERE drone_name=$1`,[drone_name]);
            console.log(query1.rows);
            console.log(query1[2])

        if(answer==='yes'){
        console.log("let's fly");
        var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,Description}=req.body
        console.log(req.body)
        var result=true;
        var y=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,flightdescription) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,Description]);
        console.log(y);
        res.redirect('/pilotflightdetails')
        }
        else if(answer==='no'){
            var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,Description}=req.body
            var result=false;
            var n=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,flightdescription) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,result,Description]);
            console.log("Insertion Successful")
        console.log(n);
        const email=req.cookies.email
        console.log(email);
        const autoid=req.cookies.autoid
        console.log(autoid)
            res.render('crash',{email:email,autoid:autoid,emailExists});
        }
        else{
            res.status(400).send("Invalid answer'")
        }




    }
    catch(err){
        console.log(err)
    }
}

module.exports.profile=async(req,res)=>{
  try{
    const email=req.cookies.email;
    console.log(req.body);
    var{name,emailid,mobile_no,dob,startdate,type_of_drone_experience,honors_and_achievements}=req.body;
    var profile_insert=await pool.query(`Insert into profile_data(name,emailid,mobileno,dob,drone_experience,honours_achievements,startdate)VALUES ($1,$2,$3,$4,$5,$6,$7)`,[name,emailid,mobile_no,dob,type_of_drone_experience,honors_and_achievements,startdate]);
    
  }
  catch(e){

    console.error(e)
    res.json(500);
  }
}

// module.exports.updateProfile=async(req,res)=>{
//   try {
//     const email=req.cookies.email;
//     var{ name, emailid, mobile_no, dob, type_of_drone_experience, honors_and_achievements } = req.body;
    
//     var updateQuery = `
//       UPDATE profile_data
//       SET name = $1,
//           mobileno = $2,
//           dob = $3,
//           drone_experience = $4,
//           honours_achievements = $5
//       WHERE emailid = $6
//     `;
    
//     const values = [name, mobile_no, dob, type_of_drone_experience, honors_and_achievements,emailid];
    
//     const result = await pool.query(updateQuery, values);
    
//     if (result.rowCount > 0) {
//       console.log({ message: 'profile data updated successfully in pgadmin' });
//     } else {
//       const errorInText = await response.text();
//       console.error('Error found:',errorInText );
//       //res.status(404).json({ message: 'Profile not found' });
//     }
//   } catch (e) {
//     console.error('Error updating profile:', e);
//     //res.status(500).json({ message: 'Failed to update profile' });
//   }

// }

module.exports.updateProfile = async (req, res) => {
  try {
    console.log("started updating")
    const email = req.cookies.email;
    console.log("Email check here at updateprofile");
    console.log(req.body.email);
    console.log("Email check here at updateprofile");

    const { name, emailid, mobile_no, dob,startdate , type_of_drone_experience, honors_and_achievements} = req.body;

    
    if (email !== emailid) {
      return res.status(400).json({ message: 'Email mismatch' });
    }
    const emailIdString = String(emailid);
console.log("testing");
    // Log the values for debugging
    console.log({
      name,
      mobile_no,
      dob,
      type_of_drone_experience,
      honors_and_achievements,
      emailid: emailIdString,
      startdate
    });
    const updateQuery = `
      UPDATE profile_data
      SET name = $1,
          mobileno = $2,
          dob = $3,
          drone_experience = $4,
          honours_achievements = $5,
          startdate=$6
      WHERE emailid = $7
    `;

    const values = [name, mobile_no, dob, type_of_drone_experience, honors_and_achievements,startdate,emailid];

    const result = await pool.query(updateQuery, values);

    if (result.rowCount > 0) {
      console.log({ message: 'Profile data updated successfully in pgadmin' });
      //res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      console.error('Profile not found');
      //res.status(404).json({ message: 'Profile not found' });
    }
  } catch (e) {
    console.error('Error updating profile:', e);
    //res.status(500).json({ message: 'Failed to update profile' });
  }
};



// module.exports.updateProfileListAdmin = async (email,req, res) => {
//   try {
//     const bodyemail = req.body.emailid;
//     const paraemail=req.params.email;
//     console.log("Email check here at updateprofile");
//     //console.log(req.body.email);
//     console.log("Email check here at updateprofile");

//     const { name,mobile_no, dob, type_of_drone_experience, honors_and_achievements } = req.body;

    
//     if (bodyemail !== paraemail) {
//       //return res.status(400).json({ message: 'Email mismatch' });
//       return console.log("Email at updateProfileListAdmin did not match ");
//     }
//     const emailIdString = String(emailid);

//     // Log the values for debugging
//     console.log({
//       name,
//       mobile_no,
//       dob,
//       type_of_drone_experience,
//       honors_and_achievements,
//       emailid: emailIdString,
//     });
//     const updateQuery = `
//       UPDATE profile_data
//       SET name = $1,
//           mobileno = $2,
//           dob = $3,
//           drone_experience = $4,
//           honours_achievements = $5
//       WHERE emailid = $6
//     `;

//     const values = [name, mobile_no, dob, type_of_drone_experience, honors_and_achievements,emailid];

//     const result = await pool.query(updateQuery, values);

//     if (result.rowCount > 0) {
//       console.log({ message: 'Profile data updated successfully in pgadmin' });
//       //res.status(200).json({ message: 'Profile updated successfully' });
//     } else {
//       console.error('Profile not found');
//       //res.status(404).json({ message: 'Profile not found' });
//     }
//   } catch (e) {
//     console.error('Error updating profile:', e);
//     //res.status(500).json({ message: 'Failed to update profile' });
//   }
// };




module.exports.updateProfileListAdmin = async (emailid, req, res) => {
  try {
      const { name, mobile_no, dob, type_of_drone_experience, honors_and_achievements } = req.body;

      // Ensure emailid is used correctly in your database query
      const updateQuery = `
          UPDATE profile_data
          SET name = $1,
              mobileno = $2,
              dob = $3,
              drone_experience = $4,
              honours_achievements = $5
          WHERE emailid = $6
      `;

      const values = [name, mobile_no, dob, type_of_drone_experience, honors_and_achievements, emailid];

      // Execute the query using your database connection
      const result = await pool.query(updateQuery, values);

      if (result.rowCount > 0) {
          console.log('Profile data updated successfully');
          //res.status(200).json({ message: 'Profile updated successfully' });
      } else {
          console.error('Profile not found');
          //res.status(404).json({ message: 'Profile not found' });
      }
  } catch (error) {
      console.error('Error updating profile:', error);
      //res.status(500).json({ message: 'Failed to update profile' });
  }
};








module.exports.droneslistdata=async(req,res)=>{
  const email=req.cookies.email;
  const emailExists = await flightdetail.isEmailInProfileData(email);
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
        const userId = uuid.v4()  //uniquic id generation 
        res.cookie('autoid',userId);
        res.render('flying',{options:list,email:email,userId:userId,batteries:batteries,direction:winddirection,emailExists})
      
          
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
module.exports.crashdetails=async(req,res)=>{
    try{
        console.log("Crash Details Submission");
        let {drone_name,emailid,pilot_id,flight_id,reason}=req.body;
        console.log({
            drone_name,emailid,pilot_id,flight_id,reason
        })
        pool.query('INSERT INTO crash (drone_name,emailid,flight_id,reason)values($1,$2,$3,$4)',[drone_name,emailid,flight_id,reason]);
        console.log("Submission Successful");
        res.redirect('/pilotcrashdetails');
    }
    catch(err){
        console.log(err)
    }
}
module.exports.imageupload=async(req,res,next)=>{
    try{
    const imageData=req.file.buffer;
    const query={
        text:'INSERT INTO image (image_data) values ($1)',
        values:[imageData]
    };
    const result=await pool.query(query);
    res.json({id:result.rows[0].id})
}

catch(err){
next(err);
    // pool.query(query)
    // .then(result=>res.json({id:result.rows[0].id}))
    // .catch(err=>next(err));
}
};

module.exports.viewdetails=async(req,res)=>{
    try{
        const email=req.cookies.email
        console.log(email);
        const k=await pool.query(`SELECT * FROM flight_description WHERE emailid=$1`,[email]);
        return k.rows;
    }
    catch(err){
        console.log(err);
    }
}
module.exports.dashboard = async (req, res) => {
    try {
      const email = req.cookies.email;
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
        const query4=await pool.query(`SELECT
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
        d.drone_name
      FROM
        flight_description fd
      JOIN
        drones d ON d.drone_id = fd.drone_id
      WHERE
        fd.result = true
        AND fd.emailid = '${email}';
      `);
        console.log(query4)
        const crashDetails=query4.rows;
        const droneId=crashDetails[0].drone_id;
        const crashdetails = await pool.query(`
  SELECT
    flight_description.drone_id,
    drones.drone_name,
    flight_description.flight_id,
    flight_description.mode,
    flight_description.date,
    flight_description.duration,
    flight_description.emailid,
    flight_description.result,
   
  FROM
    flight_description
  JOIN
    drones ON flight_description.drone_id = drones.drone_id
  WHERE
    flight_description.emailid = '${email}' AND
    flight_description.result = false
`);

const items_cost=await pool.query('select * from cost_details');

        console.log("me here")
        console.log(crashdetails)
        // const crashdetails1=await pool.query(`SELECT * FROM crash where emailid=$1`,[email]);
        // var damagedParts="";
        console.log("H")
        console.log("H")
        console.log("h")
        // crashdetails1.rows.forEach(row => {
        //     damagedParts = row.damaged_parts;
        //     console.log(damagedParts)
        //     // Process each row's damaged_parts value
        //   });
        // console.log(damagedParts)
        // const mergedCrashDetails = {
        //     ...crashdetails,
        //     rows: crashdetails.rows.map(row => ({ ...row })),
        //     damagedParts: damagedParts
        //   };
        const crashdetailsrows=crashdetails.rows;
        console.log("checking crash details.......................")
        console.log(crashdetailsrows)
        
        // console.log("H")
        console.log(query4.drone_id);
        console.log(droneId)
        console.log("here controller",crashdetailsrows)
        return {totalDuration,results,crashDetails,crashdetailsrows};
        // let query3;
        // for(let i=0;i<query2.rows.length;i++)
        // {
        //     const dur=query2.rows[i];
        //     query3=await pool.query(`SELECT duration FROM flight_description WHERE drone_id=$1`,[dur]);
        // }
        
        // return k.rows;
        

    }
    catch(err)
    {
        console.log(err);
        return {totalDuration:0,results:[],query4:[],crashdetails:[]}
    }
}

    
// module.exports.costestimation = async (req, res) => {
//     return new Promise((resolve, reject) => {
//       const selectedParts = req.body.selectedParts;
  
//       const placeholders = selectedParts.map((_, i) => `$${i + 1}`);
//       const query = `
//         SELECT SUM(items_cost) AS total_cost
//         FROM cost_details
//         WHERE LOWER(items_name) IN (${placeholders})
//       `;
  
//       pool.query(query, selectedParts.map(part => part.toLowerCase()), (err, result) => {
//         if (err) {
//           console.error('Error executing SQL Query:', err);
//           reject(err);
//           return;
//         }
  
//         const totalPrice = result.rows[0].total_cost || 0;
//         resolve(totalPrice);
//       });
//     });
//   };
  
//   module.exports.insertdamagedparts=async(req,res)=>{
//     try{
//       console.log("newone............")
//         const email=req.body;

//         console.log(email);
//         console.log("newone............")
        
//     }
//     catch(err){
//         console.log(err);
//     }
// }

  /*  add the crash details to database*/
  // module.exports.insertdamagedparts = async (req, res) => {
    
  //     const selectedParts = req.body.selectedParts;
  //     const flight_id=req.body;
  //     console.log(selectedParts)
  //     console.log('insert_damaged_items_to_db')
  //     console.log(flight_id)
  
  //     // const placeholders = selectedParts.map((_, i) => `$${i + 1}`);
  //     // const query = `
  //     //   SELECT SUM(items_cost) AS total_cost
  //     //   FROM cost_details
  //     //   WHERE LOWER(items_name) IN (${placeholders})
  //     // `;
  
  //     // pool.query(query, selectedParts.map(part => part.toLowerCase()), (err, result) => {
  //     //   if (err) {
  //     //     console.error('Error executing SQL Query:', err);
  //     //     reject(err);
  //     //     return;
  //     //   }
  
  //     //   const totalPrice = result.rows[0].total_cost || 0;
  //     //   resolve(totalPrice);
  //   //   });
  //   ;
  // };
  
// res.send(`Total cost is: ${totalPrice}`);

// module.exports.insertdamagedparts = async (req, res) => {
//   try {
//     console.log("Crash item details submission");
//     var { flightId, selectedItems } = req.body;
//     console.log({
//       flightId,
//       selectedItems
//     });

//     for (var item of selectedItems) {
//       await pool.query('INSERT INTO flight_crash_items (flight_id, items_name) VALUES ($1, $2)', [flightId, item]);
//     }

//     console.log("Submission Successful");
//     res.redirect('/dashboard');
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports.insertdamagedparts = async (req,res) => {
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
    res.redirect('/pilotcrashdetails');
  } catch (err) {
    console.log(err);
  }
};



module.exports.reportDetails=async(req,res)=>{
try{
 const email=req.cookies.email;
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









  // pool.query(`SELECT date,copilot,duration,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection FROM Flight_description WHERE emailid=$1 `, [email], (err, result) => {
  //   if (err) {
  //     throw err;
  //   }
  //   else {
  //     if (result.rows.length > 0) {
  //       const tabledetails = result.rows;
  //       console.log(tabledetails);
  //     } else {
  //       tabledetails = [];
  //     }
  //   }
  // });


// var main_data=await pool.query(`SELECT name,emailid,mobileno,total_flight_hours,total_simulation_time FROM profile_data emailid=$1 `,[email])
// const main_datas=main_data.rows;
// console.log(main_datas);



return {tabledetails, maindetails};

}
catch(e){
  console.log("error::",e)
}





};

























//succesful flights
module.exports.flightdetails = async (req, res) => {
  try {
    const email = req.cookies.email;
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


module.exports.damageditemscostgraph= async (req, res) => {
  try {
    const email = req.cookies.email;
   console.log("hello welcome..................")
   var itemcost = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name',[email]);
    return itemcost.rows;
    
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

