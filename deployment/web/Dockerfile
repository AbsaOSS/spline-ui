#
# Copyright 2020 ABSA Group Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
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

FROM tomcat:9-jre11-openjdk-slim-buster

LABEL \
    vendor="ABSA" \
    copyright="2020 ABSA Group Limited" \
    license="Apache License, version 2.0" \
    name="Spline Web UI"

EXPOSE 8080
EXPOSE 8009

RUN chgrp 1001 /usr/local/tomcat/conf /usr/local/tomcat/webapps
RUN chmod g+w /usr/local/tomcat/conf /usr/local/tomcat/webapps

COPY --chown=1001 target/*.war /usr/local/tomcat/webapps/ROOT.war
RUN chmod a-w /usr/local/tomcat/webapps/ROOT.war

USER 1001:1001
