const express=require('express');
const app=express();
const expressLayouts = require("express-ejs-layouts");
const bodyparser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const aws = require('aws-sdk');
const controller=require("./Controller/controller");
require('dotenv').config();
const {sending}=require("./Controller/mail")
// import { promisify } from 'util';
// import { generateUploadURL } from 's3.js';

const cron = require('node-cron');
const { extract_call_details } = require('./Controller/call_controller');
//sanjana added async funt here
setInterval(async () => {
  console.log("Checking for scheduled calls...");
  await extract_call_details();
}, 60000);
console.log("extract_call_details() function should have been executed.");


const cronSchedule = '* * * * *'; // Runs every 1 minutes
console.log('running a task every minute');

// Create a cron job
var jobcron = cron.schedule(cronSchedule, async () => {
  try {
    await extract_call_details();
    console.log("call executed");
  } catch (error) {
    console.error(error);
  }
});


// cron to generate,mail the report to admin and pilots every 15 days
var reportMail = cron.schedule('0 0 1,16 * *', async () => {
  
  try {
    console.log('Running the scheduled task to send reports every 15 days');
    await module.exports.sending();  // Assuming 'sending' is an async function
  } catch (error) {
    console.error('Error during the scheduled task:', error);
  }

}, {
  scheduled: true,
  timezone: "Asia/Kolkata"  
  
});





app.use(express.json())


// this i have commented . just uncomment it 

// const s3 = new aws.S3({
//   accessKeyId:process.env.AWS_ACCESS_KEYID,
//   secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
//   region:process.env.AWS_REGION
// });
// s3.listBuckets((err, data) => {
//   if (err) {
//     console.error('Error connecting to S3:', err);
//   } else {
//     console.log("check after using env variable");
//     console.log('Connection established with S3');
//     console.log('Buckets:', data.Buckets);
//   }
// });


//app.use(signup)
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));



//app.use('/login',require('./Router/index'))
app.use('/login',require('./Router/index'))
app.use('/flying',require('./Router/index'))
app.use('/',require('./Router/index'))
app.use('/api',require('./Router/index'))
app.use('/upload',require('./Router/index'))
app.use('/pilotprofile',require('./Router/index'))
app.use('/result',require('./Router/index'))
app.use('/editprofile',require('./Router/index'))
app.use('/insertnewprofile',require('./Router/index'))
app.use('/update/:id',require('./Router/index'))
app.use('/pilotflightdetails',require('./Router/index'))
app.use('/pilotcrashdetails',require('./Router/index'))
app.use('/insert_damaged_parts',require('./Router/index'))
app.use('/cost_details',require('./Router/index'))

app.use('/view_flight_form',require('./Router/flight_schedule_router'))
app.use('/reschedule_flight',require('./Router/flight_schedule_router'))
app.use('/add_flight_schedule',require('./Router/flight_schedule_router'))
app.use('/',require('./Router/flight_schedule_router'))

//admin dashboard
app.use('/admin',require('./Router/admin_dashboard_router'))
app.use('/',require('./Router/admin_dashboard_router'))

app.use('/',require('./Router/member_dashboard_router'))
app.use('/member_dashboard',require('./Router/admin_dashboard_router'))

//admin access to pilot profile
app.use('/pilotprofile',require('./Router/index'))


//flight details
app.use('/addflightdetails',require('./Router/admin_flightdetails_router'))
app.use("/",require("./Router/admin_flightdetails_router"));
app.use('/view_flight_details',require('./Router/admin_flightdetails_router'))
app.use('/add_flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/all_flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/newflightdetails',require('./Router/admin_flightdetails_router'))
app.use('/crashdetails',require('./Router/admin_flightdetails_router')) 
app.use('/edit_succesfulflightdetails',require('./Router/admin_flightdetails_router'))
app.use('/',require('./Router/admin_flightdetails_router')) 
app.use('/edit_crashdetails',require('./Router/admin_flightdetails_router'))
app.use('/flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/add_successful_flight_details',require('./Router/admin_flightdetails_router'))
app.use('/add_crash_details',require('./Router/admin_flightdetails_router'))

