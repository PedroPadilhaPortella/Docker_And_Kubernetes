# [Docker and Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/)

### Udemy course by [Stephen Grider](https://www.linkedin.com/in/stephengrider/)

### Summary
- Docker
  - [Manipulating Containers with the Docker Client](#manipulating-containers-with-the-docker-client)
  - [Building Custom Images Through Docker Server](#building-custom-images-through-docker-server)
  - [Demo: Create a Node Server managed by Docker](#demo-create-a-node-server-managed-by-docker)
  - [Demo: Manage Multiple Containers with Docker Compose](#demo-manage-multiple-containers-with-docker-compose)
  - [Demo: Create a Workflow with Docker, Github, Travis and AWS](#demo-create-a-workflow-with-docker-github-travis-and-aws)
- Kubernetes

## Container Lifecycle
![Container Lifecycle](./container-lifecycle.jpg)

## Manipulating Containers with the Docker Client

Here is some of the basic commands we use in Docker.  
Always use as a base the [Docker Documentation](https://docs.docker.com/).

```bash
  # Run a container (download image, create and start if not exists)
  docker run <image-name> <extra-command>
  #Example
  docker run busybox echo hi there

  # Start an already created container
  docker start <image-name>
  #Example
  docker start busybox

  # List running containers
  docker ps

  # List all created containers
  docker ps -a

  # List containers and show their size
  docker ps -s

  # List running containers (full command)
  docker container ls

  # List containers (full command)
  docker container ls -a

  # Show logs from a specific container
  docker logs <container-id>

  # Stop a container
  docker stop <container-id>

  # Kill a container
  docker kill <container-id>

  # Pause a container
  docker pause <container-id>

  # Unpause a container
  docker unpause <container-id>

  # Remove a container
  docker rm <container-id>
  
  # List images
  docker images

  # Remover a specific image
  docker image rm <image-id>

  # Stop all the containers (using a chained command to list all the containers)
  docker stop $(docker container ls -q)

  # Remove all the containers (using a chained command to list all the containers)
  docker container rm $(docker container ls -aq)

  # Remove all the images (using a chained command to list all the images)
  docker rmi $(docker image ls -aq) --force

  # Remove all containers and images
  docker system prune
```

### Demo: Working with Redis Database in Docker

In this demo, we will learn how to quickly set up and interact with a **Redis database** using Docker.  
Redis is an in-memory key-value store widely used for caching, session management, and real-time data processing.  
With Docker, you can spin up a Redis instance in seconds without needing to install it directly on your machine.

```bash
  # Create and run a redis image container
  docker run redis

  # In another terminal, get the redis container id
  docker ps

  # them execute the container on interactive mode (attach the terminal as STDIN process into the container) with the redis-cli command
  docker exec -it <container-id> redis-cli

  # Access the container in interative mode with a bash
  docker exec -it <container-id> sh

  # A better way to create the container in interative mode with a bash
  docker run -it redis sh
```

## Building Custom Images Through Docker Server

In this demo, we will learn how to build **custom Docker images** from scratch instead of relying only on pre-built ones from Docker Hub.  
By creating a `Dockerfile`, you can define the base image, install dependencies, and configure how the container should behave when it starts.  

1. Create a Dockerfile

```dockerfile
# Use and docker image as a base
FROM alpine:latest

# Download and install dependencies
RUN apk add --update redis

RUN apk add --update gcc

# Configure what to do and when to start the container
CMD ["redis-server"]
```

2. Execute `docker build pedropadilhaportella/redis:latest .` to generate an image with a specific tag.

3. Execute `docker run pedropadilhaportella/redis` to run the image you generated.

If you forget to set a tag, ou can add it later by executing:

```bash
  docker tag <container-id> pedropadilhaportella/redis:latest
```

Also you can create an image from a specific container by executing:

```bash
  docker commit -c "CMD ['redis-server']" <container-id>
```


## Demo: Create a Node Server managed by Docker

This demo shows how to create a simple Node.js server with **Express**, containerize it with **Docker**, and run it locally. You can see all the files [here](https://github.com/PedroPadilhaPortella/Docker_And_Kubernetes/tree/main/demo-node-server-docker).

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

## Demo: Manage Multiple Containers with Docker Compose

This demo shows how to create a Node.js server with Express, connect it to Redis, and run everything using Docker Compose. You can see all the files [here](https://github.com/PedroPadilhaPortella/Docker_And_Kubernetes/tree/main/demo-multiple-containers-docker-compose).

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


## Demo: Create a Workflow with Docker, Github, Travis and AWS

This demo shows how to build and deploy a React application into AWS using Docker and Docker Compose, while setting up CI/CD pipelines with both GitHub Actions and Travis CI.  You can see all the files [here](https://github.com/PedroPadilhaPortella/Docker_And_Kubernetes/tree/main/demo-docker-react).

### 1: Create a React project using create-react-app.

### 2: Create a Dockerfile.dev to run the react application.

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
```

### 3: Create a docker-compose.yml file to run the react application locally.

```yml
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - /app/node_modules
      - .:/app
  frontend-tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm", "run", "test"]
```

### 4: Run the application locally using Docker

```sh
docker compose up -d
```

The command below will run the application locally, refering the files from the container to the files locally, except the node_modules, so any change you do, it will hot reloaded the application.

```sh
docker run -p 3000:3000 -v /app/node_modules -v "$(PWD):/app" pedropadilhaportella/frontend
```

To run the tests locally, you can use the command below:

```sh
docker run -it pedropadilhaportella/frontend npm run test
```

> Note: if you have a differente Dockerfile, you can build as below:
`docker build -f Dockerfile.dev -t pedropadilhaportella/frontend .`

### 5: Create a Github GitHub Action workflow

Set up a GitHub Action workflow by creating a file `.github/workflows/deploy.yaml`. 

```yml
name: Deploy Frontend
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
      - run: docker build -t pedropadilhaportella/docker-react -f Dockerfile.dev .
      - run: docker run -e CI=true pedropadilhaportella/docker-react npm test
      - name: Generate deployment package
        run: zip -r deploy.zip . -x '*.git*'
      - name: Deploy to Elastic beanstalk
        uses: einaregilsson/beanstalk-deploy@v18
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY }}
          aws_secret_key: ${{ secrets.AWS_SECRET_KEY }}
          application_name: docker-gh
          environment_name: Dockergh-env
          existing_bucket_name: elasticbeanstalk-us-east-1-923445559289
          region: us-east-1
          version_label: ${{ github.sha }}
          deployment_package: deploy.zip

```
Alternatively you can use TravisCI and create a .travis.yml file.


### 6: Elastic Beanstalk Setup and Configuration to deploy on AWS

In your AWS account, you must configure Elastic Beanstalk, you can follow this tutorial: [Elastic Beanstalk Setup and Configuration](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/41614578#questions).

Each time you push on main, your application will automatically be deployed on AWS Elastic Beanstalk.

## Demo: Build a Multi-Container Application

You can see all the files [here]().