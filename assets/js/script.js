const APIKey = "08175fe76105d9a65224553b347bc45b";
var formWeather = document.querySelector("#form-weather");
var txtCityName = document.querySelector('#city-name');
var sectionCurrentWeather = document.querySelector('#current-weather');
var sectionFutureWeather = document.querySelector('#future-weather');
var sectionSearchHistory = document.querySelector('#searchhistory');
var txtErrorCode = document.querySelector('#error-code');

// Get latitude and longitude for city 
function getCoOrdFromAPI(cityName){
    sectionCurrentWeather.setAttribute('class', 'border');
    let endpointURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + 
    APIKey + "&units=imperial";

    fetch(endpointURL)
    .then(function (response) {        
      if (response.ok) {
          response.json().then(function (data) {
          txtErrorCode.textContent = "";    
          var cityFullName = data.name;                
          let lat = data.coord.lat;
          let lon = data.coord.lon;
          getWeatherFromAPI(cityFullName, lat, lon); 
        });
      } else {
          txtErrorCode.textContent = "There was an error retrieving data: " + response.statusText;        
      }
    })
    .catch(function (error) {
          txtErrorCode.textContent = "There was an error connecting API";        
    });
}

// Function to connect OpenWeather One Call API and get weather data
function getWeatherFromAPI(cityFullName, lat, lon)
{
    let endpointURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + 
    APIKey + "&units=imperial";
    fetch(endpointURL)
    .then(function (response) {        
      if (response.ok) {
          response.json().then(function (data) {
          txtErrorCode.textContent = "";        
          displayWeather(cityFullName, data);
        });
      } else {
          txtErrorCode.textContent = "There was an error retrieving data: " + response.statusText;        
      }
    })
    .catch(function (error) {
          txtErrorCode.textContent = "There was an error connecting API";        
    });
}
// display weather data to page
function displayWeather(cityFullName, data)
{    
    sectionCurrentWeather.innerHTML = '';
    sectionFutureWeather.innerHTML = '';
    
    var divCurrentWeather  = document.createElement('div');
    divCurrentWeather.setAttribute('class', 'p-2');

    var headerEl  = document.createElement('h2');
    headerEl.textContent = cityFullName;
    headerEl.textContent += ' (' + 
    moment.unix(data.current.dt).format('MM/DD/YYYY') + ')'; // date
    divCurrentWeather.append(headerEl);

    var pEl  = document.createElement('p');
    pEl.innerHTML = 'Temp: ' + data.current.temp + "&deg;F";    
    divCurrentWeather.append(pEl);

    var pEl  = document.createElement('p');
    pEl.textContent = 'Wind: ' + data.current.wind_speed + " MPH";    
    divCurrentWeather.append(pEl);    

    var pEl  = document.createElement('p');
    pEl.textContent = 'Humidity: ' + data.current.humidity + " %";    
    divCurrentWeather.append(pEl);    

    var pEl  = document.createElement('p');
    pEl.innerHTML = 'UV Index: ';
    pEl.innerHTML += '<span class="btn-success rounded">' + data.current.uvi + '</span>';        
    divCurrentWeather.append(pEl);    

    sectionCurrentWeather.append(divCurrentWeather);
}
// Store history to local storages
function saveSearchHistory(cityName){
    
    let searchHistory = JSON.parse(localStorage.getItem("searchhistory"));                
    let searchHistoryArray = [];
    // Get existing records from localstorage and assign to array
    iscityAlreadySearched = 0;
    for(let i=0; i<searchHistory.length; i++)
    {
        let item = {city: searchHistory[i].city};
        searchHistoryArray.push(item);

        if(cityName == searchHistory[i].city)
        iscityAlreadySearched = 1;
    }
    // Save new search to array only if city not already searched
    if(iscityAlreadySearched == 0)
    {
        let item = {city: cityName};
        searchHistoryArray.push(item);
        localStorage.setItem("searchhistory", JSON.stringify(searchHistoryArray));    
        displayCityInHistory(cityName);
    }    

}

// dynamically creat element and append for city name
function displayCityInHistory(cityName)
{
    var buttonEl  = document.createElement("button");
    buttonEl.textContent = cityName;
    buttonEl.setAttribute('class', 'btn btn-secondary btn-block');
    buttonEl.setAttribute('data-value', cityName);
    sectionSearchHistory.append(buttonEl);
}

// Show list of cities from history when page load
function displaySearchHistory(){    
    let searchHistory = JSON.parse(localStorage.getItem("searchhistory"));                
    for(let i=0; i<searchHistory.length; i++)
    displayCityInHistory(searchHistory[i].city);    
}

// fires when the page is loaded 
function init()
{
    displaySearchHistory();
}

// Search button event listener
formWeather.addEventListener('submit', function(e){            
    e.preventDefault();
    var cityName = txtCityName.value;           
    txtCityName.value = '';
    getCoOrdFromAPI(cityName);
    saveSearchHistory(cityName);
})

// button with city name from history list handle event listener
sectionSearchHistory.addEventListener('click', function(event) {
    var element = event.target;  
    var cityName = element.getAttribute("data-value");
    getCoOrdFromAPI(cityName);
    saveSearchHistory(cityName);    
})

init();