//flight schedules
app.use('/scheduleflights',require('./Router/admin_flightschedule_router'))
app.use("/",require("./Router/admin_flightschedule_router"));
app.use('/view_flight_forms',require('./Router/admin_flightschedule_router'))
app.use('/add_flight',require('./Router/admin_flightschedule_router'))
app.use('/all_schedules',require('./Router/admin_flightschedule_router'))

/*simulatin related*/
app.use('/simulation_details',require('./Router/index'))
app.use('/add_simulation',require('./Router/index'))

app.use('/simulation_details',require('./Router/flight_schedule_router'))
app.use('/add_simulation',require('./Router/flight_schedule_router'))

app.use('/simulationgraph',require('./Router/admin_dashboard_router'))

app.use('/simulationgraph',require('./Router/member_dashboard_router'))
app.use('/simulate_admin',require('./Router/admin_flightschedule_router'))

/*for pilot profile*/
app.use(express.json());

// const Images = mongoose.model('Images');
//const signup=require('./Router/index')

//download route
app.use('/', require('./Router/index'));

app.use('/downloadpdf', require('./Router/index'));
app.use('/pdftemplate', require('./Router/index'));

app.use('/downloadtemplate',require('./Router/index'));

//mailing route
app.use('/mailing', require('./Router/index'))


//app.use(signup)
app.use(express.urlencoded({extended: false}));


/*mongodb*/






// app.use('/admin',require('./Router/admin_dashboard_router')) 







dotenv.config();

// var mongoose = require('mongoose')
// const objectId = require('mongodb')._id;
  
// var fs = require('fs');
// var path = require('path');
require('dotenv/config');


  
// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//         console.log('Mongodb connected')
//     });


    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
//bodyparser
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());


    // var multer = require('multer');
  
    // var storage = multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, 'uploads')
    //     },
    //     filename: (req, file, cb) => {
    //         cb(null, file.fieldname + '-' + Date.now())
    //     }
    // });
    // var upload = multer({ storage: storage });

    var imgModel = require('./model');

  
    app.get('/insertpilot', (req, res) => {
        imgModel.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                res.render('insertnewpilot', { items: items });
            }
        });
    });

    const pool=require("./database");


    //commented this 
    //const controller2=require("./s3");

    app.get('/all_pilots', async (req, res) => {
      try {
        console.log("Enteredd all_pilotss");
        const pilotsResult = await pool.query('SELECT emailid, name, mobileno, dob, drone_experience, honours_achievements FROM profile_data');
        
        const pilots = pilotsResult.rows;

        for (let pilot of pilots) {
            const email = pilot.emailid;
            //console.log(pilot.emailid);
            const username = email.split('@')[0];
            //const imageUrl = await controller2.generateDownloadURL(username);
            //console.log("Image URL:", imageUrl);

            const flightDurationResult = await pool.query('SELECT COALESCE(SUM(duration), 0) AS total_duration FROM flight_description WHERE emailid = $1', [email]);
            const totalFlightHoursInSeconds = flightDurationResult.rows[0].total_duration;
            pilot.total_flight_hours = totalFlightHoursInSeconds;

            const simDurationResult = await pool.query('SELECT COALESCE(SUM(total_minutes), 0) AS total_duration FROM simulation WHERE email = $1', [email]);
            const totalSimulationTimeInMinutes = simDurationResult.rows[0].total_duration;
            pilot.total_simulation_time = totalSimulationTimeInMinutes;
            pilot.imageUrl = await controller2.generateDownloadURL(username);
            //pilot.imageUrl = imageUrl;
            //console.log("imaggeeee urlll:",pilot.imageUrl);
            console.log("Image URL for", username, ":", pilot.imageUrl);
            
          }
          console.log("Above renderr");
          res.render('pilotlist', {pilots});
         
      } catch (err) {
          console.error('Error executing queries', err.stack);
          res.status(500).send('An error occurred');
      }
    });



    
  //   app.post('/insertpilot', upload.single('image'), (req, res, next) => {
  
  //     var obj = {
  //         name: req.body.name,
  //         emailid: req.body.emailid,
  //         mobile_no:req.body.mobile_no,
  //         dob:req.body.dob,
  //         duration1:req.body.duration1,
  //         duration2:req.body.duration2,
  //         type_of_drone_experience:req.body.type_of_drone_experience,
  //         honors_and_achievements:req.body.honors_and_achievements,
          
           
  //         img: {
  //             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  //             contentType: 'image/png'
  //         }
  //     }
  //     imgModel.create(obj, (err, items) => {
  //         if (err) {
  //             console.log(err);
  //         }
  //         else {
  //             // item.save();
  //             console.log("project details inserted succesfully")
  //             res.redirect("/all_pilots");
  //         }
  //     });
  // });
  
