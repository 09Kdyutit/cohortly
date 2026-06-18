FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PORT=10000
ENV COHORTLY_DEV_MODE=false
EXPOSE 10000
CMD ["node", "server/production-server.mjs"]
