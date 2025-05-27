//Navbar Dropdown on Clicking Profile Image
const button = document.getElementById("user-menu-button");
const menu = document.getElementById("user-dropdown");

  //Display menu on click
  button.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  //Hide menu when clicking outside
  window.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

 

  
const API_KEY = 'API_Key'; // Replaced with my OpenWeatherMap API key

const searchBtn = document.getElementById('searchBtn');
const locBtn = document.getElementById('locBtn');
const recentCitiesEl = document.getElementById('recentCities');
const cityInput = document.getElementById('cityInput');
const errorEl = document.getElementById('error');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastEl = document.getElementById('forecast');
const fiveDays = document.getElementById('fiveDay')

searchBtn.addEventListener('click', () => searchCity(cityInput.value));
locBtn.addEventListener('click', getCurrentLocation);
recentCitiesEl.addEventListener('change', () => searchCity(recentCitiesEl.value));



function searchCity(city) {
    if (!city) return showError('Please enter a city name');
    hideError();
    fetchWeather(city);
    updateRecentCities(city);
}

function updateRecentCities(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
      cities.unshift(city);
      if (cities.length > 5) cities.pop();
      localStorage.setItem('recentCities', JSON.stringify(cities));
    }
    renderRecentCities();
}

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => {
        console.log(res);
        if (!res.ok) throw new Error('City not found');
        return res.json();
      })
      .then(data => displayWeather(data))
      .catch(err => showError(err.message));
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      .then(res => {
        if (!res.ok) throw new Error('Weather data not available');
        return res.json();
      })
      .then(data => displayWeather(data))
      .catch(err => showError(err.message));
  }


function getCurrentLocation() {
    hideError();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      }, () => showError('Unable to access location.'));
    } else {
      showError('Geolocation not supported.');
    }
}

function renderRecentCities() {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
      recentCitiesEl.classList.remove('hidden');
      recentCitiesEl.innerHTML = '<option selected disabled>Recent Cities</option>' + cities.map(city => `<option value="${city}">${city}</option>`).join('');
    } else {
      recentCitiesEl.classList.add('hidden');
    }
}
  
 renderRecentCities();

 
function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
}
  
function hideError() {
    errorEl.classList.add('hidden');
}


 function displayWeather(data) {
    const cityName = data.city.name;
    const current = data.list[0];
  
    currentWeatherEl.innerHTML = `
      <div class="text-center">
        <h2 class="text-xl italic">Currently in ${cityName}</h2>
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" class="mx-auto" />
        <p>${current.weather[0].description}</p>
        <p>🌡️ ${current.main.temp} °C | 💧 ${current.main.humidity}% | 🌬️ ${current.wind.speed} m/s</p>
      </div>
    `;

    fiveDays.innerHTML = `<h3 class="text-xl font-bold text-center p-4" id="fiveDay">5-Days Forecast for ${cityName}</h3>`
  
    forecastEl.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      forecastEl.innerHTML += `
        <div class="w-full flex flex-col items-center justify-center gap-1 border-black m-1 text-slate-900 rounded-lg py-2 px-4 shadow-lg shadow-black text-center min-w-[250px] flex-shrink-2 snap-center lg:min-w-0 md:flex-shrink-2 lg:flex-shrink-5">
          <h3 class="font-semibold">${new Date(forecast.dt_txt).toDateString()}</h3>
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" class="mx-auto" />
          <p>${forecast.weather[0].main}</p>
          <p>🌡️ ${forecast.main.temp} °C</p>
          <p>💧 ${forecast.main.humidity}%</p>
          <p>🌬️ ${forecast.wind.speed} m/s</p>
        </div>
      `;
    }
  }