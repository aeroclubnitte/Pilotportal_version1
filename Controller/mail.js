require('dotenv').config();
const path = require('path');
const nodemailer = require("nodemailer");
const pool = require("../database");
const mailDetails = require("./mailDetails");
const controller2 = require('../s3.js');
const fs = require('fs');
const os = require('os');
const adminMail = process.env.adminMail;
const tempDir = os.tmpdir();
const ejs = require("ejs");
const puppeteer = require('puppeteer');
//const cron = require('node-cron'); 


// Sample user emails for testing
//let userMails = ["prathzz04@gmail.com", "nnm22me046@nmamit.in"];
let generatedReportsPath = [];


//setting delay is important

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Define sleep function

// Main function to handle report generation and sending emails with delay
module.exports.sending = async () => {
  try {
    // Get user data from profile_data table
    const userData = await pool.query('SELECT name, emailid FROM profile_data');
    const userMails = userData.rows;

    // Generate all reports for pilots with delay between each report generation
    generatedReportsPath = [];
    for (const user of userMails) {
      const reportPath = await generateUserReports(user.emailid, user.name);
      generatedReportsPath.push(reportPath);

      await sleep(1000); // Delay for 1 second before processing the next report
    }

    console.log("Report paths:", generatedReportsPath);

    // Send all reports to the admin
    await sendingToAdmin(adminMail);
  } catch (error) {
    console.error('Error in sending process:', error);
  }
};

// Function to generate user reports with delay
const generateUserReports = async (email, name) => {
  try {
    const username = email.split('@')[0];
    const imageurl = await controller2.generateDownloadURL(username);

    const emailExists = await mailDetails.isEmailInProfileData(email);
    const a = await mailDetails.totalsuccesfulflights(email);
    const b = await mailDetails.totalcrashes(email);
    const { trueCount, falseCount } = await mailDetails.successfulflightgraph(email);
    const data2 = await mailDetails.damageditemsgraph(email);
    const data3 = await mailDetails.totalflighttimegraph(email);
    const data4 = await mailDetails.batteryusagegraph(email);
    const data5 = await mailDetails.simulationgraphmem(email);
    const { tabledetails, maindetails } = await mailDetails.reportDetails(email);
    const { totalsum, totaldur } = await mailDetails.flightdetails(email);

    const dataRender = {
      layout: false,
      successful: a,
      crashes: b,
      data2,
      data3,
      data4,
      data5,
      trueCount,
      falseCount,
      emailExists,
      imageurl,
      tabledetails,
      maindetails,
      totalsum,
      totaldur,
    };

    const reportPath = await createPDFReport('./views/template.ejs', dataRender, email, name);
    console.log(`Generated report for ${username} and sent to ${email} (name: ${name})`);

    await sleep(500); // Delay of 500ms before returning to ensure stability
    return reportPath;
  } catch (err) {
    console.log("Error during report generation:", err.message);
  }
};

// Function to send email to individual pilots with delay
const sendingToPilot = async (mail, filePath, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Pilot-Portal" <${process.env.EMAIL_USER}>`,
      to: `${mail}`,
      subject: "BIWEEKLY PILOT REPORT",
      html: "<b>Hey Pilot, kindly find your report in the attachment below.</b>",
      attachments: [{
        filename: `${name}_report.pdf`,
        path: filePath
      }]
    });
    console.log("Message sent: %s", info.messageId);

    await sleep(1000); // Delay for 1 second after sending each email
  } catch (e) {
    console.error("Error while sending the message", e);
  }
};

