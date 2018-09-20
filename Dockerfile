FROM ubuntu:trusty
MAINTAINER zied karoui <zied.kroui@ooredoo.com>

# Prevent dpkg errors
ENV TERM=xterm-256color

# Set mirrors to NZ
# RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list 

# Install node.js
RUN apt-get update && \
    apt-get install curl -y && \
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && \
    apt-get install -y nodejs 

# cope du ficker courant dans /app dans l'image 
COPY . /app 
WORKDIR /app

# Install application dependencies
RUN npm install -g mocha && \
    npm install

# Set mocha test runner as entrypoint
ENTRYPOINT ["mocha"]
