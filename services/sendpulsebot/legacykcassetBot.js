const axios = require('axios');
const fetch = require("node-fetch");
  const { URL, URLSearchParams } = require("url");
const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN2; 
const pageId = process.env.KCASSETS_INSTAGRAM_PAGE_ID

const fbApiSendMessageAttachment = async (message, attachmentType, attachmentUrl, accessToken) => {

    const recipientId = message.contact.channelId;
    
    // const url = `https://graph.facebook.com/v10.0/me/messages?recipient={id: ${recipientId}}&access_token=${accessToken}`;
    const url = `https://graph.facebook.com/v18.0/${pageId}/messages?recipient={id: ${recipientId}}&access_token=${accessToken}`;
  


    const fbCardMessage = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "1!",
                image_url: "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png",
                subtitle: "We have the right hat for everyone.",
                default_action: {
                  type: "web_url",
                  url: "https://www.originalcoastclothing.com"
                },
                buttons: [
                  {
                    type: "web_url", 
                    url: "https://www.originalcoastclothing.com",
                    title: "View Website"
                  },
                  {
                    type: "postback",
                    title: "Start Chatting",
                    payload: "DEVELOPER_DEFINED_PAYLOAD"
                  }
                ]
              },
              {
                title: "2!",
                subtitle: "We have the right hat for everyone.",
                default_action: {
                  type: "web_url",
                  url: "https://www.originalcoastclothing.com"
                },
                buttons: [
                  {
                    type: "web_url", 
                    url: "https://www.originalcoastclothing.com",
                    title: "View Website"
                  },
                  {
                    type: "postback",
                    title: "Start Chatting",
                    payload: "DEVELOPER_DEFINED_PAYLOAD"
                  }
                ]
              },
              {
                title: "3!",
                image_url: "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png",
                subtitle: "We have the right hat for everyone.",
                buttons: [
                  {
                    type: "web_url", 
                    url: "https://www.originalcoastclothing.com",
                    title: "View Website"
                  },
                  {
                    type: "postback",
                    title: "Start Chatting",
                    payload: "DEVELOPER_DEFINED_PAYLOAD"
                  }
                ]
              }
            ]
          }
        }
      };
      const mediaAttachmentMessage = {
        attachment: {
          type: attachmentType, // audio, image, video
          payload: {
            url:attachmentUrl 
          },
        //   is_reusable: true  
        }
      }
    const payload = {
      message: fbCardMessage
    };
    const textMessage =  {
          text: "text message with quick replies",
          quick_replies: [
            {
              content_type: "text",
              title: "<TITLE_1>",
              payload: "<POSTBACK_PAYLOAD_1>"
            },
            {
              content_type: "text", 
              title: "<TITLE_2>",
              payload: "<POSTBACK_PAYLOAD_2>"
            }
          ]
        }
    const textPayload = {
        messaging_type: "RESPONSE",
        message:textMessage
    }

    try {
      const response = await axios.post(url, payload);
      console.log(response.data);
    } catch (error) {
      console.error(error);  
    }
  }
  
  
const kcAssetBot = async (message, axios, accessToken) => {

      // Photo use case
      await axios.post('https://api.sendpulse.com/instagram/contacts/send', {
        "contact_id": message.contact.sendPulseId,
        "messages": [
            // text message
            {
                "type": "text", 
                "message": {
                 "text": "Thanks for sending the attachment! Our team will review it shortly."  
                }
               },
               // image message
            {
          "type": "image", 
          "message": {
            "attachment": {
              "type": "image",
              "payload": {
                "is_external_attachment": true,
                "url": "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png" 
              }
            }
          }
        },
        // carousel message
        {
            "type": "generic_template",
            "message": {
              "attachment": {
                "payload": {
                  "elements": [
                    {
                      "title": "Example title",
                      "subtitle": "Example subtitle",
                      "image_url": "https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png",
                      "is_external_attachment": true,
                      "buttons": [
                        {
                          "type": "web_url",
                          "title": "Example button",
                          "url": "https://google.com/"
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
    ]
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`  
        }
      });

    // const attachmentType = 'image'; 
    //   const attachmentType = 'audio'; 
    const attachmentType = 'video'; 
    const attachmentUrl = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';
    // const attachmentUrl = 'https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-result.png';
    fbApiSendMessageAttachment(message, attachmentType, attachmentUrl, fbAccessToken);
  }


  module.exports = {kcAssetBot,fbApiSendMessageAttachment};