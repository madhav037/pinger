# Stage 1: Build the application in release mode
FROM rustlang/rust:nightly as builder
WORKDIR /usr/src/app

# Install necessary dependencies (pkg-config and OpenSSL development headers)
RUN apt-get update && apt-get install -y pkg-config libssl-dev

# Install cargo-watch globally
RUN cargo install cargo-watch

# Copy dependency manifests first to leverage Docker caching
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

# Now copy the source code
COPY src ./src
RUN cargo build --release  # Build in release mode for optimized performance

# Stage 2: Create a minimal runtime image
FROM rust:slim
WORKDIR /app

# Install any runtime dependencies (pkg-config and OpenSSL)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy the built release binary
COPY --from=builder /usr/src/app/target/release/server .

# Copy cargo-watch for hot reloading
COPY --from=builder /usr/local/cargo/bin/cargo-watch /usr/local/bin/cargo-watch

EXPOSE 8000

# Use cargo-watch to enable hot reloading in release mode
CMD ["cargo", "watch", "-x", "run --release"]
