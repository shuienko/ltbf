# 💰 Long-Term Budget Forecaster (LTBF)

Your friendly financial time machine that helps you peek into your financial future! LTBF is a simple yet powerful web application that forecasts your budget over the long term, taking into account your current savings, monthly income, expenses, and planned future expenditures.

## ✨ Features

- 📊 Calculate detailed long-term budget forecasts based on your current financial situation
- 📈 Visualize your savings trajectory with beautiful interactive charts
- 🗓️ Plan for future large expenses (like vacations, home renovations, or a new car) and see their impact on your savings
- 🎯 Set target savings goals and get visual indicators when you reach them
- ⚠️ Set minimum acceptable savings thresholds and receive alerts when your projected savings dip below them
- 🔒 All your data stays on your device - we don't store any of your financial information

## 🚀 Getting Started

### Prerequisites

- Go 1.16 or higher (if running locally)
- Docker (if using containerized approach)

### Command-Line Application

LTBF can now be used as a standalone command-line application that embeds all static files and launches a browser window automatically.

#### Building the Command-Line Application

```bash
# Build the command-line application
go run build.go
```

This will create an executable file named `ltbf` (or `ltbf.exe` on Windows) in your current directory.

#### Running the Command-Line Application

```bash
# Run the application
./ltbf
```

The application will start a local web server and automatically open your default web browser to access the application.

### Running Locally (Web Server)

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

## 🧩 How to Use

1. **Enter your financial information:**
   - 💵 Current savings
   - 💸 Monthly income
   - 💰 Monthly expenses
   - 🏆 Target savings goal (optional)
   - 🛡️ Minimum acceptable savings (optional)
   - ⏱️ Number of years to forecast

2. **Add planned future expenses:**
   - 🏠 Home down payment
   - 🚗 New car purchase
   - ✈️ Dream vacation
   - 👶 Baby expenses
   - 🎓 Education costs
   - ...or any other major expenses you anticipate

3. **Click "Generate Forecast" to see your financial future:**
   - Interactive chart showing your savings over time
   - Detailed monthly breakdown table
   - Visual indicators for when you reach targets or fall below minimums

4. **Plan, adjust, and optimize your financial future!**

## 🧠 How It Works

LTBF uses a simple but effective algorithm to project your savings over time:

1. Starts with your current savings
2. Adds your monthly net income (income minus expenses) each month
3. Subtracts any planned expenses in the months they occur
4. Tracks your savings trajectory over your specified forecast period
5. Highlights when you reach targets or fall below thresholds

## 🏗️ Project Structure

- `main.go` - Application entry point and server setup
- `budget.go` - Core budget forecasting logic and data structures
- `web.go` - HTTP handlers for serving the web interface and API
- `ratelimiter.go` - Rate limiting functionality to prevent abuse
- `templates/` - HTML templates for the web interface
  - `index.html` - Main application page
- `static/` - Static assets
  - `app.js` - Frontend JavaScript for the interactive UI
  - `styles.css` - CSS styling for a beautiful user experience
- `Dockerfile` - For containerizing the application
- `go.mod` & `go.sum` - Go module dependencies

## 📝 License

This project is licensed under the terms of the license included in the repository.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- Chart.js for the beautiful visualizations
- Font Awesome for the icons
- The Go community for the amazing language and tools 