app.use(expressLayouts);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cookieParser());

app.use(express.json());

/*for delete*/
app.get('/delete', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.redirect("/all_pilots");
        }
    });
});

  // app.post('/delete', function(req, res, next) {
  //   var id = req.body.id;
  //   console.log("hhhhhhhhhhhhhhhhhhhhhhh........................")
  //   console.log(id)
  //   console.log("hhhhhhhhhhhhhhhhhhhhhhh........................")

  //   imgModel.findByIdAndRemove(id).exec();
  //   console.log("project details deleted succesfully")
  //   res.redirect('/all_pilots');
  // });


  app.post('/delete/', async (req, res) => {
    var id=req.body.id;
    console.log("Email check for delete");
    console.log(id);
    console.log("Email check for delete");
    const username = id.split('@')[0];

    try {
      const deleteQuery = 'DELETE FROM profile_data WHERE emailid = $1';
        const deleteResult = await pool.query(deleteQuery, [id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        //commented this 
        //await controller2.deleteImage(username);
        
        res.redirect('/all_pilots');
    } catch (error) {
        console.error('Error deleting image:', error);
        //res.status(500).json({ message: 'Failed to delete image from S3' });
    }
});
  


  

  /*update record*/
  app.get('/updatedoc',(req, res)=>{
    a=req.body;
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq')
    console.log(a)
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq')
    console.log('hi');
    res.render("updatedoc",{ layout: false,list:a})
  
  });
  app.post('/updatedoc', function(req, res, next) {
    var id = req.body.id;
  
    imgModel.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.name= req.body.name;
      doc.emailid= req.body.emailid;
      doc.mobileno= req.body.mobileno;
      doc.dob = req.body.dob;
      doc.type_of_drone_experience=req.body.type_of_drone_experience;
      doc.honors_and_achievements=req.body.honors_and_achievements;
      doc.img=req.body.img
      doc.save();
    })
    console.log("pilot details updated succesfully")
    res.redirect('/insertpilot');
  });

  /*update the documents*/
//   app.get('/edit/:id', async (req, res) => {
//     const objectIdToEdit = new ObjectId(req.params.id);
//     console.log("firsttttttttttttttttttttttttttttt")
//     console.log(objectIdToEdit)
//     console.log('secondtttttttttttttttttttttttttttttt')
  
//     try {
//       const document = await imgModel.findOne({ _id: objectIdToEdit });
//       console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
//     console.log(document)
//     console.log('thissssssssssssssssssssssssssssssssssssss')
  
//       if (document) {
//         res.render('updatedoc', { document: document }); // Pass the document to the template
//       } else {
//         res.status(404).send('Document not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching document:', error);
//       res.status(500).send('An error occurred while fetching the document.');
//     }
//   });