// Function to send reports to the admin with delay
const sendingToAdmin = async (adminMail) => {
  try {
    console.log("Entered admin sending part");

    let attachments = generatedReportsPath.map(filePath => {
      if (filePath) {
        return {
          filename: path.basename(filePath),
          path: filePath,
        };
      } else {
        console.error("Error: filePath is undefined.");
        return null;
      }
    }).filter(Boolean); // Filter out undefined paths

    console.log("Sending the following attachments:", attachments);

    const info = await transporter.sendMail({
      from: `"Pilot-Portal" <${process.env.EMAIL_USER}>`,
      to: `${adminMail}`,
      subject: "BIWEEKLY PILOT REPORTS",
      html: "<b>Hey Admin, kindly find your pilots' reports in the attachments below</b>",
      attachments
    });

    console.log("Reports sent to admin: %s", info.messageId);

    // Cleanup the temporary reports after sending
    await sleep(3000); // Delay before starting the cleanup
    await cleanupTempFiles(generatedReportsPath);
  } catch (e) {
    console.error("Error while sending the message to admin", e);
  }
};

// Function to clean up temporary files with delay
const cleanupTempFiles = async (generatedReportsPath) => {
  try {
    for (const filePath of generatedReportsPath) {
      if (filePath && typeof filePath === 'string') {
        console.log(`Deleting file: ${filePath}`);
        await sleep(500); // Delay of 500ms between each file deletion
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          } else {
            console.log(`Successfully deleted file: ${filePath}`);
          }
        });
      } else {
        console.error(`Invalid file path: ${filePath}`);
      }
    }
  } catch (err) {
    console.error("Error in cleanupTempFiles:", err);
  }
};

// Function to generate a PDF
async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulateMediaType('screen');
  await page.setContent(htmlContent, { timeout: 0 }); // Remove timeout limit
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm'
    },
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size:20px; text-align:center; width:100%;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `,
    headerTemplate: `<div></div>`
  });

  await browser.close();
  return pdf;
}

// Function to create a PDF report
async function createPDFReport(templateLoc, data, mail,name) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templateLoc, data, async function (error, result) {
      if (error) {
        console.log("EJS rendering error:", error);
        return reject(error);
      }

      const pdf = await generatePDF(result);
      // const name = mail.split('@')[0];
      const Rname=name;
      const tempFilePath = path.join(tempDir, `${Rname}_report.pdf`);
      fs.writeFileSync(tempFilePath, pdf); // Save the PDF file
      console.log(`PDF report created: ${Rname}_report.pdf`);

      // Send the report to the pilot
      await sendingToPilot(mail, tempFilePath,Rname);
      resolve(tempFilePath); // Return the generated file path
    });
  });
}

// Setup the mail transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



















































// module.exports.sending = async () => {
//   try {
//     // Get user from profile data
//     const userData = await pool.query('SELECT name, emailid FROM profile_data');
//     const userMails = userData.rows;

//     // Generate all reports for the pilots
//     generatedReportsPath = await Promise.all(userMails.map(user => generateUserReports(user.emailid, user.name)));
//     console.log("These are the paths of the reports", generatedReportsPath);

//     // Send all reports to admin after pilot reports
//     console.log('Done with pilots, next sending to admin');
//     await sendingToAdmin(adminMail);




//   } catch (error) {
//     console.error('Error in sending process:', error);
//   }
// };



// // Function to generate user reports
// const generateUserReports = async (email,name) => {
//   try {
//     const username = email.split('@')[0];
//     const imageurl = await controller2.generateDownloadURL(username);
//     const emailExists = await mailDetails.isEmailInProfileData(email);
//     const a = await mailDetails.totalsuccesfulflights(email);
//     const b = await mailDetails.totalcrashes(email);
//     var { trueCount, falseCount } = await mailDetails.successfulflightgraph(email);
//     const data2 = await mailDetails.damageditemsgraph(email);
//     const data3 = await mailDetails.totalflighttimegraph(email);
//     const data4 = await mailDetails.batteryusagegraph(email);
//     const data5 = await mailDetails.simulationgraphmem(email);
//     const { tabledetails, maindetails } = await mailDetails.reportDetails(email);
//     const { totalsum, totaldur } = await mailDetails.flightdetails(email);

//     const dataRender = {
//       layout: false,
//       successful: a,
//       crashes: b,
//       data2: data2,
//       data3: data3,
//       data4: data4,
//       data5: data5,
//       trueCount,
//       falseCount,
//       emailExists,
//       imageurl,
//       tabledetails,
//       maindetails,
//       totalsum,
//       totaldur
//     };

//     // Generate PDF and return the path
//     const reportPath = await createPDFReport('./views/template.ejs', dataRender, email,name);
//     console.log(`Done report generation of ${username} and sending it to ${email} having name ${name}`);
//     return reportPath; // Return the path to add it to the array for admin attachment
//   } catch (err) {
//     console.log("Error during report generation:", err.message);
//   }
// };

// // Function to generate a PDF
// async function generatePDF(htmlContent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.emulateMediaType('screen');
//   await page.setContent(htmlContent, { timeout: 0 }); // Remove timeout limit
  
//   const pdf = await page.pdf({
//     format: 'A4',
//     printBackground: true,
//     margin: {
//       top: '15mm',
//       bottom: '15mm',
//       left: '15mm',
//       right: '15mm'
//     },
//     displayHeaderFooter: true,
//     footerTemplate: `
//       <div style="font-size:20px; text-align:center; width:100%;">
//         Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//       </div>
//     `,
//     headerTemplate: `<div></div>`
//   });

