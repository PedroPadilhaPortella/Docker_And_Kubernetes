const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

function fibonacci(index) {
    if (index < 2) return 1;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

redisPublisher.on('message', (channel, message) => {
    console.log('Received message:', message);
    const result = fibonacci(parseInt(message));
    redisClient.hset('values', message, result);
});