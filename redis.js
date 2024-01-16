// import { Redis } from '@upstash/redis'

 const redisClient = async () => {
    const { Redis } = await import('@upstash/redis');
    

        const client = new Redis({
        url: process.env.UPSTASH_URL,
        token: process.env.UPSTASH_TOKEN})


    return client
//     return new Redis({
//     url: process.env.UPSTASH_URL,
//     token: process.env.UPSTASH_TOKEN,
// })

}
// const redis = (async () => {return await redisClient()})();

module.exports = { redisClient };