//   await browser.close();
//   return pdf;
// }

// // Function to create a PDF report
// async function createPDFReport(templateLoc, data, mail,name) {
//   return new Promise((resolve, reject) => {
//     ejs.renderFile(templateLoc, data, async function (error, result) {
//       if (error) {
//         console.log("EJS rendering error:", error);
//         return reject(error);
//       }

//       const pdf = await generatePDF(result);
//       // const name = mail.split('@')[0];
//       const Rname=name;
//       const tempFilePath = path.join(tempDir, `${Rname}_report.pdf`);
//       fs.writeFileSync(tempFilePath, pdf); // Save the PDF file
//       console.log(`PDF report created: ${Rname}_report.pdf`);

//       // Send the report to the pilot
//       await sendingToPilot(mail, tempFilePath,Rname);
//       resolve(tempFilePath); // Return the generated file path
//     });
//   });
// }

// // Setup the mail transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, 
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Function to send email to individual pilots
// const sendingToPilot = async (mail, filePath,name) => {
//   try {
//     //const username = mail.split('@')[0];
//     const username=name;
//     const info = await transporter.sendMail({
//       from: `"Pilot-Portal" <${process.env.EMAIL_USER}>`,
//       to: `${mail}`,
//       subject: "BIWEEKLY PILOT REPORT", 
//       html: "<b>Hey Pilot, kindly find your report in the attachment below.</b>",
//       attachments: [{
//         filename: `${username}_report.pdf`,
//         path: filePath 
//       }]
//     });
//     console.log("Message sent: %s", info.messageId);
//   } catch (e) {
//     console.error("Error while sending the message", e);
//   }
// };

// // Function to send reports to admin
// const sendingToAdmin = async (adminMail) => {
//   try {
//     console.log("Entered admin sending part");

//     // Create attachments array
//     let attachments = generatedReportsPath.map(filePath => {
//       if (filePath) {
//         return {
//           filename: path.basename(filePath),
//           path: filePath,
//         };
//       } else {
//         console.error("Error: filePath is undefined.");
//         return null;
//       }
//     }).filter(Boolean); // Filter out undefined paths

//     console.log("Sending the following attachments:", attachments);

//     const info = await transporter.sendMail({
//       from: `"Pilot-Portal" <${process.env.EMAIL_USER}>`,
//       to: `${adminMail}`,
//       subject: "BIWEEKLY PILOT REPORTS",
//       html: "<b>Hey Admin, kindly find your pilots' reports in the attachments below</b>",
//       attachments
//     });

