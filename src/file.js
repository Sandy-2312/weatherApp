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

 

  
const API_KEY = '1a487a0699ca0d5a5a4172db066380f1'; // Replaced with my OpenWeatherMap API key

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

