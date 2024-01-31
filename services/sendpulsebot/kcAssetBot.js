const axios = require('axios');
const {Messenger} = require('./outBoundMessenger');


const kcAssetBot = async (message, sendPulseAccessToken) => {
    const IGId = message.contact.channelId;
    const sendPulseContactId = message.contact.sendPulseId;
    const fbAccessToken = process.env.KCASSETS_INSTAGRAM_ACCESS_TOKEN2; 
    const pageId = process.env.KCASSETS_INSTAGRAM_PAGE_ID
    
    const messenger = new Messenger(fbAccessToken, pageId, sendPulseAccessToken);

    
  }


  module.exports = {kcAssetBot};