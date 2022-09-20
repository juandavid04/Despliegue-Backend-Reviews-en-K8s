# Dockerfile to build and server the Angular application
 

###############
### STAGE 1: Build app
###############
FROM node:16-alpine as build

WORKDIR /usr/local/app
# Add the source code to app
COPY ./ /usr/local/app/
# Install all the dependencies
RUN npm install
# Generate the build of the application
RUN npm run build

###############
### STAGE 2: Serve app with nginx ###
###############
FROM nginx:1.21.4-alpine
#Define las variables de ambiente
<<<<<<< HEAD
ENV CATALOG_URL=http://localhost:8081
=======
#ENV CATALOG_URL=http://localhost:8081

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
>>>>>>> 2c6ea4df2fe631283df8d00d962a1bf39fe9066a

COPY  --from=build /usr/local/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

<<<<<<< HEAD
=======
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

>>>>>>> 2c6ea4df2fe631283df8d00d962a1bf39fe9066a
# When the container starts, replace the env.js with values from environment variables
# CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.sample.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
 #CMD ["nginx" "-g" "daemon off;"]
 CMD ["nginx", "-g", "daemon off;"]