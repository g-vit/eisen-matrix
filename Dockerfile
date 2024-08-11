# Step 1: Build the Go server
FROM golang:1.22-alpine AS server-builder

WORKDIR /app

COPY ./core .

RUN go mod download

RUN go build -o server main.go

# Step 2: Build the React client
FROM node:20-alpine AS client-builder

WORKDIR /app

COPY ./ui/package*.json ./

RUN npm install

COPY ./ui .

RUN npm run build

# Step 3: Final container
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=server-builder /app/server .
COPY --from=client-builder /app/build ./static

EXPOSE 8080

CMD ["./server"]
