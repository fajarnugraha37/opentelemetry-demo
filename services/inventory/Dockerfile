FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY services/shared/package*.json ./services/shared/
COPY services/inventory/package*.json ./services/inventory/
COPY services/shared/ ./services/shared/
COPY services/inventory/ ./services/inventory/

RUN npm ci && \
    npm run build --omit=dev


FROM node:20-alpine as runtime

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/services/shared/package*.json ./services/shared/
COPY --from=builder /app/services/inventory/package*.json ./services/inventory/

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /app/services/shared/dist ./services/shared/dist/
COPY --from=builder /app/services/inventory/dist ./services/inventory/dist/

CMD ["node", "services/inventory/dist/index.js"]