app.get('/edit/:emailid', async (req, res) => {
  try {
    const emailidtoupdate = req.params.emailid;
    console.log("CHECKING SPLIT");
    console.log(emailidtoupdate);
    console.log("CHECKING SPLIT");
    const username=emailidtoupdate.split('@')[0];

  const result = await pool.query(`SELECT * FROM profile_data WHERE emailid = $1`, [emailidtoupdate]);
  const profileData = result.rows[0];

  if (!profileData) {
    return res.status(404).send('Profile not found');
  }

  // commented this
    // const imageUrl = await controller2.generateDownloadURL(username); 
    console.log("get edit profile GEPGEPGEPGEPGEPGEP");
    console.log("Profile Data:", profileData);
    console.log("Image URL:", imageUrl);
    console.log("DATEDATEADTE");
    console.log(profileData.dob);
    console.log("DATEDATEADTE");
    console.log("get edit profile GEPGEPGEPGEPGEPGEP");
    // res.render('updatedoc.ejs', { layout: false,profileData, imageUrl}); commented
 res.render('updatedoc.ejs', { layout: false,profileData});


    

    console.log('This is the email check for profile');
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).send('An error occurred while fetching the document.');
  }
});


const multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload=multer();


app.post('/edit/:emailid',upload.single('image'), async (req, res) => {
  try {
    const email = req.params.emailid;
    const username = email.split('@')[0];
    console.log("Checckingg file");
    console.log(req.file);
    console.log("Checckingg file");
    //const url = await controller2.generateUploadURL(username); commented
    const file = req.file.buffer;
    const mimeType = req.file.mimetype;

    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Generated S3 URL:', url);
    console.log('File buffer length:', file.length);
    console.log('File MIME type:', mimeType);

    const result = await controller.updateProfileListAdmin(email, req, res);
    console.log('postgres Profile update result:', result);
   

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType
      },
      body: file
    });

    if (response.ok) {
      console.log('Image updated to S3');
  } else {
      
      const errorInText = await response.text();
      console.error('Failed to update image to S3:',errorInText );
      return;
  }
    

    res.redirect('/all_pilots'); // Redirect after successful update

  } catch (error) {
    console.error('Error updating image to S3:', error.message);
    
  }
});




  
/*psqland mongodb interconnection*/
const pg = require('pg');
//const { MongoClient } = require('mongodb');

//PostgreSQL connection configuration
const pgConfig = {
  user:process.env.DB_USER,
  host:process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

};



// Create a PostgreSQL client
const pgClient = new pg.Client(pgConfig);

// Create a MongoDB client
//const mongoClient = new MongoClient(mongoConfig.url);

async function synchronizeData() {
  try {
    // Connect to PostgreSQL and MongoDB
    await pgClient.connect();
    console.log('Connected to PostgreSQL.');

    // await mongoClient.connect();
    // console.log('Connected to MongoDB.');

    // Retrieve data from PostgreSQL
    const query = `SELECT emailid, sum(duration) as duration1 FROM flight_description where mode ='testing' group by emailid`;
    ;
    const result = await pgClient.query(query);
    const pgData = result.rows;

    // Transform and update data in MongoDB
    //const mongoCollection = mongoClient.db(mongoConfig.dbName).collection(mongoConfig.collectionName);

    for (const row of pgData) {
      const emailId = row.emailid;
      const duration1 = row.duration1;


      // Retrieve duration2 value from PostgreSQL
      const query2 = `SELECT sum(duration) as duration2 FROM flight_description where mode='simulation'and emailid = $1`;
      const result2 = await pgClient.query(query2, [emailId]);
      const duration2 = result2.rows[0].duration2;

      // Update the corresponding document in MongoDB
      //await mongoCollection.updateOne({ emailid: emailId }, { $set: { duration1, duration2 } });
    }

    console.log('Data synchronization complete.');

  } catch (error) {
    console.error('Error:', error);

  } finally {
    // Close the PostgreSQL and MongoDB connections
    await pgClient.end();
    //await mongoClient.close();
  }
}

// Run the synchronization process
synchronizeData();












const PORT=process.env.PORT||1200;
app.listen(PORT,()=>{
    console.log(`Server Started at Port ${PORT}`);
});