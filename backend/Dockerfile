FROM rust:1.77 as builder
COPY . .
RUN cargo install --path .

FROM gcr.io/distroless/cc:nonroot
COPY --from=builder --chown=nonroot:nonroot /usr/local/cargo/bin/backend /usr/local/bin/backend
WORKDIR /usr/local/bin
CMD [ "backend" ]
