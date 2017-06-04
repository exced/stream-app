FROM node:8.0

RUN mkdir /stream-backend/
ADD package.json /stream-backend/
ADD /bin /stream-backend/

RUN cd /stream-backend && npm install

EXPOSE 3000
EXPOSE 9000

ENTRYPOINT cd /stream-backend && npm install && ./bin/www