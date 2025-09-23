## Demo: Create a Node Server managed by Docker

This demo shows how to create a simple Node.js server with **Express**, containerize it with **Docker**, and run it locally.

#### 1. Create a `package.json` file

```json
{
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

#### 2. Create a simple `index.js` file

```js
const express = require('express');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

#### 3. Create a `Dockerfile`

```dockerfile
# Use the node 18-alpine version
FROM node:18-alpine

# Set your work directory inside the node container 
# (the place where you will will build your files)
WORKDIR /usr/app

# Copy the package.json file to inside the container
COPY package.json package-lock.json ./

# Restore the dependencies
RUN npm ci --omit=dev

# Copy all the other files to inside the container
COPY ./ ./ 

# Expose the port 8080
EXPOSE 8080

# Run npm start
CMD ["npm", "start"]
```

#### 4. Build your container

```sh
  docker build -t pedropadilhaportella/simpleweb .
```

#### 5. Run the Container

```sh
  docker run -p 8080:8080 pedropadilhaportella/simpleweb
```

You also can run and access the container in the bash to see the files:
```sh
  docker run -it pedropadilhaportella/simpleweb sh
```

#### 6. Access it from the Browser

Visit: `http://localhost:8080`. You will see a pretty hello world message.