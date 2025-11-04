# Use the official Node.js runtime as the base image
FROM node:22 as build
# ENV NODE_ENV production

##ARG REACT_APP_ENV
##ENV REACT_APP_ENV qa

# Define a build argument for REACT_APP_ENV
ARG REACT_APP_ENV=prod
ARG SENTRY_AUTH_TOKEN

# Set REACT_APP_ENV environment variable
ENV REACT_APP_ENV $REACT_APP_ENV
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire application code to the container
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the React app for production
RUN npm run build

# Use Nginx as the production server
FROM nginx:stable-alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
