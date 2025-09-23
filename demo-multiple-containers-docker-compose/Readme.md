## Demo: Manage Multiple Containers with Docker Compose

This demo shows how to create a Node.js server with Express, connect it to Redis, and run everything using Docker Compose.

#### 1. Create a `package.json` file

```json
{
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^5.1.0",
    "redis": "^4.7.1"
  }
}
```

#### 2. Create a simple `index.js` file that will register each time a someone visit the webpage in the redis database: 

```javascript
const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();
const port = 8081;

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
```

#### 3. Create a `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]

```

#### 4. Create a `docker-compose` file:

```yml
services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - '8081:8081'
    depends_on:
      - redis-server
    restart: on-failure
```

#### 5. Build and start the containers using the docker-compose CLI commands:

```bash
  # Building the container based on your docker-compose file
  docker-compose up --build

  # in detached mode
  docker-compose up -d
```

```bash
  # stop the containers
 docker-compose down
```

#### 6. Access it from the Browser

Visit: http://localhost:8081
You will see the counter increasing every time you refresh:

Number of visits is: 0  
Number of visits is: 1  
Number of visits is: 2...