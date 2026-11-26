
/* =========================================
   WEATHERLY - LIVE WEATHER APPLICATION
   ========================================= */

// 1. API CONFIGURATION
// Replace the placeholder below with your own API key.
const API_KEY = "e855c2bb4d45ddff923babebf7cc0a32";

// API URLs
const CURRENT_WEATHER_URL =
    "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
    "https://api.openweathermap.org/data/2.5/forecast";

// 2. GET HTML ELEMENTS

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");

const weatherContent = document.getElementById("weatherContent");
const welcome = document.getElementById("welcome");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const currentDate = document.getElementById("currentDate");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");

const forecastContainer = document.getElementById("forecastContainer");

// 3. FORM EVENT

weatherForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});

// 4. FETCH WEATHER DATA

async function getWeather(city) {

    showLoader();
    clearError();

    try {

        // Fetch current weather and 5-day forecast simultaneously
        const currentResponse = await fetch(
            `${CURRENT_WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        const forecastResponse = await fetch(
            `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        // Handle invalid city and API errors
        if (!currentResponse.ok) {
            throw new Error(
                currentResponse.status === 404
                    ? "City not found. Please check the spelling and try again."
                    : "Unable to fetch weather data. Please try again."
            );
        }

        if (!forecastResponse.ok) {
            throw new Error("Unable to fetch forecast data.");
        }

        // Convert JSON responses
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Update the dashboard
        displayCurrentWeather(currentData);
        displayForecast(forecastData);

        weatherContent.classList.remove("hidden");
        welcome.classList.add("hidden");

    } catch (error) {

        showError(error.message || "Something went wrong. Please try again.");

        weatherContent.classList.add("hidden");
        welcome.classList.remove("hidden");

    } finally {

        hideLoader();

    }
}

// 5. DISPLAY CURRENT WEATHER

function displayCurrentWeather(data) {

    cityName.textContent = data.name;
    countryName.textContent = data.sys.country;

    // Display today's date
    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Temperature
    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    // Weather description
    weatherDescription.textContent =
        data.weather[0].description;

    // Weather icon from OpenWeatherMap
    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt = data.weather[0].description;

    // Feels like
    feelsLike.textContent =
        `Feels like ${Math.round(data.main.feels_like)}°C`;

    // Weather metrics
    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    // Update dynamic background
    updateWeatherTheme(data.weather[0].main);
}

// 6. DISPLAY 5-DAY FORECAST

function displayForecast(data) {

    // Group forecast records by date
    const dailyForecasts = {};

    data.list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }

        dailyForecasts[date].push(item);

    });

    // Select the forecast closest to noon for each day
    const forecastDays = Object.values(dailyForecasts).map(day => {

        return day.reduce((closest, item) => {

            const hour = item.dt_txt.split(" ")[1].substring(0, 2);

            const currentDifference = Math.abs(Number(hour) - 12);

            const closestHour = closest.dt_txt.split(" ")[1].substring(0, 2);

            const closestDifference = Math.abs(Number(closestHour) - 12);

            return currentDifference < closestDifference
                ? item
                : closest;

        });

    }).slice(0, 5);

    // Generate forecast cards using Array.map()
    forecastContainer.innerHTML = forecastDays.map(day => {

        const date = new Date(day.dt * 1000);

        const dayName = date.toLocaleDateString("en-IN", {
            weekday: "short"
        });

        const icon = day.weather[0].icon;

        const description = day.weather[0].description;

        const temp = Math.round(day.main.temp);

        return `
            <div class="forecast-card">

                <p class="forecast-day">${dayName}</p>

                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="${description}"
                >

                <p class="forecast-description">
                    ${description}
                </p>

                <p class="forecast-temp">
                    ${temp}°C
                </p>

            </div>
        `;

    }).join("");

}

// 7. DYNAMIC WEATHER BACKGROUND

function updateWeatherTheme(condition) {

    // Remove previous weather themes
    document.body.classList.remove(
        "sunny",
        "rainy",
        "cloudy",
        "snowy"
    );

    const weather = condition.toLowerCase();

    if (weather.includes("clear")) {

        document.body.classList.add("sunny");

    } else if (
        weather.includes("rain") ||
        weather.includes("drizzle") ||
        weather.includes("thunder")
    ) {

        document.body.classList.add("rainy");

    } else if (
        weather.includes("snow")
    ) {

        document.body.classList.add("snowy");

    } else if (
        weather.includes("cloud") ||
        weather.includes("mist") ||
        weather.includes("fog") ||
        weather.includes("haze") ||
        weather.includes("smoke") ||
        weather.includes("dust")
    ) {

        document.body.classList.add("cloudy");

    }

}

// 8. LOADING SPINNER

function showLoader() {

    loader.classList.remove("hidden");
    weatherContent.classList.add("hidden");

}

function hideLoader() {

    loader.classList.add("hidden");

}

// 9. ERROR HANDLING

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");

}

function clearError() {

    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

}
