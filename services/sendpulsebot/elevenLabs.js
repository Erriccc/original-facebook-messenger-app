const axios = require('axios');
const { BufferMemory } = require("langchain/memory");
const {Messenger} = require('./outBoundMessenger');
const { createClient } = require('@supabase/supabase-js')
const { justUploadAudio, justUploadImage, uploadImage, upsertUser,  createSwipe, findMatch, findUserByIgId, supabaseAuthEmailOrPhone } = require("../supabase")

  const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN; 
    const pageId = process.env.KCASSETS_INSTAGRAM_PAGE_ID
    const flowId = '65ba0b35310fc3cef108b641'
    // const flowId = '65aaffafbe3d70f3e401e33d'

const sendPluseClientId = process.env.SEND_PULSE_CLIENT_ID;
const sendPulseClientSecret = process.env.SEND_PULSE_CLIENT_SECRET;
const xiApiKey = process.env.ELEVEN_LABS_API_KEY



  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  const storage = supabase.storage


    const speech2speech = async (redis,req, res) => {

      const getAccessToken = async () => {
        const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
          grant_type: 'client_credentials',
          client_id: sendPluseClientId,
          client_secret: sendPulseClientSecret
        });
      
        return response.data.access_token; 
      }
    
      
    


      console.log('req.body-------------------------------------------')
      console.log(req.body)






      const accessToken = await getAccessToken();
      const messenger = new Messenger(fbAccessToken, pageId, accessToken);

        // use sendpulse to send a flow of messages to the user
        messenger.sendFlowToContact(sendPulseContactId,flowId,{followUp:'@mathAi'})
        console.log('message sent!')

          res.status(200).json(
            {response}
          );

    };













    
    const text2speech = async (redis,req, res) => {


      const getAccessToken = async () => {
        const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
          grant_type: 'client_credentials',
          client_id: sendPluseClientId,
          client_secret: sendPulseClientSecret
        });
      
        return response.data.access_token; 
      }
    
     
    


      console.log('req.body-------------------------------------------')
      console.log(req.body)
      
      const followUpQuestion = req.body.followUpQuestion

      const sendPulseContactId = req.body.contactId
      // const voiceModel =  (req.body.voiceModel === 'Tamara'? 'ZOtTHD5HJflREhTbZ7sc' : req.body.voiceModel === 'Kim Selch'? 'H1JjD7OHmS3KIOu5PDkI': 'H1JjD7OHmS3KIOu5PDkI')
      const voiceModel =  (req.body.voiceModel === 'Tamara'? 'ZOtTHD5HJflREhTbZ7sc' :'H1JjD7OHmS3KIOu5PDkI')

      const text2SpeechText =  req.body.text2SpeechText
      const channellId = req.body.channellId







        const options = {
            method: 'POST',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceModel}`,
            headers: {
              accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
              'content-type': 'application/json', // Set the content type to application/json.
              'xi-api-key': `${xiApiKey}`, // Set the API key in the headers.
            },
            data: {
              text: text2SpeechText, // Pass in the inputText as the text to be converted to speech.
            },
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
    



      const accessToken = await getAccessToken();

      const messenger = new Messenger(fbAccessToken, pageId, accessToken);




      // send fb media message ie: message of the dynamic picture generated!
      await messenger.sendFbMessage(BigInt(channellId), {
        type: 'media',
        mediaType: 'audio', //image,audio,video
        // filetypes--- Audio: acc, m4a, wav, mp4 Max(25MB) Image: png, jpeg, gif Max(8MB) Video: 	mp4, ogg, avi, mov, webm Max(25MB)
        url: newAudioUrl
        })



        // use sendpulse to send a flow of messages to the user
        messenger.sendPulseMessage(sendPulseContactId,{
          mediaType:"Audio",
          type:'text',
          text: newAudioUrl
        })
        // messenger.sendFlowToContact(sendPulseContactId,flowId,{followUp:'@mathAi'})
        console.log('message sent!')

      // { 
      //   "name": "{{first_name}}", 
      //   "contactId": "{{contact_id}}",
      //   "voiceModel": "{{voiceModel}}",
      //   "text2SpeechText": "{{text2SpeechText}}"
      //   }
          res.status(200).json(
            {newAudioUrl}
          );

    };
    module.exports = {text2speech,speech2speech};