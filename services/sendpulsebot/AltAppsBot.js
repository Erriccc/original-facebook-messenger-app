const axios = require('axios');
const FormData = require('form-data');
const { createClient } = require('@supabase/supabase-js')
const { justUploadAudio, justUploadImage, uploadImage, upsertUser,  createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone } = require("../supabase")
const {Messenger} = require('./outBoundMessenger');
const {gptVissionWrraper,generateImageOutput} = require('./mathPicSolver');




const supabaseUrl = process.env.SUPABASE_URL
 const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const storage = supabase.storage


const AltAppsBot = async (message, sendPulseAccessToken, setContactSendPulseVariableByName) => {
  console.log('message.contact.channelId:', message.contact.channelId, 'typeOf message.contact.channelId', typeof message.contact.channelId, 'legnth:', message.contact.channelId.toString().length)
    // const IGId = message.contact.channelId.toString();
    const IGId = message.contact.channelId;
  console.log('IGId:', IGId, 'typeOf IGId: ', typeof IGId, 'length: ', IGId.length)
  console.log('BigInt IGId:', BigInt(IGId), 'typeOf BigInt IGId: ', typeof BigInt(IGId), 'length: BigInt :', BigInt(IGId).length)
    const sendPulseContactId = message.contact.sendPulseId;
    const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN; 
    const pageId = process.env.KCASSETS_INSTAGRAM_PAGE_ID
    const mathAiFlowId = '65ba0b35310fc3cef108b641'
    const voiceChangerFlowId = '660ca1e71314c66b6c0913f2'
    const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY

    const messenger = new Messenger(fbAccessToken, pageId, sendPulseAccessToken);

    console.log('processing message')

    // Find the active bot/feature the user wants
    if (message.userVariables.current_mini_app == 'ai_math_solver'){
    
      

    console.log('processing ai_math_solver message reaction')

                // confirm ther is an attachment and the attachment is an image
                if (message.attachmentType && message.attachmentType == 'image'){
                    
                    let imageUrl = getAttachmentUrl(message)
                    // {{$['imageUrl']}}"
                // // // const aiSolution = await gptVissionWrraper('https://www.scriptbyai.com/wp-content/uploads/2023/09/MathGPTPro-AI-math-solver-upload-image.webp', `You are a problem solving expert, can you solve the problem in the image above while showing step by step solutions?`)
                
                // use openai to interprete the users message
                const aiSolution = await gptVissionWrraper(imageUrl, 
                `
                You are @alt_apps on instagram a problem-solving expert. Your task is to solve the problem in the image above.

                        Your response should follow this format:

                        Solution:
                        [Answer to the problem, written concisely]

                        Logic:
                        [Outline the 3-5 most pivotal steps, insights or inferences that allowed you to reach the solution. Do not include secondary details.]

                        Formatting Instructions:
                        - Separate the Solution and Logic sections by two newline characters.
                        - Indent numbered steps in the Logic section with two tab characters (\t\t).
                        - Use non-breaking spaces (\xA0\xA0) to write out key equations, formulae, or mathematical expressions on separate lines for clarity.

                        Example:

                        \xA0 follow @alt_apps on instagram 
                        Solution:
                        [Concise answer]

                        Logic:
                        \t\t1. [Step 1]
                        \t\t2. [Step 2]

                        \xA0\xA0
                        [Mathematical expression]
                        \xA0\xA0

                        Be concise in your responses, and strictly follow the formatting instructions above.
                `
                )
                console.log('processing done, sending message')
                //  ⬇

                  // generate a dynamic image that nicely displays the string generated from the openai responce
                const aiSolutionImageFomart = await generateImageOutput(aiSolution)
              
                // Upload generated image to supabase and get public url returned 
                const newImageUrl = await justUploadImage(aiSolutionImageFomart, storage,`aiSolution${Date.now()}`)
                console.log('newImageUrl:', newImageUrl)

                // send fb media message ie: message of the dynamic picture generated!
                await messenger.sendFbMessage(BigInt(IGId), {
                type: 'media',
                mediaType: 'image', //image,audio,video
                // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
                url: newImageUrl
                })

                // use sendpulse to send a flow of messages to the user
                messenger.sendFlowToContact(sendPulseContactId,mathAiFlowId,{followUp:'@mathAi'})
                console.log('message sent!')
                await setContactSendPulseVariableByName(sendPulseContactId,'mathSolverImage' ,imageUrl )
                }
                // check if the message is text and a follow up to an image
                else if(message.type == 'text' && message.userVariables.mathSolverImage){
                  // get the mathSolverImage
                  let imageUrl = getAttachmentUrl(message)

                  const aiSolution = await gptVissionWrraper(imageUrl, 
                  
                    `
                    You are @alt_apps on instagram a problem-solving expert. The user may ask questions related or unrelated to the attached image. Your job is to determine if the question is relevant to the image and use that context to answer accordingly.

                        Follow up question: ${message.text}

                        Please make sure your response only answers the follow-up question. Do not include secondary details about the image-text relation.

                        Sample response :
                        Solution: Provide only the final answer to the problem, without any additional context or explanation.

                        Logic:
                        1. Outline 3-5 key steps, insights, or inferences that led to the solution. Do not include secondary details.
                        2. Use numbered steps, indented with two tab characters (\t\t).
                        3. When explaining mathematical reasoning, use non-breaking spaces (\xA0) to write out key equations, formulae, or mathematical expressions on separate lines.

                        For example:
                        \xA0 follow @alt_apps on instagram 
                        Solution: 176

                        Logic:
                        \t\t1. Find the square root of the given number.
                        \t\t2. \xA0\xA0 
                                  x = √(given number)
                              \xA0\xA0
                        \t\t3. Check the next perfect square above the calculated square root.
                        \t\t4. Determine the difference between the given number and the next perfect square.
                        \t\t5. This difference is the number of boxes needed to create a perfect square.

                        Remember, your response should focus solely on answering the follow-up question, following the specified format. Do not include any additional explanations or context.
                    `
                  )
                  console.log('processing done, sending message')
                  //  ⬇

                    // generate a dynamic image that nicely displays the string generated from the openai responce
                const aiSolutionImageFomart = await generateImageOutput(aiSolution)
              
                // Upload generated image to supabase and get public url returned 
                const newImageUrl = await justUploadImage(aiSolutionImageFomart, storage,`aiSolution${Date.now()}`)
                console.log('newImageUrl:', newImageUrl)

                // send fb media message ie: message of the dynamic picture generated!
                await messenger.sendFbMessage(BigInt(IGId), {
                  type: 'media',
                  mediaType: 'image', //image,audio,video
                  // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
                  url: newImageUrl
                  })

                // use sendpulse to send a flow of messages to the user
                  messenger.sendFlowToContact(sendPulseContactId,mathAiFlowId,{followUp:'@mathAi'})
                  console.log('message sent!')
                }
    }
    else if (message.userVariables.current_mini_app == 'remove_bg') {
      console.log('processing remove_bg message reaction')
    
      if (message.attachmentType && message.attachmentType == 'image') {
        let imageUrl = getAttachmentUrl(message)
    
        try {
          const formData = new FormData();
          formData.append('size', 'auto');
          formData.append('image_url', imageUrl);
    
          const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
              ...formData.getHeaders(),
              'X-Api-Key': process.env.REMOVE_BG_API_KEY,
            },
            encoding: null
          });
    
          if (response.status !== 200) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
    
          const base64Image = Buffer.from(response.data, 'binary').toString('base64');
          const noBgImageURL = `data:image/png;base64,${base64Image}`;
    
          // Upload generated image to supabase and get public url returned
          const newImageUrl = await justUploadImage(noBgImageURL, storage, `removeBg${Date.now()}`);
          console.log('newImageUrl:', newImageUrl);
    
          // send fb media message ie: message of the dynamic picture generated!
          await messenger.sendFbMessage(BigInt(IGId), {
            type: 'media',
            mediaType: 'image', //image,audio,video
            // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: mp4, ogg, avi, mov, webm Max(25MB)
            url: newImageUrl
          });
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }
    else if (message.userVariables.current_mini_app == 'voice_changer') {
            // confirm ther is an attachment and the attachment is an audio and the user wants to convert speech to speech audio
            if (message.attachmentType && message.attachmentType == 'audio' && message.userVariables.speech2SpeechReq === 'true'){
              const voiceModel =  (message.userVariables.voiceModel === 'Tamara'? 'ZOtTHD5HJflREhTbZ7sc' :'H1JjD7OHmS3KIOu5PDkI')

              const audioContent = await axios.get(message.attachment.url, { responseType: 'arraybuffer' })
            
              const form = new FormData();
              form.append('audio', Buffer.from(audioContent.data, 'base64'), 'audio.mp3');

              const options = {
                method: 'POST',
                url: `https://api.elevenlabs.io/v1/speech-to-speech/${voiceModel}`,
                headers: {
                  accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
                  'content-type': 'multipart/form-data', // Set the content type to application/json.
                  // 'content-type': 'application/json', // Set the content type to application/json.
                  'xi-api-key': `${elevenLabsApiKey}`, // Set the API key in the headers.
                },
                // data: {
                //   audio: base64AudioData, // Pass in the inputText as the text to be converted to speech.
                // },
                data:form,
                responseType: 'arraybuffer', // Set the responseType to arraybuffer to receive binary data as response.
              };
            
              // Send the API request using Axios and wait for the response.
              const speechDetails = await axios.request(options);
            
              // Return the binary audio data received from the API response.
              console.log('done..1')
              // console.log(speechDetails.data)
              
              const audioBuffer = speechDetails.data;

              const newAudioUrl = await justUploadAudio(audioBuffer, storage,`text2Speech${Date.now()}`)
              console.log('newAudioUrl...:', newAudioUrl)




              // send fb media message ie: message of the dynamic picture generated!
          await messenger.sendFbMessage(BigInt(IGId), {
            type: 'media',
            mediaType: 'audio', //image,audio,video
            // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
            url: newAudioUrl
            // text: newAudioUrl
            })

            messenger.sendFlowToContact(sendPulseContactId,voiceChangerFlowId)
            await setContactSendPulseVariableByName(sendPulseContactId,'speech2SpeechReq' ,'false' )

            console.log('message sent! and variable set')

            }
            // Check for text to speech usecase

    }
    
  }

  function getAttachmentUrl(message) {
    if (message.attachment && message.attachment.url) {
      return message.attachment.url;
    } else if (message.userVariables.mathSolverImage){
      return message.userVariables.mathSolverImage;
    }
    return null;
  }
  module.exports = {AltAppsBot};