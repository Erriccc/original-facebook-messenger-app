const axios = require('axios');
const { createClient } = require('@supabase/supabase-js')
const { justUploadImage, uploadImage, upsertUser,  createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone } = require("../supabase")
const {Messenger} = require('./outBoundMessenger');
const {gptVissionWrraper,gptVissionWrraperImageOutput} = require('./mathPicSolver');




const supabaseUrl = process.env.SUPABASE_URL
 const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const storage = supabase.storage


const kcAssetBot = async (message, sendPulseAccessToken) => {
  console.log('message.contact.channelId:', message.contact.channelId, 'typeOf message.contact.channelId', typeof message.contact.channelId, 'legnth:', message.contact.channelId.toString().length)
    // const IGId = message.contact.channelId.toString();
    const IGId = message.contact.channelId;
  console.log('IGId:', IGId, 'typeOf IGId: ', typeof IGId, 'length: ', IGId.length)
  console.log('BigInt IGId:', BigInt(IGId), 'typeOf BigInt IGId: ', typeof BigInt(IGId), 'length: BigInt :', BigInt(IGId).length)
    const sendPulseContactId = message.contact.sendPulseId;
    const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN; 
    const pageId = process.env.KCASSETS_INSTAGRAM_PAGE_ID
    const flowId = '65ba0b35310fc3cef108b641'
    // const flowId = '65aaffafbe3d70f3e401e33d'

    const messenger = new Messenger(fbAccessToken, pageId, sendPulseAccessToken);

    console.log('processing message')

    // Find the active bot/feature the user wants
    if (message.userVariables.current_mini_app == 'ai_math_solver'){

    console.log('processing message reaction')

        // confirm ther is an attachment and the attachment is an image
        if (message.attachmentType && message.attachmentType == 'image'){
            
            let imageUrl = getAttachmentUrl(message)
            // {{$['imageUrl']}}"
        // // // const aiSolution = await gptVissionWrraper('https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-upload-image.webp', `You are a problem solving expert, can you solve the problem in the image above while showing step by step solutions?`)
        const aiSolution = await gptVissionWrraper(imageUrl, 
          `You are a problem solving expert, 
        can you solve the problem in the image above 
        your response should only include:  
        Solution: Answer to problem ,
        Logic: Outline the 3-5 most pivotal breakthrough steps, insights or inferences that allowed you to reach the solution. Don't include secondary details.
        // Formatting Instructions 

          Separate the solution and Logic  into paragraphs using two newline characters:


          Logic: 
          1- Find the square root...
          2- Check the next perfect...

          Solution:boxes needed to create perfect squares = 176.

          Indent the numbered solution steps with one or two tab characters (\t\t):  

          Logic:
          \t step 1- Find the square root...  
          \t\t step 2- Check the next perfect...

          When explaining mathematical reasoning, please use non-breaking spaces (\xA0) to write out key equations, formulae, or mathematical expressions on separate lines to make your mathematical working clearer to the reader.. For example:
          \xA0\xA0
          x = 5 + 3
          \xA0\xA0
          The instructions above demonstrate how to properly format your text to make the output easy to read. 
                  `
        )
         console.log('processing done, sending message')

         // use openai to interprete the users message
        const aiSolutionImageFomart = await gptVissionWrraperImageOutput(aiSolution)

       

          // generate a dynamic image that nicely displays the string generated from the openai responce
        const newImageUrl = await justUploadImage(aiSolutionImageFomart, storage,`aiSolution${Date.now()}`)
        console.log('newImageUrl:', newImageUrl)

        // send fb media message ie: message of the dynamic picture generated!
         messenger.sendFbMessage(BigInt(IGId), {
        type: 'media',
        mediaType: 'image', //image,audio,video
        // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
        url: newImageUrl
        });

         // use sendpulse to send a flow of messages to the user
        messenger.sendFlowToContact(sendPulseContactId,flowId,{followUp:'@mathAi'})
        console.log('message sent!')

        // set the active image url for follow up questions within the conversations
        try {
          const response = await axios.post('https://api.sendpulse.com/instagram/contacts/setVariable', {
              contact_id: sendPulseContactId,
              variable_name:'mathSolverImage',
              variable_value: imageUrl  
            }, 
            {
              headers: {
                Authorization: `Bearer ${sendPulseAccessToken}`  
              }
            });
        } catch(error) {
          console.error(error);
        }
        }
    }
    
  }

  function getAttachmentUrl(message) {
    if (message.attachment && message.attachment.url) {
      return message.attachment.url;
    }
    return null;
  }
  module.exports = {kcAssetBot};