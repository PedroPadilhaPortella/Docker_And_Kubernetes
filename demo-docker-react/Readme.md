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