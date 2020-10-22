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

FROM node:12-alpine as builder

LABEL \
    vendor="ABSA" \
    copyright="2019 ABSA Group Limited" \
    license="Apache License, version 2.0" \
    name="Spline UI"

ENV PORT=7070

# Create app directory
WORKDIR /app
# Copy all files to the working dir.
COPY ./  /app
# Install the app dependencies
RUN cd /app && npm set progress=false && npm install
# Build the app
RUN npm run ng build -- --prod

# Install dependecies for the server
RUN cd /app/deployment/express && npm set progress=false && npm install

EXPOSE $PORT
# Run the server
CMD [ "node", "/app/deployment/express/server.js"]
