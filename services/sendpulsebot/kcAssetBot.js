const axios = require('axios');
const {Messenger} = require('./outBoundMessenger');
const {gptVissionWrraper} = require('./mathPicSolver');


const kcAssetBot = async (message, sendPulseAccessToken) => {
    const IGId = message.contact.channelId;
    const sendPulseContactId = message.contact.sendPulseId;
    const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN2; 
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
        // const aiSolution = await gptVissionWrraper('https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-upload-image.webp', `You are a problem solving expert, can you solve the problem in the image above while showing step by step solutions?`)
        const aiSolution = await gptVissionWrraper(imageUrl, `You are a problem solving expert, in less than 500 characters can you solve the problem in the image above while showing major reasoning steps to solutions?`)
         console.log('processing done, sending message')
        
        messenger.sendFlowToContact(sendPulseContactId,flowId,{aiSolution,imageUrl})
        console.log('message sent!')

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