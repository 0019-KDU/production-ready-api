FROM node:20-alpine3.16

# Set the working directory inside the container
WORKDIR /user/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code, environment files, and swagger
COPY ./src ./src
COPY .env .env
COPY swagger.yml swagger.yml


# Command to run your application
CMD ["npm", "run", "start"]
