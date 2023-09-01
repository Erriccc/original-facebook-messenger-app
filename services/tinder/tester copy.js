const axios = require('axios');
const data4 = {
  "channel_id": "64e3aacd904d33aae6917c56",
  "contact_id": "64e3aaeb904d33330b917cac",
  "facebook_payload": {
      "attachment": {
          "type": "template",
          "payload": {
              "elements": [
                  {
                      "title":"Something",
                      "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
                      "buttons": [
                          {
                              "type": "web_url",
                              "url": "https://honeyandbanana.com/images/methods/IUD.jpg",
                              "title": "View Website"
                          }
                      ]
                  }
              ],
              "template_type": "generic"
          }
      }
  }
}
const data3 = {
  "channel_id": "64e3aacd904d33aae6917c56",
  "contact_id": "64e3aaeb904d33330b917cac",
  "facebook_payload": {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "media_type": "image",
          "url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "buttons": [
             {
              "type": "web_url",
              "url": "https://honeyandbanana.com/images/methods/IUD.jpg",
              "title": "View Website",
             }
          ]
       }
      ]
    }
  }
}
}

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
          "subtitle": "is a small T-shaped intrauterine device which prevent pregnancy for up to 10yrs",
          "buttons": [
            {
              "type": "postback",
              "title": "View details",
              "payload": "something"
            }
          ],
          "image_url": "https://honeyandbanana.com/images/methods/IUD.jpg",
          "title": "IUD"
        }
      ],
      "template_type": "generic"
    }
  }
}
}

const data1 = {
  "channel_id": "64e3aacd904d33aae6917c56",
  "contact_id": "64e3aaeb904d33330b917cac",
  "facebook_payload": {
      "attachment": {
          "type": "template",
          "payload": {
              "elements": [
                  {
                      "buttons": [
                          {
                              "title": "Ask Questions",
                              "type": "postback",
                              "payload": "ask-questions"
                          },
                          {
                              "title": "Suggest Me",
                              "type": "postback",
                              "payload": "suggest-me"
                          },
                          {
                              "payload": "Find Products",
                              "title": "Find Products",
                              "type": "postback"
                          }
                      ],
                      "subtitle": "I would answer all your questions and also you can find products from DKT",
                      "title": "Welcome to Honey & Banana, your perfect family planning companion."
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

    await sendRampwinMessage('hi test text','https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=1254070125274910&signature=AbwCsXe06htUfwvUaRSHFbFscTIlvqoyid6caMz9kSdjFObAiMyJp3ZrY267jlcU27oMMrHhUHlowVqne8X-m-h3_Zv4WSz7ao6GiumD9jLXhrx_MUSj0l4puw7L-sEYv5WWrTe1dXeBvmKQibvUoCHKdxOSzQgWCpFrjREFKjI5RyXhPt5b_nh_DkfkYi3fRX8DZwxQIgq7_3fkXRM307OcckPirQ')
  
    const messageDetails = message.message;
    const messageType = messageDetails.type;
  
    let igMessageSender;
    findUserByIgId(supabase, ig_id).then(data => {
      igMessageSender = data;
      // console.log('sender from manychat and db is ', igMessageSender);
    });
  
    res.status(200).send({ match: req.body });
  };
  

  function sendRampwinMessage(text, fileUrl) {
    const url = 'https://api.rampwin.com/api/messages/send';
    const headers = {
        'X-API-Key': 'vUoIqBXSDufToaeeAktRKSC1X9Oy9lLs',
        'Content-Type': 'application/json'
    };
    const data = {
        channel_id: '64e3aacd904d33aae6917c56',
        // phone_number: phoneNumber,
        contact_id: '64e3aaeb904d33330b917cac',
        text: text,
        file_url: fileUrl
    };

    // uploadAttachmentToFb( process.env.RAMPWIN_FB_PAGE_ID,process.env.RAMPWIN_FB_ACCESS_TOKEN, 'https://file-examples.com/storage/fead1d809b64e7bcd9ab4f1/2017/04/file_example_MP4_480_1_5MG.mp4');
    //     axios.post(url, data4, { headers: headers })
    //     .then(response => {
    //       console.log('done')
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
}

async function uploadAttachmentToFb(pageId, accessToken, videoUrl) {
  const url = `https://graph.facebook.com/v17.0/${pageId}/message_attachments`;
  const data = {
    platform: 'instagram',
    access_token: accessToken,
    message: {
      attachment: {
        type: 'video',
        payload: {
          url: videoUrl,
          is_reusable: true
        }
      }
    }
  };
  const headers = { 'Content-Type': 'application/json' };
  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


  module.exports = tester;
  
