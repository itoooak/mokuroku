FROM rust:1.77-alpine as builder
COPY . .
RUN apk --no-cache add musl-dev
RUN cargo install --path .

FROM alpine
COPY --from=builder /usr/local/cargo/bin/backend /usr/local/bin/backend
CMD [ "backend" ]
