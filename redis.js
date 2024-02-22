const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient({
    password: `${process.env.PASSWORD}`,
    socket: {
        host: `${process.env.HOST}`,
        port: `${process.env.PORT}`
    }
});
redisClient.connect()

redisClient.on('error', err => console.log('Redis Client Error', err));
// Test the connection
redisClient.on('connect', () => {
    console.log('Connected to Redis');
    redisClient.set("IAM","CSB2")
    // console.log(redisClient)
});



module.exports = redisClient