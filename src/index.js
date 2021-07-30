//Updates Day & Time
let now = new Date();
let time = document.querySelector("#current-time");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentDate = days[now.getDay()];
let currentHour = now.getHours();
let currentMinutes = now.getMinutes();

time.innerHTML = `${currentDate} ${currentHour}:${currentMinutes}`;

//User submission - Display City

function submitCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#search-city-input");
  //console.log(inputCity.value);

  let searchCity = document.querySelector("#current-city");
  //console.log(searchCity);

  searchCity.innerHTML = `${inputCity.value}`;
  enterCity(`${inputCity.value}`);
}

let submit = document.querySelector("#search-form");
submit.addEventListener("submit", submitCity);

//Default City
enterCity("New York");

//Updates city with user submissions - Weather API

function enterCity(city) {
  //event.preventDefault();
  let apiKey = "5562088dc6a08cb31f02b4a3aba8768d";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  // console.log(response);
  let temperature = Math.round(response.data.main.temp);
  //console.log(temperature);

  let weather = document.querySelector("#current-temp");
  weather.innerHTML = `${temperature}°C`;

  let mainCity = document.querySelector("#current-city");
  mainCity.innerHTML = response.data.name;

  let currentDescription = document.querySelector("#description");
  currentDescription.innerHTML = 'Description: ' + response.data.weather[0].description;

  // let currentPrecipitation = document.querySelector("#precipitation");
  // currentPrecipitation.innerHTML = 'Precipitation: ' + response.data.precipitation.value;

  let currentWindSpeed = document.querySelector("#wind");
  let windSpeed = response.data.wind.speed;
  currentWindSpeed.innerHTML = `Wind: ${windSpeed} mph`;

  let currentHumidity = document.querySelector("#humidity");
  let humidity = response.data.main.humidity;
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;

  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIcon.setAttribute(
    "alt",
    `${response.data.weather[0].description}`
  );

  // displayForecast();

  getFutureForecast(response.data.coord)
  console.log(getFutureForecast)
}

//Geolocation API
function currentPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let unit = "metric";

  let apiKey = "5562088dc6a08cb31f02b4a3aba8768d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeather);
}
function currentLocationButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let button = document.querySelector("#current-button");
button.addEventListener("click", currentLocationButton);

//Format Future Dates
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  
  let days = [
  "Sun",
  "Mon",
  "Tues",
  "Wed",
  "Thurs",
  "Fri",
  "Sat"
]

return days[day];
}

//Display Future Forecast
function displayForecast(response) {

  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function(forecastDay, index){
    if (index < 6 ) {  
      forecastHTML = forecastHTML +
      `
      <div class="col-2">
        <h3 class="days">${formatDay(forecastDay.dt)}</h3>
          <img class="week-weather" id="future-weather-icon" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" />
          <div class="forecast-temperature">
            <span class="forecast-temperature-max">${Math.round(forecastDay.temp.max)}°C</span>  <span class="forecast-temperature-min">${Math.round(forecastDay.temp.min)}°C</span>
          </div>
      </div>
      `}
    })

  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML

}

//Get Long & Lat of Searched City
function getFutureForecast(coordinates) {
  // console.log(coordinates);
  let apiKey = "5562088dc6a08cb31f02b4a3aba8768d";
  let unit = "metric";
  let apiUrl =`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayForecast);
}