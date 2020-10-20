#
# Copyright 2020 ABSA Group Limited
#
# Licensed under the Apache License, Version 2.0 (the "License")
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#LABEL \
#    vendor="ABSA" \
#    copyright="2019 ABSA Group Limited" \
#    license="Apache License, version 2.0" \
#    name="Spline UI"

# STEP 1 :: build the app
FROM node:12-alpine as builder
# Create app directory
WORKDIR /app
# Install app dependencies
COPY ./  /app
RUN cd /app && npm set progress=false && npm install
# Copy project files into the docker image
RUN npm run ng build -- --prod

# STEP 2 :: build a small nginx image with static website
FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' copy website to default nginx public folder
COPY --from=builder /app/dist/spline-ui /usr/share/nginx/html
RUN mv /usr/share/nginx/html/assets/config.localhost.json /usr/share/nginx/html/assets/config.json
COPY  ./deployment/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 7070
CMD ["nginx", "-g", "daemon off;"]
