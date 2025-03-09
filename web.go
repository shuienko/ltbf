package main

import (
	"encoding/json"
	"io/fs"
	"net/http"
)

func serveHome(w http.ResponseWriter, r *http.Request, templateFS fs.FS) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	// Use the embedded file system to serve the index.html file
	content, err := fs.ReadFile(templateFS, "index.html")
	if err != nil {
		http.Error(w, "Error reading template", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.Write(content)
}

func handleForecast(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input InputData
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	result := CalculateForecast(input)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
