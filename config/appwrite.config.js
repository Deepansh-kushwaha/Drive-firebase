const {Client,Storage ,ID} = require('node-appwrite');


const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); 
  
const storage = new Storage(client);
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID;

module.exports = { storage ,BUCKET_ID ,ID};

