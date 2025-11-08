// Weather & Spotify Widget Configuration
const WEATHER_CONFIG = {
    API_KEY: 'a0f3c25c680e5af64e2d1de3a5ae16b8', 
    CITY: 'Ho Chi Minh City',
    COUNTRY_CODE: 'VN',
    UNITS: 'metric' // celsius
};

// Spotify playlists mapping theo thời tiết + buổi trong ngày
const SPOTIFY_PLAYLISTS = {
    // === RAINY COMBINATIONS ===
    rainy_morning: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP?utm_source=generator&theme=0',
        quotes: [
            'Rainy morning {temp}°C... cozy jazz with coffee ☕🌧️',
            'Drizzling morning at {temp}°C... smooth jazz to start the day 🎷',
            'Morning rain {temp}°C... perfect time for chill beats 🌧️'
        ]
    },
    rainy_afternoon: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP?utm_source=generator&theme=0',
        quotes: [
            'Rainy afternoon {temp}°C... lo-fi beats for productive vibes 🌧️💼',
            'Afternoon drizzle at {temp}°C... chill jazz for work 🎵',
            '{temp}°C rainy afternoon... ambient sounds for focus 🌧️'
        ]
    },
    rainy_evening: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
        quotes: [
            'Rainy evening {temp}°C... relaxing lo-fi to unwind 🌧️🌙',
            'Evening rain at {temp}°C... smooth jazz for the soul 🎶',
            '{temp}°C rainy night... cozy vibes incoming 🌧️'
        ]
    },
    rainy_night: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
        quotes: [
            'Rainy night {temp}°C... dreamy lo-fi beats 🌧️🌙',
            'Night rain at {temp}°C... chill vibes for sleep 💤',
            '{temp}°C midnight rain... peaceful ambient sounds 🌧️✨'
        ]
    },

    // === THUNDERSTORM COMBINATIONS ===
    thunderstorm_any: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo?utm_source=generator&theme=0',
        quotes: [
            'Thunderstorm at {temp}°C... epic soundtracks for epic weather ⚡',
            'Stormy {temp}°C... dramatic music for dramatic skies 🌩️',
            'Thunder rolls at {temp}°C... intense playlist activated ⛈️'
        ]
    },

    // === SUNNY COMBINATIONS ===
    sunny_morning: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC?utm_source=generator&theme=0',
        quotes: [
            'Sunny morning {temp}°C... coffee music to start the day ☀️☕',
            'Beautiful {temp}°C morning... upbeat tunes for energy 🌞',
            'Morning sunshine at {temp}°C... feel-good vibes ahead 🎶'
        ]
    },
    sunny_afternoon: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC?utm_source=generator&theme=0',
        quotes: [
            'Sunny afternoon {temp}°C... happy indie tunes 🌞🎵',
            '{temp}°C sunshine... perfect for upbeat music 🌤️',
            'Bright afternoon at {temp}°C... energetic playlist 🎶'
        ]
    },
    sunny_evening: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator&theme=0',
        quotes: [
            'Sunny evening {temp}°C... chill sunset vibes 🌅🎵',
            'Golden hour at {temp}°C... mellow tunes 🌇',
            '{temp}°C evening sun... relaxing beats 🌞'
        ]
    },

    // === CLOUDY COMBINATIONS ===
    cloudy_morning: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator&theme=0',
        quotes: [
            'Cloudy morning {temp}°C... ambient sounds to start ☁️',
            'Overcast {temp}°C morning... chill vibes ☁️☕',
            'Gray morning at {temp}°C... peaceful music 🌥️'
        ]
    },
    cloudy_afternoon: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator&theme=0',
        quotes: [
            'Cloudy afternoon {temp}°C... mellow ambient tunes ☁️',
            '{temp}°C overcast... chill beats for work 🌥️',
            'Gray skies at {temp}°C... calm music 🎧'
        ]
    },
    cloudy_evening: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator&theme=0',
        quotes: [
            'Cloudy evening {temp}°C... relaxing ambient sounds ☁️',
            '{temp}°C overcast night... peaceful vibes 🌥️',
            'Gray evening at {temp}°C... calm tunes 🎶'
        ]
    },
    cloudy_night: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
        quotes: [
            'Cloudy night {temp}°C... lo-fi beats to sleep 🌙☁️',
            '{temp}°C overcast night... dreamy sounds 💤',
            'Night clouds at {temp}°C... chill vibes 🌥️✨'
        ]
    },

    // === MIST/FOG COMBINATIONS ===
    mist_morning: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator&theme=0',
        quotes: [
            'Misty morning {temp}°C... ethereal ambient sounds 🌫️',
            'Foggy {temp}°C morning... dreamy atmospheric music 🎼',
            'Morning mist at {temp}°C... mystical vibes 🌫️☕'
        ]
    },
    mist_any: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator&theme=0',
        quotes: [
            'Misty {temp}°C... ethereal ambient sounds 🌫️',
            'Foggy weather at {temp}°C... dreamy atmospheric music 🎼'
        ]
    },

    // === CLEAR NIGHT ===
    clear_night: {
        embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0',
        quotes: [
            'Clear night {temp}°C... lo-fi beats under the stars 🌙✨',
            '{temp}°C starry night... smooth vibes 🌃',
            'Night falls at {temp}°C... chill beats for late hours 🎹'
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

    getTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 6 && hour < 11) {
            return 'morning'; // 6AM - 11AM
        } else if (hour >= 11 && hour < 13) {
            return 'noon'; // 11AM - 1PM
        } else if (hour >= 13 && hour < 18) {
            return 'afternoon'; // 1PM - 6PM
        } else if (hour >= 18 && hour < 22) {
            return 'evening'; // 6PM - 10PM
        } else {
            return 'night'; // 10PM - 6AM
        }
    }

    getWeatherCategory(weatherData) {
        const weatherId = weatherData.weather[0].id;
        const timeOfDay = this.getTimeOfDay();

        // Thunderstorm - không phân biệt buổi
        if (weatherId >= 200 && weatherId < 300) {
            return 'thunderstorm_any';
        }

        // Rainy - phân biệt buổi
        if (weatherId >= 300 && weatherId < 600) {
            if (timeOfDay === 'morning' || timeOfDay === 'noon') {
                return 'rainy_morning';
            } else if (timeOfDay === 'afternoon') {
                return 'rainy_afternoon';
            } else if (timeOfDay === 'evening') {
                return 'rainy_evening';
            } else {
                return 'rainy_night';
            }
        }

        // Mist/Fog
        if (weatherId >= 700 && weatherId < 800) {
            if (timeOfDay === 'morning' || timeOfDay === 'noon') {
                return 'mist_morning';
            } else {
                return 'mist_any';
            }
        }

        // Clear sky
        if (weatherId === 800) {
            if (timeOfDay === 'night') {
                return 'clear_night';
            } else if (timeOfDay === 'morning' || timeOfDay === 'noon') {
                return 'sunny_morning';
            } else if (timeOfDay === 'afternoon') {
                return 'sunny_afternoon';
            } else {
                return 'sunny_evening';
            }
        }

        // Cloudy - phân biệt buổi
        if (weatherId > 800) {
            if (timeOfDay === 'morning' || timeOfDay === 'noon') {
                return 'cloudy_morning';
            } else if (timeOfDay === 'afternoon') {
                return 'cloudy_afternoon';
            } else if (timeOfDay === 'evening') {
                return 'cloudy_evening';
            } else {
                return 'cloudy_night';
            }
        }

        // Default fallback
        return timeOfDay === 'night' ? 'clear_night' : 'sunny_morning';
    }

    getRandomQuote(category, temp) {
        const playlistData = SPOTIFY_PLAYLISTS[category];
        if (!playlistData) {
            return `Weather at ${Math.round(temp)}°C... enjoy the music 🎵`;
        }
        const quotes = playlistData.quotes;
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
        const spotifyUrl = SPOTIFY_PLAYLISTS[category]?.embedUrl || SPOTIFY_PLAYLISTS.sunny_morning.embedUrl;

        this.container.innerHTML = `
            <div class="weather-spotify-widget">
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
