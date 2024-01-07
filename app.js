"use strict";
// Import dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  path = require("path"),
  config = require("./services/config"),
  app = express();
  const axios = require('axios');

  const { createClient } = require('@supabase/supabase-js')
  // const { createStorage } = require('@supabase/storage-js')
  const { uploadImage, upsertUser,  createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone } = require("./services/supabase")
  const tester = require('./services/tinder/tester');
  const rampwin = require('./services/tinder/rampwin');
  const swipe = require('./services/tinder/swipe');
  const findmatch = require('./services/tinder/findmatch');
  const manychat = require('./services/tinder/manychat');
  const authEmailOrPhone = require('./services/tinder/authEmailOrPhone');
  const manychatMatchNotification = require('./services/tinder/manychatMatchNotification');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);



const supabaseUrl = 'https://frzbawsadhmmltokvexj.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyemJhd3NhZGhtbWx0b2t2ZXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3MzgxMjcsImV4cCI6MTk5NDMxNDEyN30.KAHO-apaXL3G7mBTZ17r8GN0vXoOZIL7d_HzKr7hJjc'
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyemJhd3NhZGhtbWx0b2t2ZXhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODczODEyNywiZXhwIjoxOTk0MzE0MTI3fQ.wtwrDW0u4YblgL6dlkkf9rlPeBpcqprfE-eFi1KBYwk'
const supabase = createClient(supabaseUrl, supabaseKey)
const storage = supabase.storage

var users = {};
// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true
  })
);

app.use(json())
// Serving static files in Express
app.use(express.static(path.join(path.resolve(), "public")));
// Set template engine in Express
app.set("view engine", "ejs");


function sendTwilioMessage(twilioClient, to_address, message) {
  twilioClient.messages
      .create({
          body: message,
          from: '+18662873230',
          to: to_address? to_address : '+17738310785'
      })
      .then(message => console.log(message.sid));
}



// Respond with index file when a GET request is made to the homepage
app.get("/", function (_req, res) {
  console.log('index /GET coming through')
});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  console.log('get webhook')
});



app.post("/swipe", async (req, res) => {
  swipe(req, res, supabase, createSwipe,sendTwilioMessage,twilioClient);
});

// instagram://direct?username=

// http://instagram.com/_u/{{cuf_9711102}}/


app.post("/findmatch", async (req, res) => {
  findmatch(req, res, supabase, findMatch);
});


app.post("/rampwin", async (req, res) => {
  rampwin(req,res)
});

app.post("/tester", async (req, res) => {
  tester(req, res, supabase,findUserByIgId);
});
app.post("/manychat", (req, res) => {
  manychat(req, res, supabase, upsertUser, uploadImage, storage);
});
app.post("/authEmailOrPhone", (req, res) => {
  authEmailOrPhone(req, res,supabase, supabaseAuthEmailOrPhone)
});
app.post("/manychatMatchNotification", (req, res) => { 
  manychatMatchNotification(req, res,supabase,axios)
});

// Check if all environment variables are set
// Listen for requests :)
var listener = app.listen(config.port, function () {
  console.log(`The app is listening on port ${listener.address().port}`);
});
