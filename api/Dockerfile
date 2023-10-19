
# Set the default Node.js version to use
ARG NODE_VERSION=18

# Use the official Node.js image as the base image
FROM node:${NODE_VERSION}-alpine3.18

# Set the working directory for the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the current directory to the /node-app directory in the container
COPY . .

# Install PM2 globally
RUN npm install pm2 -g

# Expose the port that the application listens on.
EXPOSE 3001

# Run the application.
CMD ["pm2-runtime", "app.js"]
