const manychatMatchNotification = async (req, res, supabase, axios) => {
  // console.log(req.body)
  const testUrl = `instagram.com/_u/${req.body.custom_fields.last_swiped_username}`
  const testUr2 = `instagram://user?username=${req.body.custom_fields.last_swiped_username}`
  const pflink = req.body.custom_fields.last_swiped_user_profile_link
  const dmlink = req.body.custom_fields.last_swiped_user_dm_link
const matchNotificationMessage = 
{
  "version": "v2",
  "type": "instagram", // "telegram" is also supported
  "content": {
    "type": "instagram",
    "messages": [
      {
        "type": "text",
        "text": `🎉 🎉New Match! 🎉🎉 you matched with ${req.body.custom_fields.last_swiped_username}`,
        "buttons": [
          {
            "type": "url",
            "caption": "Profile link",
            "url": testUrl,
          },
          {
            "type": "url",
            "caption": "DM link",
            "url": testUr2,
          },
          {
            "type": "flow",
            "caption": "keep matching",
            "target": "content20230818052645_777288"
          }
        ]
      }
    ],
    "actions": [],
    "quick_replies": [] // not supported for Telegram
  }
}

const notificationMessage = {
  subscriber_id: req.body.custom_fields.last_swiped_user,
  data: { "version": "v2",
  "type": "instagram",
  "content": {
    "type": "instagram",
    "messages": [
      {
        "type": "text",
        "text": `🎉 🎉New Match! 🎉🎉 you matched with ${req.body.ig_username}`,
        "buttons": [
          {
            "type": "url",
            "caption": "Profile link",
            "url": `instagram.com/_u/${req.body.ig_username}`,
          },
          {
            "type": "url",
            "caption": "DM link",
            "url": `instagram://user?username=${req.body.ig_username}`,
          },
          {
            "type": "flow",
            "caption": "keep matching",
            "target": "content20230818052645_777288"
          }
        ]
      }
    ],
    "actions": [],
    "quick_replies": []
  }
}
}
  axios.post('https://api.manychat.com/fb/sending/sendContent', notificationMessage, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.MANYCHAT_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

    res.status(200).send(matchNotificationMessage);
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

    axios.post(url, data, { headers: headers })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}


  module.exports = manychatMatchNotification;
