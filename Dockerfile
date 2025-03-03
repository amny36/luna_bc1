# Use official Node.js image as a base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app is running on (default is 3000 for Express)
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"]
