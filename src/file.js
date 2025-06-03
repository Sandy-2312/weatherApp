//Getting IDs from elements for menu dropdown
const button = document.getElementById("user-menu-button");
const menu = document.getElementById("user-dropdown");

//Navbar Dropdown on Clicking Profile Image
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

//Hide menu when clicking outside
window.addEventListener("click", (e) => {
  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

 

//API Key to connect to API provider 
const API_KEY = '1a487a0699ca0d5a5a4172db066380f1'; // Replaced with my OpenWeatherMap API key

//Getting IDs from elements to display Weather
const searchCityBtn = document.getElementById('searchCityBtn');
const locationBtn = document.getElementById('locationBtn');
const recentCities = document.getElementById('recentCitiesList');
const cityName = document.getElementById('cityName');
const error = document.getElementById('errorDetails');
const currentWeather = document.getElementById('currentWeatherDetails');
const forecastDetails = document.getElementById('forecast');
const fiveDayData = document.getElementById('fiveDays')

//Adding event listeners on buttons
searchCityBtn.addEventListener('click', () => searchCity(cityName.value));
locationBtn.addEventListener('click', getCurrentLocation);
recentCities.addEventListener('change', () => searchCity(recentCities.value));


//function definition to search city
function searchCity(city) {
  if (!city) return showError('Please enter a city name');          //error handling if user tries to search with no input
  hideError();                                                      //hide error after displaying
  fetchWeather(city);                                               //calling fetchWeather function with current city input
  updateRecentCities(city);                                         //updating recent cities list to add new city
}

//function to store and update recent cities
function updateRecentCities(city) {                                             //taking input of searched city
  let cities = JSON.parse(localStorage.getItem('recentCitiesList')) || [];    //retreiving recent cities from local storage
  if (!cities.includes(city)) {
    cities.unshift(city);                                                     //adding new city at start if not already present in list
    if (cities.length > 5) cities.pop();                                      //only 5 recently searched cities should display in dropdown
    localStorage.setItem('recentCitiesList', JSON.stringify(cities));         //update and store new list in local storage
  }
  renderRecentCities();
}

//fetch weather details from API with city name
function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)    //fetching weather details for required city using API
    //retreiving response from API, and sending it to display, with error handling
    .then(res => {
      if (!res.ok) throw new Error('City not found');               //error handling if no data received for searched city
      return res.json();                                            //returning received data if no error
    })
    .then(data => displayWeather(data))                             //sending data to be displayed
    .catch(err => showError(err.message));                          //show error in console if data not received
}

//fetch weather details from API with location coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error('Weather data not available for given coordinates');
      return res.json();
    })
    .then(data => displayWeather(data))
    .catch(err => showError(err.message));
  }

//get current location to be passed to fetchWeatherByCoords
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);                     //passing coordinate details to fetchWeatherByCoords function to fetch weather from API using coords
    //error handling
    }, () => showError('Unable to access location.'));
  } else {
    showError('Geolocation not supported.');
  }
}

//displaying recent cities from list in dropdown
function renderRecentCities() {
    const cities = JSON.parse(localStorage.getItem('recentCitiesList')) || [];        //retreiving list of recent cities from local storage
    if (cities.length > 0) {
      recentCities.classList.remove('hidden');
      recentCities.innerHTML = '<option selected disabled>Recent Cities</option>' + cities.map(city => `<option value="${city}">${city}</option>`).join('');
    } else {
      recentCities.classList.add('hidden');
    }
}
  
 renderRecentCities();

 
function showError(msg) {
    error.textContent = msg;
    error.classList.remove('hidden');
}
  
function hideError() {
    error.classList.add('hidden');
}


 function displayWeather(data) {
    const cityName = data.city.name;
    const current = data.list[0];
  
    currentWeather.innerHTML = `
      <div class="text-center">
        <h2 class="text-xl italic">Currently in ${cityName}</h2>
        <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" class="mx-auto" />
        <p>${current.weather[0].description}</p>
        <p>🌡️ ${current.main.temp} °C | 💧 ${current.main.humidity}% | 🌬️ ${current.wind.speed} m/s</p>
      </div>
    `;

    fiveDayData.innerHTML = `<h3 class="text-xl font-bold text-center p-4" id="fiveDays">5-Days Forecast for ${cityName}</h3>`
  
    forecastDetails.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      forecastDetails.innerHTML += `
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