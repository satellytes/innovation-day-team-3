# Go backend Dockerfile
FROM golang:1.23-alpine as builder
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o sy-stripe-service ./cmd/api

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/sy-stripe-service /app/sy-stripe-service
COPY ./migrations ./migrations
COPY .env.example .env.example
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 8080
ENTRYPOINT ["/wait-for-it.sh", "db", "5432", "/app/sy-stripe-service"]
