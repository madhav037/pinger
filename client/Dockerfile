# Use an official Node.js image to build the Next.js app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Use the official Node.js image again to run the app
FROM node:18 AS production

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app ./

# Expose the Next.js port (default is 3000)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
