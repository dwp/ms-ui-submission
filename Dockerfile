ARG NODE_VERSION
ARG PORT
FROM node:${NODE_VERSION} AS builder

RUN apk --no-cache update
ENV PORT=${PORT}
COPY app/ /app/
COPY package.json .
COPY gulpfile.js .
COPY .npmrc .
RUN npm install --production

FROM node:${NODE_VERSION}
RUN set -xe && \
  apk --no-cache update && \
  apk --no-cache upgrade && \
  apk add gnutls --no-cache && \
  rm -rf /var/cache/apk/*
RUN mkdir -p /static
COPY --from=builder /app/ /app/
COPY --from=builder /node_modules/ /node_modules/
COPY --from=builder package.json .
COPY --from=builder gulpfile.js .
EXPOSE ${PORT}
CMD ["npm", "start"]
