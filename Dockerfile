FROM hashtagsell/ubuntu-node-hashtagsell:v0.10
MAINTAINER Joshua Thomas <joshua.thomas@hashtagsell.com>

USER root
RUN sudo npm install bower -g
USER hashtagsell

RUN mkdir -p /home/hashtagsell/hts-app
WORKDIR /home/hashtagsell/hts-app
COPY . /home/hashtagsell/hts-app
RUN npm install

EXPOSE 8081
CMD ["grunt"]
