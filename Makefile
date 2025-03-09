.PHONY: build run clean

# Default target
all: build

# Build the command-line application
build:
	go run build.go

# Run the application
run: build
	./ltbf

# Clean build artifacts
clean:
	rm -f ltbf-*

# Build for multiple platforms
build-all: clean
	# Build for macOS
	GOOS=darwin GOARCH=amd64 go build -o ltbf-darwin-amd64
	GOOS=darwin GOARCH=arm64 go build -o ltbf-darwin-arm64
	
	# Build for Windows
	GOOS=windows GOARCH=amd64 go build -o ltbf-windows-amd64.exe
	
	# Build for Linux
	GOOS=linux GOARCH=amd64 go build -o ltbf-linux-amd64

# Help command
help:
	@echo "Available commands:"
	@echo "  make build     - Build the command-line application"
	@echo "  make run       - Build and run the application"
	@echo "  make clean     - Remove build artifacts"
	@echo "  make build-all - Build for multiple platforms" 