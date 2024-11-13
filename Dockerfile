# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Define build arguments and environment variables
ARG NEXT_PUBLIC_BASE_WEB_URL
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_GUMLET_API_URL
ARG NEXT_PUBLIC_API_URL_VERSION
ARG NEXT_PUBLIC_GOOGLE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FACEBOOK_SDK_KEY
ARG NEXT_PUBLIC_MQQT_SOCKET_URL
ARG NEXT_PUBLIC_MQTT_USER
ARG NEXT_PUBLIC_MQTT_PASSWORD
ARG NEXT_PUBLIC_MQTT_WEBSOCKET_PORT
ARG NEXT_PUBLIC_SERVER_PORT
ARG NEXT_PUBLIC_ANALYTICS_ID
ARG NEXT_PUBLIC_STRAPI_BASE_URL
ARG NEXT_PUBLIC_STRAPI_BASE_API_URL

ENV NEXT_PUBLIC_BASE_WEB_URL=${NEXT_PUBLIC_BASE_WEB_URL}
ENV NEXT_PUBLIC_BASE_API_URL=${NEXT_PUBLIC_BASE_API_URL}
ENV NEXT_PUBLIC_GUMLET_API_URL=${NEXT_PUBLIC_GUMLET_API_URL}
ENV NEXT_PUBLIC_API_URL_VERSION=${NEXT_PUBLIC_API_URL_VERSION}
ENV NEXT_PUBLIC_GOOGLE_API_KEY=${NEXT_PUBLIC_GOOGLE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID}
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
ENV NEXT_PUBLIC_FACEBOOK_SDK_KEY=${NEXT_PUBLIC_FACEBOOK_SDK_KEY}
ENV NEXT_PUBLIC_MQQT_SOCKET_URL=${NEXT_PUBLIC_MQQT_SOCKET_URL}
ENV NEXT_PUBLIC_MQTT_USER=${NEXT_PUBLIC_MQTT_USER}
ENV NEXT_PUBLIC_MQTT_PASSWORD=${NEXT_PUBLIC_MQTT_PASSWORD}
ENV NEXT_PUBLIC_MQTT_WEBSOCKET_PORT=${NEXT_PUBLIC_MQTT_WEBSOCKET_PORT}
ENV NEXT_PUBLIC_SERVER_PORT=${NEXT_PUBLIC_SERVER_PORT}
ENV NEXT_PUBLIC_ANALYTICS_ID=${NEXT_PUBLIC_ANALYTICS_ID}
ENV NEXT_PUBLIC_STRAPI_BASE_URL=${NEXT_PUBLIC_STRAPI_BASE_URL}
ENV NEXT_PUBLIC_STRAPI_BASE_API_URL=${NEXT_PUBLIC_STRAPI_BASE_API_URL}

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
