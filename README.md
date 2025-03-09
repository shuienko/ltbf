# Long-Term Budget Forecaster (LTBF)

A simple web application that helps you forecast your budget over the long term, taking into account your current savings, monthly income, expenses, and planned future expenditures.

## Features

- Calculate long-term budget forecasts based on your current financial situation
- Visualize your savings trajectory over time
- Plan for future large expenses and see their impact on your savings
- Set target savings goals and minimum acceptable savings thresholds
- Get alerts when your projected savings fall below your minimum threshold

## Getting Started

### Prerequisites

- Go 1.16 or higher (if running locally)
- Docker (if using containerized approach)

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ltbf.git
   cd ltbf
   ```

2. Run the application:
   ```
   go run main.go
   ```

3. Open your browser and navigate to `http://localhost:8080`

### Using Docker

1. Build the Docker image:
   ```
   docker build -t ltbf .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 ltbf
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Enter your current financial information:
   - Current savings
   - Monthly income
   - Monthly expenses
   - Target savings goal
   - Minimum acceptable savings
   - Number of years to forecast

2. Add any planned future expenses with their month, year, amount, and description

3. Click "Calculate Forecast" to see your projected savings over time

4. Review the chart and data to plan your financial future

## Project Structure

- `main.go` - Main application code with server and forecast logic
- `templates/` - HTML templates for the web interface
- `static/` - Static assets (JavaScript, CSS)
- `Dockerfile` - For containerizing the application

## License

This project is licensed under the terms of the license included in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 