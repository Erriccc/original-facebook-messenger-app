# Use an official Node.js 16 runtime as the base image
FROM node:21

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Install fontconfig
RUN apt-get update && apt-get install -y fontconfig

# Copy the current directory contents into the container at /app
COPY . .

# Make port 80 available to the world outside this container
# Note: it may be not needed for your specific setup
EXPOSE 80

# Run the build command
RUN npm run start

# Specify the start command
CMD [ "npm", "run", "start:prod" ]
