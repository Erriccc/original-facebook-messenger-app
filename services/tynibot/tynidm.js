const axios = require('axios');
const {ChatOpenAI} = require("@langchain/openai");
const {ConversationChain} = require("langchain/chains");
const {ZepMemory} = require("@langchain/community/memory/zep");

const tynidm = async (req, res) => {
   
  
    const { first_name,id } = req.body;

    console.log('gothere..')
    console.log('first_name',id)
    console.log('first_name',typeof id)
    
  const sessionId = first_name
  const zepURL = "https://mintchi-zep.up.railway.app";

  const memory = new ZepMemory({
    sessionId,
    baseURL: zepURL,
    // This is optional. If you've enabled JWT authentication on your Zep server, you can
    // pass it in here. See https://docs.getzep.com/deployment/auth
    apiKey: "change_this_key",
  });
  
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.envOPEN_AI_API_KEY
  });
  

  const chain = new ConversationChain({ llm: model, memory });
console.log("Memory Keys:", memory.memoryKeys);

const res1 = await chain.call({ input: "Hi! I'm Jim." });
console.log('res1 is the response from gpt',{ res1 });

    res.status(200).json({yoo:'yooooo'});
  };
  
  module.exports = tynidm;
  
