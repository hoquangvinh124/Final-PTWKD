// Weather & Spotify Widget Configuration
const WEATHER_CONFIG = {
    API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY', // Thay bằng API key của bạn từ https://openweathermap.org/api
    CITY: 'Ho Chi Minh City',
    COUNTRY_CODE: 'VN',
    UNITS: 'metric' // celsius
};

// Spotify playlists mapping theo thời tiết
const SPOTIFY_PLAYLISTS = {
    // Rainy/Thunderstorm - Jazz, Lo-fi, Chill
    rainy: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP?utm_source=generator&theme=0',
        quotes: [
            'Rainy day {temp}°C... perfect time for some jazz ☕',
            'Drizzling at {temp}°C... let the smooth jazz flow 🎷',
            'Rain outside, jazz inside at {temp}°C 🌧️',
            '{temp}°C and raining... cozy jazz vibes ahead 🎵'
        ]
    },

    // Thunderstorm - Dramatic, Intense
    thunderstorm: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo?utm_source=generator&theme=0',
        quotes: [
            'Thunderstorm at {temp}°C... epic soundtracks for epic weather ⚡',
            'Stormy {temp}°C... dramatic music for dramatic skies 🌩️',
            'Thunder rolls at {temp}°C... intense playlist activated ⛈️'
        ]
    },

    // Sunny/Clear - Upbeat, Happy, Indie
    sunny: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC?utm_source=generator&theme=0',
        quotes: [
            'Sunny morning {temp}°C... playlist for some coffee music ☀️☕',
            'Beautiful {temp}°C sunshine... time for happy vibes 🌞',
            'Clear skies at {temp}°C... upbeat indie tunes await 🎶',
            '{temp}°C and sunny... perfect day for feel-good music 🌤️'
        ]
    },

    // Cloudy - Chill, Ambient
    cloudy: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator&theme=0',
        quotes: [
            'Cloudy {temp}°C... ambient sounds for a mellow mood ☁️',
            '{temp}°C and overcast... chill vibes incoming 🌥️',
            'Gray skies at {temp}°C... peaceful ambient music 🎧'
        ]
    },

    // Night/Evening - Lo-fi, Smooth Jazz, R&B
    night: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
        quotes: [
            'Evening at {temp}°C... lo-fi beats to relax 🌙',
            '{temp}°C nighttime... smooth vibes for the night 🌃',
            'Night falls at {temp}°C... chill beats for late hours 🎹'
        ]
    },

    // Snow - Acoustic, Winter
    snow: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4H7FFUM2osB?utm_source=generator&theme=0',
        quotes: [
            'Snowing at {temp}°C... warm acoustic melodies ❄️',
            '{temp}°C winter wonderland... cozy acoustic tunes 🎸'
        ]
    },

    // Mist/Fog - Ethereal, Ambient
    mist: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator&theme=0',
        quotes: [
            'Misty {temp}°C... ethereal ambient sounds 🌫️',
            'Foggy morning at {temp}°C... dreamy atmospheric music 🎼'
        ]
    }
};

// Weather icon mapping
const WEATHER_ICONS = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
};

class WeatherSpotifyWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        this.init();
    }

    async init() {
        this.showLoading();
        try {
            const weatherData = await this.fetchWeather();
            this.render(weatherData);
        } catch (error) {
            console.error('Error initializing weather widget:', error);
            this.showError();
        }
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="weather-spotify-widget">
                <div class="weather-loading">
                    <i class="fas fa-spinner"></i>
                    <p>Loading weather...</p>
                </div>
            </div>
        `;
    }

    showError() {
        this.container.innerHTML = `
            <div class="weather-spotify-widget">
                <div class="weather-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Không thể tải dữ liệu thời tiết. Vui lòng kiểm tra API key.</p>
                </div>
            </div>
        `;
    }

    async fetchWeather() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CONFIG.CITY},${WEATHER_CONFIG.COUNTRY_CODE}&units=${WEATHER_CONFIG.UNITS}&appid=${WEATHER_CONFIG.API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }

        return await response.json();
    }

    getWeatherCategory(weatherData) {
        const weatherId = weatherData.weather[0].id;
        const weatherMain = weatherData.weather[0].main.toLowerCase();
        const icon = weatherData.weather[0].icon;
        const hour = new Date().getHours();

        // Check for night time (6 PM to 6 AM)
        const isNight = hour >= 18 || hour < 6;

        // Categorize weather
        if (weatherId >= 200 && weatherId < 300) {
            return 'thunderstorm';
        } else if (weatherId >= 300 && weatherId < 600) {
            return 'rainy';
        } else if (weatherId >= 600 && weatherId < 700) {
            return 'snow';
        } else if (weatherId >= 700 && weatherId < 800) {
            return 'mist';
        } else if (weatherId === 800) {
            return isNight ? 'night' : 'sunny';
        } else if (weatherId > 800) {
            return 'cloudy';
        }

        return isNight ? 'night' : 'sunny';
    }

    getRandomQuote(category, temp) {
        const quotes = SPOTIFY_PLAYLISTS[category].quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return randomQuote.replace('{temp}', Math.round(temp));
    }

    render(weatherData) {
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const category = this.getWeatherCategory(weatherData);
        const quote = this.getRandomQuote(category, temp);
        const weatherIcon = WEATHER_ICONS[icon] || '🌤️';
        const spotifyUrl = SPOTIFY_PLAYLISTS[category].embedUrl;

        this.container.innerHTML = `
            <div class="weather-spotify-widget ${category}">
                <div class="weather-info">
                    <div class="weather-icon">${weatherIcon}</div>
                    <div class="weather-details">
                        <h3 class="weather-temp">${Math.round(temp)}°C</h3>
                        <p class="weather-description">${description}</p>
                    </div>
                </div>

                <div class="mood-quote">
                    <p>
                        <i class="fas fa-music quote-icon"></i>
                        ${quote}
                    </p>
                </div>

                <div class="spotify-container">
                    <iframe
                        data-testid="embed-iframe"
                        style="border-radius:12px"
                        src="${spotifyUrl}"
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allowfullscreen=""
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `;
    }
}

// Initialize widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const widgetContainer = document.getElementById('weatherSpotifyWidget');
    if (widgetContainer) {
        new WeatherSpotifyWidget('weatherSpotifyWidget');
    }
});
