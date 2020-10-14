# STEP 1 build static website
FROM node:12-alpine as builder
#RUN apk update && apk add --no-cache make git
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package.json package-lock.json  /app/
RUN cd /app && npm set progress=false && npm install
# Copy project files into the docker image
COPY .  /app
RUN cd /app && npm run ng build -- --prod

# STEP 2 build a small nginx image with static website
FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' copy website to default nginx public folder
COPY --from=builder /app/spline-ui /usr/share/nginx/html
RUN mv /usr/share/nginx/html/assets/config.localhost.json /usr/share/nginx/html/assets/config.json
COPY ./config/nginx.conf /etc/nginx/nginx.conf
EXPOSE 7070
CMD ["nginx", "-g", "daemon off;"]
