// old sanjana code 
//var time = today.getHours()
// const pool  = require("../database");
// from_number=`+12179878755`

// const dotenv = require("dotenv");
// require('dotenv').config();
// const accountSid =process.env.Twilio_ACCOUNTSID;
// const authToken =process.env.Twilio_AuthToken;
// const client = require('twilio')(accountSid, authToken);


// call=async(number)=>{
//     console.log(number);
//     client.calls.create({
//         url:'https://handler.twilio.com/twiml/EH658003a3bc7e0f32191549410f0d00e6',
//         to: number,
//         from: `+12179878755`
//     }, function(err,call){
//         if(err){
//             console.log(err);
//         } else{
//             console.log(call.sid);
//             console.log("call excecuted")
//             /*This has to be fixed*/
//             pool.query(`UPDATE schedule SET called = true FROM signup 
//             WHERE schedule.email = signup.emailid 
//             and phone_number= $1 and schedule.date=current_date and schedule.time<=current_time+ interval '1 hour'`,[number]);

//         }
//     });
// }





// module.exports.extract_call_details = async() =>{
//   try{   
    
    
//       const phone_numbers=await pool.query(`select su.phone_number 
//                                             from signup su, schedule sc 
//                                             where su.emailid = sc.email 
//                                             and sc.date = current_date 
                                          
//                                             and sc.time <= current_time + interval '1 hour' 
//                                             and called = false`);

//       for(let i=0; i<phone_numbers.rows.length;i++){
//           const phone=phone_numbers.rows[i];
//           await call(phone.phone_number);
//           var number = phone.phone_number;
//       }
      
//   }
  
//   catch(err){
//       console.log(err);
//   }
// }
//WHERE email = (SELECT emailid FROM signup WHERE phone_number = $1) 

//sanjana code
require('dotenv').config();
const twilio = require('twilio');
const pool = require('../database'); 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log("Twilio Account SID:", process.env.TWILIO_ACCOUNT_SID);  // Debugging log
console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN);    // Debugging log

const client = require ("twilio")(accountSid, authToken);
const from_number = '+18143245336';  

const call = async (number, twimlMsg) => {
    console.log(` Initiating Twilio Call to ${number}`);
    console.log(` From: ${from_number}`);
    console.log(` TwiML: ${twimlMsg}`);
    try {
        const call = await client.calls.create({
            to: number,
            from: from_number,
            twiml: twimlMsg
        });

        console.log('Call SID:', call.sid);
        console.log(`Call to ${number} executed successfully`);
    } catch (err) {
        console.error('Error making call:', err);
    }
};

const extract_call_details = async () => {
    console.log(" extract_call_details() function STARTED...");
    try {
        //sanjana commented
        console.log(" Checking for scheduled calls...");
        // 1-hour prior calls
        const oneHourDetails = await pool.query(`
            SELECT su.phone_number, sc.time 
            FROM signup su
            JOIN schedule sc ON su.emailid = sc.email
            WHERE sc.date = current_date
            // AND sc.time <= current_time + interval '1 hour'
            // AND sc.time > current_time
            AND sc.time BETWEEN current_time + interval '59 minutes' 
            AND current_time + interval '61 minutes'
            AND sc.called = false
        `);
        console.log(`One-hour prior calls to be made: ${oneHourDetails.rows.length}`);
        
        if (oneHourDetails.rows.length === 0) {
            console.log("⚠ No one-hour prior calls found.");
        }

    
        for (let i = 0; i < oneHourDetails.rows.length; i++) {
            const { phone_number, time } = oneHourDetails.rows[i];
            const phoneNumber = `+91${phone_number}`; // Prepend +91
            
            console.log(`Calling ${phoneNumber} for flight at ${time}...`);

            const twimlMsg = `
                <Response>
                    <Say voice="woman" language="en-US">
                        Hello Sanjana Sathish Upadhyaya,
                        This is a reminder from pilot portal that you have your flight scheduled at ${time}.
                        Happy flight!
                    </Say>
                </Response>
            `;
            await call(phoneNumber, twimlMsg);

            // Update the database to mark the call as made
            // await pool.query(`
            //     UPDATE schedule 
            //     SET called = true 
            //     WHERE email IN (SELECT emailid FROM signup WHERE phone_number = $1) 
            //     AND date = current_date 
            //     AND time = $2
            // `, [phone_number, time]);       

            const result = await pool.query(`
                UPDATE schedule sc
                SET called = true
                FROM signup su
                WHERE sc.email = su.emailid 
                AND su.phone_number = $1
                AND sc.date = current_date
                AND sc.time = $2
                RETURNING *;
            `, [phone_number, time]);
            
            console.log("Updated schedule:", result.rows);            
                 
        }

        // 30-minute prior calls
        const thirtyMinutesDetails = await pool.query(`
            SELECT su.phone_number, sc.time 
            FROM signup su
            JOIN schedule sc ON su.emailid = sc.email
            WHERE sc.date = current_date
            AND sc.time BETWEEN current_time + interval '29 minutes' 
            AND current_time + interval '31 minutes'
            AND sc.reminder_30 = false
        `);

        for (let i = 0; i < thirtyMinutesDetails.rows.length; i++) {
            const { phone_number, time } = thirtyMinutesDetails.rows[i];
            const phoneNumber = `+91${phone_number}`; // Prepend +91

            const twimlMsg = `
                <Response>
                    <Say voice="woman" language="en-US">
                        Hello Sanjana Sathish Upadhyaya,
                        This is a reminder from pilot portal.
                        You have your flight scheduled at ${time} which is in 30 minutes.
                        Fly high!
                    </Say>
                </Response>
            `;
            await call(phoneNumber, twimlMsg);

            // Update the database to mark the 30-minute reminder as made
            // await pool.query(`
            //     UPDATE schedule 
            //     SET reminder_30 = true 
            //     WHERE email = (SELECT emailid FROM signup WHERE phone_number = $1) 
            //     AND date = current_date 
            //     AND time <= current_time + interval '30 minutes'
            // `, [phone_number]);

            const result_30 = await pool.query(`
                UPDATE schedule sc
                SET reminder_30 = true
                FROM signup su
                WHERE sc.email = su.emailid 
                AND su.phone_number = $1
                AND sc.date = current_date
                AND sc.time = $2
                RETURNING *;
            `, [phone_number, time]);
            
            console.log("Updated schedule:", result_30.rows);   

            
        }
    } catch (err) {
        console.error('Error extracting call details:', err);
    }
};

module.exports = { extract_call_details };