//     console.log("Reports sent to admin: %s", info.messageId);

//     // Cleanup the temporary reports after sending
//     //await cleanupTempFiles(generatedReportsPath);
//   } catch (e) {
//     console.error("Error while sending the message to admin", e);
//   }
// };

// // Function to clean up temporary files


// const cleanupTempFiles = async (generatedReportsPath) => {
//   try {
//     generatedReportsPath.forEach(filePath => {
//       if (filePath && typeof filePath === 'string') {
//         console.log(`Deleting file: ${filePath}`);
//         fs.unlink(filePath, (err) => {
//           if (err) {
//             console.error(`Error deleting file ${filePath}:`, err);
//           } else {
//             console.log(`Successfully deleted file: ${filePath}`);
//           }
//         });
//       } else {
//         console.error(`Invalid file path: ${filePath}`);
//       }
//     });
//   } catch (err) {
//     console.error("Error in cleanupTempFiles:", err);
//   }
// };


//scheduling for 15 days 
// cron.schedule('0 0 1,15 * *', async () => {
//   console.log('Running the scheduled task to send reports every 15 days');
//   await module.exports.sending();
// }, {
//   scheduled: true,
//   timezone: "Asia/Kolkata"  // Adjust timezone as needed
// });























//old code





// require('dotenv').config();
// const path=require('path');
// const nodemailer = require("nodemailer");
// const pool=require("../database")
// const mailDetails=require("./mailDetails");
// const controller2 = require('../s3.js')
// const fs=require('fs');
// const os=require('os');
// const adminMail=process.env.adminMail;
// const tempDir=os.tmpdir();
// const ejs=require("ejs");
// const puppeteer = require('puppeteer');
// //collect mail of all users
// //set the code according to the email. 
// //1.generate their separate reports 2.send it to the inidviual pilots 3.add it a reports array to send it to admin together
// //implement 15  days function using nodecron 

// //get user from profile data
// //const userData=pool.query('SELECT emailid from profile_data');
// //const userMails=userData.rows;



// let userMails =["prathzz04@gmail.com","nnm22me046@nmamit.in"];
// let generatedReportsPath=[];

// module.exports.sending = async ()=>{
// generatedReportsPath = await userMails.map(user=>generateUserReports(user));
// console.log("these are the paths of the reports", generatedReportsPath);
// console.log('done with pilots , next sending admin')
// await sendingToAdmin(adminMail);

// }





// // userMails.forEach(mail=> {
// //   renderCreatePDF(mail); //fetch the data ,render the file , create the pdf 

// // });





// const generateUserReports=async(email)=> {
// try{
//   const username = email.split('@')[0];
//   const imageurl = await controller2.generateDownloadURL(username);
//   const emailExists = await mailDetails.isEmailInProfileData(email);
//   const a = await mailDetails.totalsuccesfulflights(email);
//   const b = await mailDetails.totalcrashes(email);
//   var { trueCount, falseCount } = await mailDetails.successfulflightgraph(email);
//   const data2 = await mailDetails.damageditemsgraph(email);
//   const data3 = await mailDetails.totalflighttimegraph(email);
//   const data4 = await mailDetails.batteryusagegraph(email);
//   const data5 = await mailDetails.simulationgraphmem(email);
//   const {tabledetails,maindetails} =await mailDetails.reportDetails(email);

//   const {totalsum,totaldur}=await mailDetails.flightdetails(email);

//   const dataren = {
//     layout: false,
//     successful: a,
//     crashes: b,
//     data2: data2,
//     data3: data3,
//     data4: data4,
//     data5: data5,
//     trueCount,
//     falseCount,
//     emailExists,
//     imageurl,
//     tabledetails,
//     maindetails,
//     totalsum,
//     totaldur
//   }

