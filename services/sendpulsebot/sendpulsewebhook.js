// const axios = require('axios');
// const sendpulsewebhook = async (req, res) => {
   
      
//   console.log('-------------------------------------------------------------------------------------')
//   // console.log(req.body)
//   const sendPulseReqBody = req.body[0]
//   console.log('---------------- the message: req ', sendPulseReqBody)

//   console.log('-------------------------------------------------------------------------------------')
//   console.log('---------------- the message req.info: ', sendPulseReqBody.info)

//   console.log('-------------------------------------------------------------------------------------')
//   console.log('---------------- the message req.message: ', sendPulseReqBody.info.message)

//   console.log('-------------------------------------------------------------------------------------')
//   console.log('---------------- the message req.info.message.channel_data: ', sendPulseReqBody.info.message.channel_data)
//   console.log('-------------------------------------------------------------------------------------')
//   console.log('---------------- the message req.info.message.channel_data.message.attachments: ', sendPulseReqBody.info.message.channel_data.message.attachments)

//   console.log('-------------------------------------------------------------------------------------')
//   console.log('---------------- the message req.info.message.channel_data.message.attachments.type: ', sendPulseReqBody.info.message.channel_data.message.attachments.type)



//        res.status(200).json({gptResponse:'llmresponse'});
//   };
  
//   module.exports = sendpulsewebhook;
  
const axios = require('axios');

const sendPluseClientId = process.env.SEND_PULSE_CLIENT_ID;
const sendPulseClientSecret = process.env.SEND_PULSE_CLIENT_SECRET;

const sendpulsewebhook = async (redis,req, res) => {

  const payload = req.body[0];

  // Bot details
  const botId = payload.bot.id;
  const botName = payload.bot.name;
  const service = payload.service; 
  const messageLabel = payload.title;
  const lastReply = payload.contact.last_message;


  // Sender details
  const contactId = payload.contact.id; 
  const contactName = payload.contact.name;


  const getContact = async (contactsId) => {

    const getAccessToken = async () => {
      const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
        grant_type: 'client_credentials',
        client_id: sendPluseClientId,
        client_secret: sendPulseClientSecret
      });
    
      return response.data.access_token; 
    }

    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(`https://api.sendpulse.com/instagram/contacts/get?id=${contactsId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`   
        }
      });
  
      const channelData = response.data.data.channel_data;
  
      console.log('-------------------------------------------------------------------------------------')
      console.log("channelData :", channelData)
  
      return channelData;
  
    } catch (error) {
      console.log(error);
    }
  
  }
  
  const contactsChannelData = await getContact(contactId);


  // Message details
  const messageId = payload.info.message.id;
  const messageText = payload.info.message.channel_data.message.text;
  const messageAttachments = payload.info.message.channel_data.message.attachments;

// Check if message is a story reply
  const storyReply = (payload.info.message.channel_data.message.reply_to ? 'True' : 'False');
  const commentFromPost = (payload.info.message.channel_data.message.media ? 'True' : 'False');

  let messageType;
  if (messageAttachments) {
    messageType = 'attachment';
  } else if (messageText) {
    messageType = 'text';
  }

  // Attachment details if available
  let attachmentUrl;
  let attachmentType;
  if (messageAttachments) {
    attachmentUrl = messageAttachments[0].payload.url; 
    attachmentType = messageAttachments[0].type; 
  }

  // Construct message
  const message = {
    bot: {
      id: botId,
      name: botName  
    },
    contact: {
      sendPulseId: contactId,
      name: contactName,
      channelId: contactsChannelData.id,
      channelUserName: contactsChannelData.user_name,
      is_verified_user: contactsChannelData.is_verified_user,
      follower_count: contactsChannelData.follower_count,
      is_user_follow_business: contactsChannelData.is_user_follow_business,
      is_business_follow_user: contactsChannelData.is_business_follow_user

    },
    id: messageId,   
    type: messageType,
    text: messageText,
    attachmentType,
    service,
    messageLabel, 
    lastReply,
    storyReply,
    commentFromPost,
    attachment: {
      type: attachmentType,
      url: attachmentUrl
    }
  };


      
  console.log('-------------------------------------------------------------------------------------')
  // console.log(req.body)

  // Rest of the code...
  console.log("message :", message)

     
  const sendPulseReqBody = req.body[0]
  console.log('---------------- the message: req ', sendPulseReqBody)
      console.log('-------------------------------------------------------------------------------------')
    console.log('---------------- the message sendPulseReqBody.info.message: ', sendPulseReqBody.info.message)
    console.log('-------------------------------------------------------------------------------------')


  res.status(200).json({gptResponse:'llmresponse'});

};

module.exports = sendpulsewebhook;