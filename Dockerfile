FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files (if they exist)
COPY go.mod go.sum* ./

# Download dependencies (if go.mod exists)
RUN if [ -f go.mod ]; then go mod download; fi

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o ltbf .

# Use a smaller image for the final container
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/ltbf .

# Copy static files and templates
COPY --from=builder /app/static ./static
COPY --from=builder /app/templates ./templates

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["./ltbf"] 