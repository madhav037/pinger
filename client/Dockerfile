# Use an official Node image to build the frontend
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the built app using a lightweight web server (e.g., serve)
FROM node:16-alpine
RUN npm install -g serve
WORKDIR /app
# Copy the build artifacts from the build stage (default output is 'dist')
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
