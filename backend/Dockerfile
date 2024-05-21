FROM rust:1.78 as builder
COPY [ "Cargo.toml", "Cargo.lock", "./" ]
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

COPY src/ src/
RUN touch src/main.rs
RUN cargo build --release

FROM gcr.io/distroless/cc:nonroot
COPY --from=builder --chown=nonroot:nonroot /target/release/backend /usr/local/bin/backend
WORKDIR /usr/local/bin
CMD [ "backend" ]