//   const reportpaths= await createPDFReport('./views/template.ejs', dataren,email);// till here, the report is generated n sent to the pilot . 
//   console.log(done report generation of ${username} and sending it to ${email} )
//   return reportpaths;//returning the path to store as a array in generatereportpaths to send attachment to admin;


// } catch (err) {
//   console.log(error.message);
//   console.log(err);
//   //res.status(500).send("Internal Server Error");
// }
// }


// async function generatePDF(htmlContent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.emulateMediaType('screen');

//   await page.setContent(htmlContent,{ timeout:0 });
  
//   const pdf = await page.pdf({
//     format: 'A4', printBackground: true, margin: {
//       top: '15mm',
//       bottom: '15mm',
//       left: '15mm',
//       right: '15mm'
//     }, displayHeaderFooter: true,
//     footerTemplate: 
//       <div style="font-size:20px; text-align:center; width:100%;">
//           Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//       </div>
//   ,
//     headerTemplate: <div></div>,
//   });

//   await browser.close();
//   return pdf;
// }


// async function createPDFReport(templateloc, data,mail) {
//   ejs.renderFile(templateloc, data, async function (error, result) {
//     if (result) {
//       var html = result;
//       const pdf = await generatePDF(html);

//       const name=mail.split('@')[0];

//       const tempFilePath=path.join(tempDir,${name}_report.pdf);
//        console.log(tempFilePath)
//       fs.writeFileSync(tempFilePath, pdf);//change this saving thingy and save in the folder, and send it to the individuals
        
//       console.log(PDF report created:${name}_report.pdf);

//       //write mailing function here 
//       await sendingToPilot(mail,tempFilePath);
     
//       return tempFilePath;
      



//     } else {
//       console.log(error)
//     }
//   });


// }





// const transporter = nodemailer.createTransport({  //having transfer information.
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // Use true for port 465, false for all other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });



// const sendingToPilot=async(mail,filePath) => {
// try{
//   const username = mail.split('@')[0];
//     const info = await transporter.sendMail({
//     from: '"Pilot-Portal" <prathextra@gmail.com>', // sender address
//    // to: "prathextra@gmail.com", // list of receivers
//     to:${mail},
//     subject: "BIWEEKLY PILOT REPORT", // Subject line
//     html: "<b>Hey Pilot, kindly find your report in the attachment below.</b>",
    

//     attachments:[
//         {
//             filename:${username}_report.pdf,
//            path:filePath//change this path here
        
//         },
//     ],
//   });

//   console.log("Message sent: %s", info.messageId);
// } catch (e) {
//     console.error("error while sending the message", e)
// }
// }


// const sendingToAdmin=async(adminMail) => {
//   try{
//  console.log("entered admin sending part");
//     let Attachments = [];

//     await generatedReportsPath.forEach(filePath => {
//       Attachments.push({
//         filename: path.basename(filePath),
//         path: filePath,
//       });
//     });



//       const info = await transporter.sendMail({
//       from: '"Pilot-Portal" <prathextra@gmail.com>', // sender address
    
//       to:${adminMail},
//       subject: "BIWEEKLY PILOT REPORTS", // Subject line
//       html: "<b>Hey Admin, kindly find your pilots report in the attachment below</b>",
//       attachments:Attachments,

//       // attachments:[
//       //     {
//       //         filename:${username}_report.pdf,
//       //        path:filePath//change this path here
          
//       //     },
//       // ],



//     });
  
//     console.log("Reports sent to admini: %s", info.messageId);

//     //deleting the temporary reports location logic here 
//     //deletingTempDir(tempDir);
//   } catch (e) {
//       console.error("error while sending the message to admin ", e)
//   }
//   }


//   async function deletingTempDir(tempDir){

//     // Delete the directory and its contents

//   await fs.rmSync(tempDir, { recursive: true, force: true }, (err) => {
//   if (err) {
//     console.error(Error while deleting the directory: ${err});
//   } else {
//     console.log(Directory ${tempDir} deleted successfully);
//   }
// });



//   }