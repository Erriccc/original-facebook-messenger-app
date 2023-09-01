const axios = require('axios');
const data2 = {
  "channel_id": "64e3aacd904d33aae6917c56",
  "contact_id": "64e3aaeb904d33330b917cac",
  "facebook_payload": {
  "attachment": {
    "type": "template",
    "payload": {
      "elements": [
        {
          "subtitle": "pill is a safe way to prevent pregnancy after unprotected or unplanned sex.",
          "image_url": "https://honeyandbanana.com/images/methods/ecp.jpg",
          "buttons": [
            {
              "payload": "something",
              "title": "View details",
              "type": "postback"
            }
          ],
          "title": "Emergency Contraceptive"
        },
        {
          // "subtitle": "is a small T-shaped intrauterine device which prevent pregnancy for up to 10yrs",
          // "buttons": [
          //   {
          //     "type": "postback",
          //     "title": "View details",
          //     "payload": "something"
          //   }
          // ],
          "subtitle": "pill is a safe way to prevent pregnancy after unprotected or unplanned sex.",
          // "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD"
        },
        {
          "subtitle": "pill is a safe way to prevent pregnancy after unprotected or unplanned sex.",
          "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD"
        },
        {
          "subtitle": "pill is a safe way to prevent pregnancy after unprotected or unplanned sex.",
          // "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD",
          "buttons": [
            {
              "type": "postback",
              "title": "View details",
              "payload": "something"
            }
          ],
        },
        {
          // "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD"
        },
        {
          // "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD"
        }
      ],
      "template_type": "generic"
    }
  }
}
}

const tester = async (req, res, supabase,findUserByIgId) => {
    // console.log(req.body.message);
    // console.log(req.body.message.message.type);
  
    const webhookType = req.body.type;
    const message = req.body.message;
    const sender = message.sender;
    const ig_id = sender.id;
    // console.log('rampwin contact id is ', req.body.contact.id);
    console.log('sender from ig is ', ig_id);

    await sendRampwinMessage('hi test text',
    'https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=1254070125274910&signature=AbwCsXe06htUfwvUaRSHFbFscTIlvqoyid6caMz9kSdjFObAiMyJp3ZrY267jlcU27oMMrHhUHlowVqne8X-m-h3_Zv4WSz7ao6GiumD9jLXhrx_MUSj0l4puw7L-sEYv5WWrTe1dXeBvmKQibvUoCHKdxOSzQgWCpFrjREFKjI5RyXhPt5b_nh_DkfkYi3fRX8DZwxQIgq7_3fkXRM307OcckPirQ',
    '64e3aaeb904d33330b917cac')
  
    const messageDetails = message.message;
    const messageType = messageDetails.type;
  
    let igMessageSender;
    findUserByIgId(supabase, ig_id).then(data => {
      igMessageSender = data;
      // console.log('sender from manychat and db is ', igMessageSender);
    });
  
    res.status(200).send({ match: req.body });
  };
  

  function sendRampwinMessage(text, fileUrl,contact_id) {
    const url = 'https://api.rampwin.com/api/messages/send';
    const headers = {
        'X-API-Key': 'vUoIqBXSDufToaeeAktRKSC1X9Oy9lLs',
        'Content-Type': 'application/json'
    };
    const data = {
        channel_id: '64e3aacd904d33aae6917c56',
        // phone_number: phoneNumber,
        contact_id:  contact_id,
        text: text,
        file_url: fileUrl
    };

        // axios.post(url, data2, { headers: headers })
        // .then(response => {
        //   console.log('done')
        //     console.log(response.data);
        // })
        // .catch(error => {
        //     console.error(error);
        // });
}



  module.exports = tester;
  
