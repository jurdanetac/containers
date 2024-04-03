FROM node:20

WORKDIR /usr/src/app

ENV DEBUG=backend:*
ENV NODE_ENV=production

COPY --chown=node:node . .

RUN npm ci

USER node
CMD npm start
