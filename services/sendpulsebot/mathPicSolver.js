const axios = require('axios');
const {ChatOpenAI} = require("@langchain/openai");
const {PromptTemplate} = require("@langchain/core/prompts");
const { HumanMessage,SystemMessage,AIMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {RunnableLambda,RunnableMap,RunnablePassthrough,RunnableSequence} = require ("@langchain/core/runnables");
const { createCanvas, loadImage } = require('canvas')
const { generate } = require("text-to-image");
const {LLMChain} = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");

const sendPluseClientId = process.env.SEND_PULSE_CLIENT_ID;
const sendPulseClientSecret = process.env.SEND_PULSE_CLIENT_SECRET;





class AIResponse {

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4-vision-preview",
    // temperature: 0,
      maxTokens: 1024, 
      openAIApiKey: process.env.OPEN_AI_API_KEY
    });

    this.stringParser = new StringOutputParser();
    // this.PromptTemplate = new PromptTemplate();
    // this.HumanMessage = new HumanMessage();

    // this.chain = this.model;
    this.chain = RunnableSequence.from([this.model, this.stringParser]);
    // this.upstashRedisChatMessageHistory = UpstashRedisChatMessageHistory;
  }

        async getAIResponse(imageUrl, promptText) {
          // const template = PromptTemplate.fromTemplate(promptText);
          const imagePrompt = new HumanMessage({
            content: [
              {type: "text", text: promptText},
              {type: "image_url", image_url: imageUrl}
            ]
          });

          return await this.model.invoke([imagePrompt]);
          // return await this.chain.invoke([imagePrompt]);
        }

      }




  const gptVissionWrraper = async (imageUrl, promptText) => {
    console.log('sending req to openai')
    const aiResponse = new AIResponse();
    const response = await aiResponse.getAIResponse(imageUrl, promptText);
    // console.log(response)
    return response
  
}

const generateImageOutput = async (aiSolution) => {
  console.log('sending req to openai generateImageOutput')
    // const uri = await generate(`${problemText} \n \n ${solutionText} \n \n ${answerText}`, {})
    const uri = await generate(`${aiSolution}`, {
      maxWidth: 720,
      fontSize: 30,
      fontPath: 'services/sendpulsebot/Open_Sans/static/OpenSans-Regular.ttf', 
      fontFamily: 'Open Sans',
      // fontFamily: 'Arial',
      lineHeight: 50,
      margin: 80,
      bgColor: 'black',
      textColor: 'white',
    })
      return uri

}



    const mathPicSolver = async (redis,req, res) => {

      const {UpstashRedisChatMessageHistory} = await import("@langchain/community/stores/message/upstash_redis");
      const upStashMemory = new BufferMemory({
        chatHistory: new UpstashRedisChatMessageHistory({
          sessionId: req.body.name,
          // sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
          memoryKey: "history",
          client:await redis()
        }),
      });

      console.log('req.body-------------------------------------------')
      console.log(req.body)
      console.log(req.body.imageUrl)
      const followUpQuestion = req.body.followUpQuestion
        
      const aiResponse = new AIResponse();
      const response = await aiResponse.getAIResponse(
        req.body.imageUrl, 
        ` You are a problem solving expert, 
        the user is asking questions that could be related or unrelated to the attached picture.
        your job is to determine if the question is related to the image, and use that context to answer the question accordingly.
        follow up question: ${followUpQuestion}
        please make sure your response only answers to the follow up question
        
        `
      );
      // console.log(response)

          res.status(200).json(
            {response}
          );

    };

    module.exports = {mathPicSolver, gptVissionWrraper,generateImageOutput};