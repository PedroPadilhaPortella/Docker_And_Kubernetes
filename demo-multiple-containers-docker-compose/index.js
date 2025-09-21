const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const port = 8081;

// Create Redis client pointing to docker-compose service name
const client = redis.createClient({
  url: 'redis://redis-server:6379'
});

(async () => {
    await client.connect();
    client.set('visits', 0);
})();


app.get('/', async (req, res) => {
  let visits = await client.get('visits');
  res.send('Number of visits is: ' + visits);
  await client.set('visits', parseInt(visits) + 1);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});