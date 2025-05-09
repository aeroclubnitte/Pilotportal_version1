//import aws from 'aws-sdk'
const aws = require('aws-sdk');
const dotenv = require('dotenv');

//import dotenv from 'dotenv'
require('dotenv').config();
const region="eu-north-1"
const bucketName=process.env.BUCKETNAME;
const accessKeyId=process.env.AWS_ACCESS_KEYID;
const secretAccessKey=process.env.AWS_SECRET_ACCESS_KEY;
const crypto=require('crypto');
//const util = require('util');
const { promisify } = require('util');
//require('util.promisify').shim();
const randomBytes = promisify(crypto.randomBytes)

const s3=new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4'
})
// module.exports.generateUploadURL = async function(username) {  commented all
//     try {
//       // const rawBytes = await randomBytes(16);
//       // const imageName = rawBytes.toString('hex');
//       const imageName=`${username}`;
  
//       const params = {
//         Bucket: bucketName,
//         Key: imageName,
//         Expires: 7200 
//       };
  
      

//       const uploadURL = await s3.getSignedUrlPromise('putObject', params);
//       console.log("upload url"+uploadURL);
//       return uploadURL;
//     } catch (error) {
//       console.error('Error generating upload URL:', error);
//       throw error; 
//     }
//   };


//   module.exports.generateDownloadURL = async function(username) {
//     try {
//         const imageName = `${username}`;

//         const params = {
//             Bucket: bucketName,
//             Key: imageName,
//             Expires: 7200 // URL expiration time in seconds
//         };

//         const downloadURL = await s3.getSignedUrlPromise('getObject', params);
//         console.log("Download URL:", downloadURL);
//         return downloadURL;
//     } catch (error) {
//         console.error('Error generating download URL:', error);
//         throw error;
//     }
// };


// module.exports.deleteImage = async function(username) {
//   try {
//       const imageName = `${username}`;
//       const params = {
//           Bucket: bucketName,
//           Key: imageName
//       };

//       await s3.deleteObject(params).promise();
//       console.log("Image deleted from S3:", imageName);
//   } catch (error) {
//       console.error('Error deleting image from S3:', error);
//       throw error;
//   }
// };
  