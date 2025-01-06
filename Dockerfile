# stage1 as builder
FROM node:lts-alpine AS build-stage

# Set the log level
ENV LOG_LEVEL=debug

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy the package.json and install dependencies
COPY package*.json ./
RUN rm -rf node_modules # package-lock.json
RUN npm cache clean --force
#RUN npm install
RUN npm ci && echo "npm install completed"

# Copy rest of the files
COPY . .

# Build the project
RUN npm run build && echo "npm run build completed"

EXPOSE 8080
CMD [ "http-server", "dist" ]
