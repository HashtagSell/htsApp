FROM hashtagsell/ubuntu-node-hashtagsell:v0.10
MAINTAINER Joshua Thomas <joshua.thomas@hashtagsell.com>

# Global dependencies
USER root
RUN sudo apt-get install imagemagick subversion -y
RUN sudo npm install -g bower && sudo npm install -g grunt-cli
USER hashtagsell

# NPM install
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /home/hashtagsell/hts-app && cp -a /tmp/node_modules /home/hashtagsell/hts-app

# Copy code
WORKDIR /home/hashtagsell/hts-app
COPY . /home/hashtagsell/hts-app
RUN npm install && bower install

USER root
RUN chmod -R 777 /home/hashtagsell/hts-app/tmp/
USER hashtagsell

EXPOSE 8081
