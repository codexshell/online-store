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

ENV DATABASE_HOST=
ENV DATABASE_PORT=
ENV DATABASE_USER=
ENV DATABASE_PASSWORD=
ENV DATABASE_NAME=

RUN npm install --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "dist/main"]