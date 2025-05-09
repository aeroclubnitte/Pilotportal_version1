const express = require("express");

const router = express.Router();

const flightdetail = require("../Controller/admin_dashboard_controller");

const jwt=require("jsonwebtoken");
const pool=require("../database");


router.get('/admin', checkToken, async (req, res) => {
  try {
    const { email } = req.user; // Get the email from the decoded token

    // Check if the email matches the admin credentials
    if (email === "infinitydronesadmin@gmail.com") {
      const a = await flightdetail.totalsuccesfulflights(req, res);
      const b = await flightdetail.totalcrashes(req, res);
      console.log("Total number of successful flights and crashes....");
      console.log(a);
      console.log(b);
      console.log("Total number of successful flights and crashes....");

      const data1 = await flightdetail.successfulflightgraph(req, res);
      console.log("Successful graph............... ");
      console.log(data1);
      console.log("Total number of successful flights and crashes:");

      const data2 = await flightdetail.crashgraph(req, res);
      console.log(data2);

      const data3 = await flightdetail.damageditemsgraph(req, res);
      console.log(data3);

      const data4 = await flightdetail.batteryusagegraph(req, res);
      console.log(data4);

      const data5=await flightdetail.simulationgraph(req,res);
      console.log(data5);



      res.render('admin', { layout: false, successful: a, crashes: b, data1: data1, data2: data2, data3: data3,data4: data4,data5:data5});
    } else {
      res.status(403).send("You don't have access to this field.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
function checkToken(req, res, next) {
  const authcookie = req.cookies.authcookie;
  const email = req.cookies.email;
  console.log(email);
  console.log(authcookie);

  jwt.verify(authcookie, "sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh", (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const decodedEmail = data.emailid.trim(); // Trim whitespace from the decoded email
      req.user = { email: decodedEmail }; // Set the decoded email in the req.user object
      next();
    }
  });
}








module.exports=router;