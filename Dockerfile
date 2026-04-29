FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends chromium > /dev/null 2>&1
RUN ln -s /usr/bin/chromium /usr/bin/google-chrome 2>/dev/null || true

COPY package.json pnpm-lock.yaml ./
RUN npm install -g corepack@latest && corepack enable && corepack prepare --activate
RUN pnpm install --frozen-lockfile --prefer-offline

COPY . .
RUN pnpm run build

EXPOSE 8000
CMD ["node", "server.js"]
