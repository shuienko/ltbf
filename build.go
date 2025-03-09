//go:build ignore
// +build ignore

package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

func main() {
	// Get the current directory
	dir, err := os.Getwd()
	if err != nil {
		fmt.Printf("Error getting current directory: %v\n", err)
		os.Exit(1)
	}

	// Define the output binary name based on the OS
	outputName := "ltbf"
	if runtime.GOOS == "windows" {
		outputName += ".exe"
	}

	// Build the binary with embedded files
	fmt.Println("Building binary with embedded files...")
	cmd := exec.Command("go", "build", "-o", outputName)
	cmd.Env = append(os.Environ(), "CGO_ENABLED=0")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Printf("Error building binary: %v\n", err)
		os.Exit(1)
	}

	outputPath := filepath.Join(dir, outputName)
	fmt.Printf("Binary built successfully: %s\n", outputPath)
	fmt.Println("\nRun the application with:")
	fmt.Printf("  %s\n", outputName)
}
