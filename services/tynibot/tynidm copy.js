const axios = require('axios');
const {ChatOpenAI} = require("@langchain/openai");
const {PromptTemplate} = require("@langchain/core/prompts");
const {ConversationChain, LLMChain} = require("langchain/chains");

const {ZepMemory} = require("@langchain/community/memory/zep");

const tynidm = async (req, res) => {
    const { first_name,id, last_input_text, page_id } = req.body;

    console.log('gothere..')
    console.log('first_name',id)
    console.log('first_name',typeof id)
    // console.log(req.body)
    
  // const sessionId = page_id? page_id : first_name
  const sessionId = first_name
  const zepURL = "https://mintchi-zep.up.railway.app";

  
  
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.env.OPEN_AI_API_KEY
  });
  


      const template = `You are a nice chatbot having a conversation with a human.

    Previous conversation:
    {history}

    New human question: {question}
    Response:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const memory = new ZepMemory({
      sessionId,
      baseURL: zepURL,
      // This is optional. If you've enabled JWT authentication on your Zep server, you can
      // pass it in here. See https://docs.getzep.com/deployment/auth
      apiKey: "change_this_key",
      memoryKeys: "history"
    });

    const conversationChain = new LLMChain({
      llm:model,
      prompt,
      // verbose: true,
      memory,
    });
const llmresponse = await conversationChain.invoke({ question: `${last_input_text ? last_input_text : defaultDmMessage}` });
console.log(llmresponse)
    res.status(200).json({gptResponse:llmresponse});
  };
  
  module.exports = tynidm;
  
