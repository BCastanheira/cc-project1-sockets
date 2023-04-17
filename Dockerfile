FROM node:latest

WORKDIR /usr/app

# Set argument to receive url in buildtime or to use default value
ARG API_URI_ARG=localhost

# Pass argument as environment variable for container
ENV API_URI=${API_URI_ARG}

COPY package.json .
RUN npm install

COPY index.js .

ENTRYPOINT ["node", "index.js"]