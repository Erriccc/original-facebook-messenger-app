const axios = require('axios');
const {ChatOpenAI} = require("@langchain/openai");
const {PromptTemplate} = require("@langchain/core/prompts");
const { HumanMessage,SystemMessage,AIMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {RunnableLambda,RunnableMap,RunnablePassthrough,RunnableSequence} = require ("@langchain/core/runnables");
const {LLMChain} = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");

const sendPluseClientId = process.env.SEND_PULSE_CLIENT_ID;
const sendPulseClientSecret = process.env.SEND_PULSE_CLIENT_SECRET;

const mathPicSolver = async (redis,req, res) => {

const {UpstashRedisChatMessageHistory} = await import("@langchain/community/stores/message/upstash_redis");


  console.log('req.body-------------------------------------------')
  console.log(req.body)
  console.log(req.body.imageUrl)


  const model = new ChatOpenAI({
    modelName: "gpt-4-vision-preview",
    // temperature: 0,
    maxTokens: 1024,
    openAIApiKey: process.env.OPEN_AI_API_KEY
  });


  const ImageMessagetemplate = new HumanMessage({
    content: [
      {
        type: "text",
        text: "you are problem solving expert, can you solve the any problems presented by the user in the pictures above while showing step by step solutions",
        // text: "the name of the game is 4 pics one word, whats is the word?",
      },
      {
        type: "image_url",
        image_url: req.body.imageUrl,
          // detail: "low",
      },
    ],
  });

  
const template = `Yoo u are Tyni, an experienced problem solver`;

const prompt = PromptTemplate.fromTemplate(template);

const upStashMemory = new BufferMemory({
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: req.body.name,
    // sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
    memoryKey: "history",
    client:await redis()
  }),
});
const conversationChain = new LLMChain({
  llm:model,
  prompt,
  verbose: false,
  memory: upStashMemory
});


console.log('yooooo...')

const stringParser = new StringOutputParser();

const chain = RunnableSequence.from([model,stringParser])
  const aiStringResponse = await chain.invoke([ImageMessagetemplate]);
  console.log('aiStringResponse===========================================================================res2');
  console.log( aiStringResponse )
  // const res2 = await model.invoke([ImageMessagetemplate]);
  console.log('res2===========================================================================res2');
  // console.log( res2.content )
  
//   const payload = req.body[0];

//   // Bot details
//   const botId = payload.bot.id;
//   const botName = payload.bot.name;
//   const service = payload.service; 
//   const messageLabel = payload.title;
//   const lastReply = payload.contact.last_message;


//   // Sender details
//   const contactId = payload.contact.id; 
//   const contactName = payload.contact.name;


//   const getContact = async (contactsId) => {

//     const getAccessToken = async () => {
//       const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
//         grant_type: 'client_credentials',
//         client_id: sendPluseClientId,
//         client_secret: sendPulseClientSecret
//       });
    
//       return response.data.access_token; 
//     }

//     const accessToken = await getAccessToken();
//     try {
//       const response = await axios.get(`https://api.sendpulse.com/instagram/contacts/get?id=${contactsId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`   
//         }
//       });
  
//       const channelData = response.data.data.channel_data;
  
//       console.log('-------------------------------------------------------------------------------------')
//       console.log("channelData :", channelData)
  
//       return channelData;
  
//     } catch (error) {
//       console.log(error);
//     }
  
//   }
  
//   const contactsChannelData = await getContact(contactId);


//   // Message details
//   const messageId = payload.info.message.id;
//   const messageText = payload.info.message.channel_data.message.text;
//   const messageAttachments = payload.info.message.channel_data.message.attachments;

// // Check if message is a story reply
//   const storyReply = (payload.info.message.channel_data.message.reply_to ? 'True' : 'False');
//   const commentFromPost = (payload.info.message.channel_data.message.media ? 'True' : 'False');

//   let messageType;
//   if (messageAttachments) {
//     messageType = 'attachment';
//   } else if (messageText) {
//     messageType = 'text';
//   }

//   // Attachment details if available
//   let attachmentUrl;
//   let attachmentType;
//   if (messageAttachments) {
//     attachmentUrl = messageAttachments[0].payload.url; 
//     attachmentType = messageAttachments[0].type; 
//   }

//   // Construct message
//   const message = {
//     bot: {
//       id: botId,
//       name: botName  
//     },
//     contact: {
//       sendPulseId: contactId,
//       name: contactName,
//       channelId: contactsChannelData.id,
//       channelUserName: contactsChannelData.user_name,
//       is_verified_user: contactsChannelData.is_verified_user,
//       follower_count: contactsChannelData.follower_count,
//       is_user_follow_business: contactsChannelData.is_user_follow_business,
//       is_business_follow_user: contactsChannelData.is_business_follow_user

//     },
//     id: messageId,   
//     type: messageType,
//     text: messageText,
//     attachmentType,
//     service,
//     messageLabel, 
//     lastReply,
//     storyReply,
//     commentFromPost,
//     attachment: {
//       type: attachmentType,
//       url: attachmentUrl
//     }
//   };



  res.status(200).json([
    {fourpics:aiStringResponse},
    // {fourpics:'4pics1word2'},
    // {fourpics:'4pics1word3'},
    // {fourpics:'4pics1word4'},
    // {fourpics:'4pics1word5'}, 
    // {fourpics:'4pics1word6'},
    // {fourpics:'4pics1word7'},  
    // {fourpics:'4pics1word8'}
  ]);

};

module.exports = mathPicSolver;