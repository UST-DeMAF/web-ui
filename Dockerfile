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

RUN apk upgrade --update-cache \
    && apk add --no-cache curl gettext nginx

WORKDIR /app

ENV CRON_SCHEDULE="*/5 * * * *"
ENV NODE_ENV=debug

# Copy files to the container
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

EXPOSE 80

# Copy entrypoint.sh to the container
COPY cleanup.js .
COPY cronjob.template .
COPY entrypoint.sh .
COPY nginx.template.conf /etc/nginx/nginx.template.conf
COPY server.js .

# Make the entrypoint.sh executable
RUN chmod +x entrypoint.sh

# Run the entrypoint.sh
CMD ["./entrypoint.sh"]