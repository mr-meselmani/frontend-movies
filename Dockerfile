# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0
ARG PNPM_VERSION=10.10.0

FROM node:${NODE_VERSION}-alpine

# Install dependencies
WORKDIR /movies-client

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install

# Copy source code (optional — skip for volume mount)
COPY . .

# Expose default Angular dev server port
EXPOSE 4200

# Start Angular dev server
CMD ["pnpm", "start"]
