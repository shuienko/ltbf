package main

import (
	"fmt"
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
	PlannedSpendings     []PlannedSpend `json:"plannedSpendings,omitempty"`
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

	// Only process planned spendings if they exist
	if input.PlannedSpendings != nil {
		for _, spend := range input.PlannedSpendings {
			key := fmt.Sprintf("%d-%d", spend.Year, spend.Month)
			plannedSpendingsMap[key] = spend.Amount
			plannedSpendingsCommentMap[key] = spend.Comment
		}
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

		// Check if minimum savings breached (only if minimum is set)
		if input.MinAcceptableSavings > 0 && newSavings < input.MinAcceptableSavings {
			monthlyData.Label += " (⚠️ Below minimum)"
		}

		// Check if target reached (only if target is set)
		if input.TargetSavings > 0 && newSavings >= input.TargetSavings {
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
