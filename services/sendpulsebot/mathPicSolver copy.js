const axios = require('axios');
const {ChatOpenAI} = require("@langchain/openai");
const {PromptTemplate} = require("@langchain/core/prompts");
const { HumanMessage,SystemMessage,AIMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {RunnableLambda,RunnableMap,RunnablePassthrough,RunnableSequence} = require ("@langchain/core/runnables");
const { createCanvas, loadImage } = require('canvas')
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

          return await this.chain.invoke([imagePrompt]);
        }

      }




  const gptVissionWrraper = async (imageUrl, promptText) => {
    console.log('sending req to openai')
    const aiResponse = new AIResponse();
    const response = await aiResponse.getAIResponse(imageUrl, promptText);
    // console.log(response)
    return response
  
}

const gptVissionWrraperImageOutput = async (aiSolution) => {
  console.log('sending req to openai gptVissionWrraperImageOutput')

      const width = 630
    const height = 1200
    const canvas = createCanvas(width, height)

const context = canvas.getContext('2d')

// Fill the background
context.fillStyle = '#000'
context.fillRect(0, 0, canvas.width, canvas.height)

// Set the font properties
context.font = '20px Arial' // Adjust the font size for better visibility on mobile
context.textAlign = 'left'
context.textBaseline = 'top'
context.fillStyle = '#fff'

    // Define the text
    const problemText = 
    `Problem: Mr. Hansraj needs to pack 7924 boxes 
    into perfect squares. Find the least number of 
    additional boxes he needs to purchase.`
    const solutionText = `Solution: 
    1- 
    Find the square root of 7924: √7924 ≈ 89 (rounded down to the nearest integer) 
    2- 
    Check the next perfect square: 89^2 = 7921. Since 7921 is less than 7924, 
    we need to consider the next higher perfect square. 
    3- 
    Next perfect square: 90^2 = 8100 4- Calculate the difference: 8100 - 7924 = 176`
    const answerText = 'Answer: Mr. Hansraj needs 176 more boxes to create perfect squares.'

// Draw the text on the canvas
context.fillText(problemText, 10, 10)
context.fillText(solutionText, 10, 50)
context.fillText(answerText, 10, 90)
  
    const dataUrl = canvas.toDataURL('image/png')
      return dataUrl

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
        
      const aiResponse = new AIResponse();
      const response = await aiResponse.getAIResponse(
        req.body.imageUrl, 
        "You are a problem solving expert, can you solve the problem in the image above while showing step by step solutions?"
      );
      // console.log(response)

          res.status(200).json([
            {fourpics:response},
          ]);

    };

    module.exports = {mathPicSolver, gptVissionWrraper,gptVissionWrraperImageOutput};