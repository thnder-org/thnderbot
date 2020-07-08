FROM node:12-alpine

RUN apk --no-cache add --virtual \
      builds-deps \
      build-base \
      python 
    

RUN mkdir /node-log 

WORKDIR /app

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "start", "pm2-processes.json"]