package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// InputData represents the user input for budget forecasting
type InputData struct {
	Savings              float64        `json:"savings"`
	MonthlyIncome        float64        `json:"monthlyIncome"`
	MonthlySpendings     float64        `json:"monthlySpendings"`
	TargetSavings        float64        `json:"targetSavings"`
	MinAcceptableSavings float64        `json:"minAcceptableSavings"`
	YearsToForecast      int            `json:"yearsToForecast"`
	PlannedSpendings     []PlannedSpend `json:"plannedSpendings"`
}

// PlannedSpend represents a future planned spending
type PlannedSpend struct {
	Month   int     `json:"month"`
	Year    int     `json:"year"`
	Amount  float64 `json:"amount"`
	Comment string  `json:"comment"`
}

// MonthlyData represents the forecast data for a specific month
type MonthlyData struct {
	Month    int     `json:"month"`
	Year     int     `json:"year"`
	Savings  float64 `json:"savings"`
	Spending float64 `json:"spending"`
	Label    string  `json:"label"` // For the graph
}

// ForecastResult represents the complete forecast output
type ForecastResult struct {
	MonthlyData []MonthlyData `json:"monthlyData"`
	Success     bool          `json:"success"`
	Message     string        `json:"message"`
}

// CalculateForecast generates the budget forecast based on input data
func CalculateForecast(input InputData) ForecastResult {
	result := ForecastResult{
		Success: true,
		Message: "Forecast calculated successfully",
	}

	// Validate input
	if input.YearsToForecast <= 0 {
		return ForecastResult{
			Success: false,
			Message: "Years to forecast must be a positive number",
		}
	}

	// Initialize with current savings
	currentSavings := input.Savings
	monthsToForecast := input.YearsToForecast * 12

	// Get current date to start forecast from
	currentTime := time.Now()
	currentMonth := int(currentTime.Month())
	currentYear := currentTime.Year()

	// Create a map for quick lookup of planned spendings
	plannedSpendingsMap := make(map[string]float64)
	plannedSpendingsCommentMap := make(map[string]string)

	for _, spend := range input.PlannedSpendings {
		key := fmt.Sprintf("%d-%d", spend.Year, spend.Month)
		plannedSpendingsMap[key] = spend.Amount
		plannedSpendingsCommentMap[key] = spend.Comment
	}

	// Generate forecast data for each month
	for i := 0; i < monthsToForecast; i++ {
		// Calculate month and year
		month := currentMonth + i
		year := currentYear

		for month > 12 {
			month -= 12
			year++
		}

		// Check for planned spending this month
		key := fmt.Sprintf("%d-%d", year, month)
		plannedSpending := plannedSpendingsMap[key]
		comment := plannedSpendingsCommentMap[key]

		// Calculate savings for this month
		monthlyCashflow := input.MonthlyIncome - input.MonthlySpendings
		newSavings := currentSavings + monthlyCashflow - plannedSpending

		// Create monthly data entry
		monthName := time.Month(month).String()
		monthlyData := MonthlyData{
			Month:    month,
			Year:     year,
			Savings:  newSavings,
			Spending: plannedSpending,
			Label:    fmt.Sprintf("%s %d", monthName[:3], year),
		}

		// Check if minimum savings breached
		if newSavings < input.MinAcceptableSavings {
			monthlyData.Label += " (⚠️ Below minimum)"
		}

		// Check if target reached
		if newSavings >= input.TargetSavings {
			monthlyData.Label += " (🎯 Target reached)"
		}

		// Add comment if there's planned spending
		if comment != "" {
			monthlyData.Label += fmt.Sprintf(" (%s)", comment)
		}

		result.MonthlyData = append(result.MonthlyData, monthlyData)

		// Update current savings for next iteration
		currentSavings = newSavings
	}

	return result
}

func main() {
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/forecast", handleForecast)

	// Serve static files (CSS, JS)
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	http.ServeFile(w, r, "templates/index.html")
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
