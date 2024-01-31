const axios = require('axios');


class Messenger {
  constructor(fbAccessToken, pageId, sendPulseAccessToken) {
    this.fbAccessToken = fbAccessToken;
    this.pageId = pageId;
    this.sendPulseAccessToken = sendPulseAccessToken;
  }

  async sendFbMessage(recipientId, message) {
    const url = `https://graph.facebook.com/v18.0/${this.pageId}/messages?recipient={id: ${recipientId}}&access_token=${this.fbAccessToken}`;
    
    let payload;
    // let payload = message;
    if (message.type === 'text') {
      payload = this.constructFbTextMessage(
        message.text, 
        message.quickReplies
      );
    } else if (message.type === 'media') {
      payload = this.constructFbMediaMessage(
        message.mediaType,
        message.url
      );
    } else if (message.type === 'generic') {
      payload = this.constructFbGenericMessage(
        message.elements  
      );
    }
    

    try {
      const response = await axios.post(url, payload);
      console.log(response.data);
    } catch (error) {
     console.error(error);  
    }
  }
  constructFbTextMessage(text, quickReplies) {
    return {
      messaging_type: "RESPONSE",
      message: {
        text: text,
        quick_replies: quickReplies
      }
    };
  }

  constructFbMediaMessage(type, url) {
    return {
      // messaging_type: "RESPONSE", 
      message: {
        attachment: {
          type: type,
          payload: {
            url: url
          }
        }
      }
    };
  }

  constructFbGenericMessage(elements) {
    return {
      // messaging_type: "RESPONSE",
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements
          }
        }
      }  
    };
  }

  constructSendPulseTextMessage(text) {
    return {
     type: "text",
     message: {
       text: text
     }
    };
  }
  
  constructSendPulseMediaMessage(type, url) {
    return {
     type: "image",
     message: {
       attachment: {
         type: type,
         payload: {
           is_external_attachment: true,
           url: url
         }
       }
     }
    };
  }
  
  constructSendPulseGenericMessage(elements) {
    return {
     type: "generic_template",
     message: {
       attachment: {
         payload: {
           elements: elements  
         }
       }
     }
    };
  }


  async sendPulseMessage(contactId, message) {

    let messages;

    if(message.type === 'text') {
      messages = [this.constructSendPulseTextMessage(message.text)];
    } else if(message.type === 'media') {
      messages = [this.constructSendPulseMediaMessage(message.mediaType, message.url)]; 
    } else if(message.type === 'generic') {
      messages = [this.constructSendPulseGenericMessage(message.elements)];
    }


    try {
      const response = await axios.post('https://api.sendpulse.com/instagram/contacts/send', {
          contact_id: contactId,
          messages: messages  
        }, 
        {
          headers: {
            Authorization: `Bearer ${this.sendPulseAccessToken}`  
          }
        });
    } catch(error) {
      console.error(error);
    }
  }
}


// // Usage:

    // const messenger = new Messenger(fbAccessToken, pageId, sendPulseAccessToken);

    
    // messenger.sendFbMessage(IGId, {
    //     type: 'text',
    //     text: 'Hello World!',
    //     // quickReplies: [] 
    //   });

    //   // Send Pulse text  
    // messenger.sendPulseMessage(sendPulseContactId, {
    // type: 'text',
    // text: 'Hello sendpulse!'
    // });

    // Send FB image
    // messenger.sendFbMessage(IGId, {
    // type: 'media',
    // mediaType: 'image', //image,audio,video
    //Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
    // url: 'https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png' 
    // });
  
  // Send Pulse image
    // messenger.sendPulseMessage(sendPulseContactId, {
    // type: 'media',
    // mediaType: 'image', 
    // url: 'https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png'  
    // });


   //  // FB generic template
    // messenger.sendFbMessage(IGId, {
    //     type: 'generic',
    //     elements: [
    //     {
    //         title: "fbapi card!",
    //         image_url: "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png", //optional
    //         subtitle: "We have the right hat for everyone.", //optional
    //         default_action: {type: "web_url",url: "https://www.originalcoastclothing.com"}, // optional
    //         buttons: [
    //         {type: "web_url",url: "https://example.com/offer",title: "View Offer"}, // url type
    //         //   {type: "postback",title: "Start Chatting",payload: "DEVELOPER_DEFINED_PAYLOAD"}  // payload type
    //         ]  
    //     }
    //     ] 
    // });
  
  // // SendPulse generic template  
//   messenger.sendPulseMessage(sendPulseContactId, {
//     type: 'generic', 
//     elements: [
//       {
//        title: "sendpulse card",
//        subtitle: "Example subtitle", //optional
//        image_url: "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png", //optional
//        is_external_attachment: true, //required
//        buttons: [
//         {type: "web_url",url: "https://example.com/offer",title: "View Offer"}, // url type
//       //   {type: "postback",title: "Start Chatting",payload: "DEVELOPER_DEFINED_PAYLOAD"}  // payload type
//       ]  
//      }
//    ]
//   });

  module.exports = {Messenger};