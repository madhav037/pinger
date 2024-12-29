# # Use the official Rust image as the base image
# FROM rust:1.68 as builder

# # Set the working directory in the container
# WORKDIR /app

# # Copy the Cargo.toml and Cargo.lock files into the container
# COPY ./Cargo.toml ./Cargo.lock ./

# # Install dependencies before copying the source code (to cache dependencies)
# RUN cargo fetch

# # Copy the source code into the container
# COPY . .

# # Build the Rust project
# RUN cargo build --release

# # Final image with only the compiled binary
# FROM debian:bullseye-slim

# # Set the working directory in the container
# WORKDIR /app

# # Copy the compiled binary from the builder image
# COPY --from=builder /app/target/release/server /usr/local/bin/server

# # Expose the backend API port
# EXPOSE 8080

# # Run the server
# CMD ["server"]


# Step 1: Build the Rust application
FROM rust:1.72 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Fetch dependencies (this helps cache dependencies)
RUN cargo fetch

# Copy the rest of the code
COPY . .

# Build the Rust application
RUN cargo build --release

# Step 2: Set up a lightweight image to run the Rust app
FROM debian:bookworm-slim

# Install dependencies for running the Rust binary
RUN apt-get update && apt-get install -y libssl-dev pkg-config ca-certificates && apt-get clean

# Copy the built binary from the builder image
COPY --from=builder /app/target/release/server /usr/local/bin/server

# Set the default command to run the backend
CMD ["server"]

# Expose the port the app is running on
EXPOSE 8080
