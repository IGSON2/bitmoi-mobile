FROM golang:alpine3.18 as builder
WORKDIR /bitmoi-mobile
COPY . .

RUN go mod init bitmoi-mobile/server
RUN go mod tidy
RUN go build -o server

FROM  alpine:latest
USER root
WORKDIR /bitmoi-mobile
COPY --from=builder /bitmoi-mobile/server .
COPY server.crt .
COPY server.key .
COPY ./build ./build

ENTRYPOINT ["./server"]