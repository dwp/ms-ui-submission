ARG NODE_VERSION
ARG PORT

FROM node:${NODE_VERSION} AS builder
ENV PORT=${PORT}
ARG GITLAB_REGISTRY_TOKEN
RUN apk add --update --no-cache git=2.45.2-r0\
     make=4.4.1-r2 \
     build-base=0.5-r3 \
     python3=3.12.3-r2 \
     py3-pip=24.0-r2

COPY app/ /app/
COPY src/ /src/
COPY assets/ /assets/
COPY dist/ /dist/
COPY package.json /
COPY gulpfile.js /
COPY security.txt /
COPY .npmrc /
RUN npm install
RUN npm run build \
    && npm prune --production

FROM node:${NODE_VERSION}
RUN set -xe && \
  apk --no-cache update && \
  apk --no-cache upgrade && \
  apk add gnutls --no-cache && \
  rm -rf /var/cache/apk/*
RUN mkdir -p /static
COPY --from=builder /app/ /app/
COPY --from=builder /src/ /src/
COPY --from=builder /assets/ /assets/
COPY --from=builder /dist/ /dist/
COPY --from=builder /node_modules/ /node_modules/
COPY --from=builder package.json /
COPY --from=builder gulpfile.js /
COPY --from=builder security.txt /
EXPOSE ${PORT}
CMD ["npm", "start"]
