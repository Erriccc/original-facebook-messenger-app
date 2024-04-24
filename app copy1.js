"use strict";
// Import dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  crypto = require("crypto"),
  path = require("path"),
  Receive = require("./services/receive"),
  GraphApi = require("./services/graph-api"),
  User = require("./services/user"),
  config = require("./services/config"),
  i18n = require("./i18n.config"),
  
  
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
  
  const getWebhook = require('./services/fbWebhooks/getWebhook');
  const postWebhook = require('./services/fbWebhooks/postWebhook');
  

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
// Parse application/json. Verify that callback came from Facebook
app.use(json({ verify: verifyRequestSignature }));
// Serving static files in Express
app.use(express.static(path.join(path.resolve(), "public")));
// Set template engine in Express
app.set("view engine", "ejs");
// Respond with index file when a GET request is made to the homepage
app.get("/", function (_req, res) {
  console.log('index /GET coming through')
  res.render("index");
});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  getWebhook(req, res, config)
});


function sendTwilioMessage(twilioClient, to_address, message) {
  twilioClient.messages
      .create({
          body: message,
          from: '+18662873230',
          to: to_address? to_address : '+17738310785'
      })
      .then(message => console.log(message.sid));
}


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



app.post("/webhook", (req, res) => {
  postWebhook(req, res,Receive,isGuestUser,User,users,GraphApi,i18n,setDefaultUser,receiveAndReturn);
});

function setDefaultUser(id) {
  let user = new User(id);
  users[id] = user;
  i18n.setLocale("en_US");
}
function isGuestUser(webhookEvent) {
  let guestUser = false;
  if ("postback" in webhookEvent) {
    if ("referral" in webhookEvent.postback) {
      if ("is_guest_user" in webhookEvent.postback.referral) {
        guestUser = true;
      }
    }
  }
  return guestUser;
}
function receiveAndReturn(user, webhookEvent, isUserRef) {
  let receiveMessage = new Receive(user, webhookEvent, isUserRef);
  return receiveMessage.handleMessage();
}
// Set up your App's Messenger Profile
app.get("/profile", (req, res) => {
  let token = req.query["verify_token"];
  let mode = req.query["mode"];
  if (!config.webhookUrl.startsWith("https://")) {
    res.status(200).send("ERROR - Need a proper API_URL in the .env file");
  }
  var Profile = require("./services/profile.js");
  Profile = new Profile();
  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    if (token === config.verifyToken) {
      if (mode == "webhook" || mode == "all") {
        Profile.setWebhook();
        res.write(
          `<p>&#9989; Set app ${config.appId} call to ${config.webhookUrl}</p>`
        );
      }
      if (mode == "profile" || mode == "all") {
        Profile.setThread();
        res.write(
          `<p>&#9989; Set Messenger Profile of Page ${config.pageId}</p>`
        );
      }
      if (mode == "personas" || mode == "all") {
        Profile.setPersonas();
        res.write(`<p>&#9989; Set Personas for ${config.appId}</p>`);
        res.write(
          "<p>Note: To persist the personas, add the following variables \
          to your environment variables:</p>"
        );
        res.write("<ul>");
        res.write(`<li>PERSONA_BILLING = ${config.personaBilling.id}</li>`);
        res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`);
        res.write(`<li>PERSONA_ORDER = ${config.personaOrder.id}</li>`);
        res.write(`<li>PERSONA_SALES = ${config.personaSales.id}</li>`);
        res.write("</ul>");
      }
      if (mode == "nlp" || mode == "all") {
        GraphApi.callNLPConfigsAPI();
        res.write(
          `<p>&#9989; Enabled Built-in NLP for Page ${config.pageId}</p>`
        );
      }
      if (mode == "domains" || mode == "all") {
        Profile.setWhitelistedDomains();
        res.write(
          `<p>&#9989; Whitelisted domains: ${config.whitelistedDomains}</p>`
        );
      }
      if (mode == "private-reply") {
        Profile.setPageFeedWebhook();
        res.write(`<p>&#9989; Set Page Feed Webhook for Private Replies.</p>`);
      }
      res.status(200).end();
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Returns a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
});
// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
// Check if all environment variables are set
config.checkEnvVariables();
// Listen for requests :)
var listener = app.listen(config.port, function () {
  console.log(`The app is listening on port ${listener.address().port}`);
  if (
    Object.keys(config.personas).length == 0 &&
    config.appUrl &&
    config.verifyToken
  ) {
    console.log(
      "Is this the first time running?\n" +
        "Make sure to set the both the Messenger profile, persona " +
        "and webhook by visiting:\n" +
        config.appUrl +
        "/profile?mode=all&verify_token=" +
        config.verifyToken
    );
  }
  if (config.pageId) {
    console.log("Test your app by messaging:");
    console.log(`https://m.me/${config.pageId}`);
  }
});
