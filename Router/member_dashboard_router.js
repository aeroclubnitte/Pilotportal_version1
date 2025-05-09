const express = require("express");

const router = express.Router();

const flightdetail = require("../Controller/member_dashboard_controller");

const jwt=require("jsonwebtoken");
const pool=require("../database");




router.get('/member_dashboard', checkToken, async (req, res) => {
  try {
    const { email } = req.user; 
    
    // Get the email from the decoded token
    
    console.log("Email check email check in member_dashboard");
    console.log(email);
    console.log("Email check email check in member_dashboard");
    const emailExists = await flightdetail.isEmailInProfileData(email);
    console.log("checking email exists");
    console.log(emailExists);
    console.log("checking email exists");
   // Check if the email matches the admin credentials
   
      const a = await flightdetail.totalsuccesfulflights(req, res);
      const b = await flightdetail.totalcrashes(req, res);
      console.log("Total number of successful flights and crashes....");
      console.log(a);
      console.log(b);
      console.log("Total number of successful flights and crashes....");

      var {trueCount,falseCount}= await flightdetail.successfulflightgraph(req, res); 
      //this again gives the sucess and crash count
      console.log("Successful graph............... ");
      console.log(trueCount);
      console.log(falseCount)
      console.log("Total number of successful flights and crashes:");
      

       console.log('hello ankith.........')
      const data2 = await flightdetail.damageditemsgraph(req, res);
      console.log(data2);
      console.log('hello ankith.........')



      console.log("hello aditi bhat........")
      const data3 = await flightdetail.totalflighttimegraph(req, res);
      console.log("hello aditi bhat dinamani........")
      console.log(data3);
      console.log("hello aditi bhat........")

      console.log("hello nishmitha ")
      const data4 = await flightdetail.batteryusagegraph(req, res);
      console.log(data4);
      console.log("hello nishmitha ")


      const data5=await flightdetail.simulationgraphmem(req,res);
      console.log(data5);
      res.render('dashboard', { layout: false, successful: a, crashes: b,data2: data2, data3: data3, data4:data4,data5:data5,trueCount,falseCount,emailExists});
     
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
// function checkToken(req, res, next) {
//   const authcookie = req.cookies.authcookie;
//   const email = req.cookies.email;
//   console.log(email);
//   console.log(authcookie);

//   jwt.verify(authcookie, "sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh", (err, data) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       const decodedEmail = data.emailid.trim(); // Trim whitespace from the decoded email
//       req.user = { email: decodedEmail }; // Set the decoded email in the req.user object
//       next();
//     }
//   });
// }

function checkToken(req, res, next) {
  const authcookie = req.cookies.authcookie;
  if (!authcookie) {
      return res.sendStatus(403); // ✅ Return to prevent further execution
  }

  jwt.verify(authcookie, "sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh", (err, data) => {
      if (err) {
          return res.sendStatus(403); // ✅ Return after sending a response
      }
      req.user = { email: data.emailid.trim() };
      next();
  });
}


module.exports=router;