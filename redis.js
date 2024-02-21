const redis = require('redis');
const redisClient = redis.createClient({
    password: 'ILbePY6lB0p7i1hPJdcZhB4a2fl250Pk',
    socket: {
        host: 'redis-19683.c323.us-east-1-2.ec2.cloud.redislabs.com',
        port: 19683
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