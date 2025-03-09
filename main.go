package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"
)

//go:embed static/*
var staticFiles embed.FS

//go:embed templates/*
var templateFiles embed.FS

func main() {
	// Create a file system for static files
	staticFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatal(err)
	}

	// Create a file system for template files
	templateFS, err := fs.Sub(templateFiles, "templates")
	if err != nil {
		log.Fatal(err)
	}

	// Set up HTTP handlers
	http.HandleFunc("/", rateLimit(func(w http.ResponseWriter, r *http.Request) {
		serveHome(w, r, templateFS)
	}))
	http.HandleFunc("/forecast", rateLimit(handleForecast))

	// Serve static files (CSS, JS)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.FS(staticFS))))

	// Start server on a random available port
	port := "8080"
	serverURL := fmt.Sprintf("http://localhost:%s", port)
	fmt.Printf("Server started at %s\n", serverURL)

	// Open browser in a separate goroutine
	go func() {
		// Wait a moment for the server to start
		time.Sleep(500 * time.Millisecond)
		openBrowser(serverURL)
	}()

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// openBrowser opens the specified URL in the default browser
func openBrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "darwin":
		err = exec.Command("open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}

	if err != nil {
		log.Printf("Error opening browser: %v", err)
	}
}
