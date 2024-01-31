"use strict";
// Import dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  path = require("path"),
  config = require("./services/config"),
  app = express();
  const axios = require('axios');
  const { createClient } = require('@supabase/supabase-js')
  const {redisClient} = require('./redis.js')

  // const { createStorage } = require('@supabase/storage-js')
  const { uploadImage, upsertUser,  createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone } = require("./services/supabase")
  const tester = require('./services/tinder/tester');
  const rampwin = require('./services/tinder/rampwin');
  const swipe = require('./services/tinder/swipe');
  const tynidm = require('./services/tynibot/tynidm');
  const sendpulsewebhook = require('./services/sendpulsebot/sendpulsewebhook');
  const fourpics1word = require('./services/sendpulsebot/fourpics1word');
  const {mathPicSolver} = require('./services/sendpulsebot/mathPicSolver');
  
  
  const findmatch = require('./services/tinder/findmatch');
  const manychat = require('./services/tinder/manychat');
  const authEmailOrPhone = require('./services/tinder/authEmailOrPhone');
  const manychatMatchNotification = require('./services/tinder/manychatMatchNotification');
  
  // const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = require('twilio')(accountSid, authToken);


const supabaseUrl = process.env.SUPABASE_URL
 const supabaseKey = process.env.SUPABASE_KEY
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
  // twilioClient.messages
  //     .create({
  //         body: message,
  //         from: '+18662873230',
  //         to: to_address? to_address : '+17738310785'
  //     })
  //     .then(message => console.log(message.sid));
  console.log('sent twillio message')
}



// Respond with index file when a GET request is made to the homepage
app.get("/", function (_req, res) {
  console.log('index /GET coming through')
  res.render("index");

});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  console.log('get webhook')
});



app.post("/swipe", async (req, res) => {
  swipe(req, res, supabase, createSwipe,sendTwilioMessage,twilioClient);
});

app.post("/tynidm", async (req, res) => {
  tynidm(redisClient,req, res);
});

app.post("/sendpulsewebhook", async (req, res) => {
  sendpulsewebhook(redisClient,req, res);
});


app.post("/fourpics1word", async (req, res) => {
  fourpics1word(redisClient,req, res);
});

app.post("/mathPicSolver", async (req, res) => {
  mathPicSolver(redisClient,req, res);
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
