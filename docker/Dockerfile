# syntax=docker/dockerfile:1.4

ARG NODE_VERSION=24-alpine3.21

# --- Development stage --------------------------------------------------------
FROM node:${NODE_VERSION} AS dev

ARG HOST=0.0.0.0
ARG PORT=3000

WORKDIR /srv/app

ENV HOST=$HOST \
    PORT=$PORT

# Install dependencies using only the manifest to leverage Docker cache
COPY app/package.json ./

RUN rm -f package-lock.json \
    && npm install

# Copy the rest of the project (configs + sources)
COPY app/ ./

ENV PATH=/srv/app/node_modules/.bin:$PATH

EXPOSE $PORT

# Ensure deps are installed when bind-mount hides prebuilt node_modules
CMD ["sh", "-lc", "(npm ci || (echo 'npm ci failed at runtime -> npm install fallback' && rm -f package-lock.json && npm install)) && npm run dev"]

# --- Build stage --------------------------------------------------------------
FROM node:${NODE_VERSION} AS build

WORKDIR /app

# Copy only package manifests first to leverage Docker layer cache
COPY app/package.json ./
COPY app/package-lock.json ./
COPY app/.npmrc ./

RUN npm ci || npm install

ENV PATH=/app/node_modules/.bin:$PATH

# Copy the rest of the application (configs + sources)
COPY app/ ./

# Build app
RUN npm run build

# --- Production stage ---------------------------------------------------------
FROM node:${NODE_VERSION} AS prod

ARG PORT=3000

WORKDIR /srv/app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV PORT=$PORT

EXPOSE $PORT

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
