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

      res.status(200).json([
        {fourpics:aiStringResponse},
      ]);

};

const getAIResponse = async (imageUrl, promptText) => {

  const template = PromptTemplate.fromTemplate(promptText);
  
  const imagePrompt = HumanMessage({
    content: [
      {type: "text", text: template}, 
      {type: "image_url", image_url: imageUrl}
    ]
  });

  const stringParser = new StringOutputParser();

  const chain = RunnableSequence.from([model, stringParser]);

  return await chain.invoke([imagePrompt]);
}

module.exports = {mathPicSolver, getAIResponse};