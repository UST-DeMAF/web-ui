FROM node:lts-alpine AS build

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy rest of the files
COPY . .

# Build the project
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV=debug

# Copy server.cjs to the container
COPY --from=build /app/dist dist
COPY --from=build /app/server.cjs .
COPY --from=build /app/node_modules node_modules

RUN npm install -g http-server

EXPOSE 8079
EXPOSE 3000

# Start both the frontend and the backend server
CMD ["sh", "-c", "http-server dist -p 8079 & node server.cjs"]
