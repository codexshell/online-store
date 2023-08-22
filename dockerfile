# Stage 1:  Build the application
FROM node:16 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Create the runtime image
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views
# add to the project root your own production env file
COPY --from=builder /app/.env.prod ./.env.prod

ENV NODE_ENV=production

RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "dist/main"]