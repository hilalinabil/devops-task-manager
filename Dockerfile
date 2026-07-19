FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
        CMD wget --spider -q http://localhost:3000/health || exit 1
CMD ["npm","start"]