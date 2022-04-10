const APIKey = "08175fe76105d9a65224553b347bc45b"; // API Key for openweathermap API
var formWeather = document.querySelector("#form-weather");
var txtCityName = document.querySelector('#city-name');
var sectionCurrentWeather = document.querySelector('#current-weather');
var sectionFutureWeather = document.querySelector('#future-weather');
var futureWeatherHeader = document.querySelector('#future-weather-header');
var sectionSearchHistory = document.querySelector('#searchhistory');
var txtErrorCode = document.querySelector('#error-code');

// Step 1: Get latitude and longitude for city from openweathermap API - Not onecall
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

// Step 2: Function to connect OpenWeather One Call API and get weather data
function getWeatherFromAPI(cityFullName, lat, lon)
{
    let endpointURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + 
    APIKey + "&units=imperial";
    fetch(endpointURL)
    .then(function (response) {        
      if (response.ok) {
          response.json().then(function (data) {
          txtErrorCode.textContent = "";       
          
          sectionCurrentWeather.innerHTML = '';          
          
          for(let i = 1; i < 6; i++)
            document.getElementById("weatherday" + i).innerHTML = '';            
          
          displayCurrentWeather(cityFullName, data);
          displayFutureWeather(data);
          saveSearchHistory(cityFullName);
        });
      } else {
          txtErrorCode.textContent = "There was an error retrieving data: " + response.statusText;        
      }
    })
    .catch(function (error) {
          txtErrorCode.textContent = "There was an error connecting API";        
    });
}

// Step 3: display current weather data to page with dynamic elements
function displayCurrentWeather(cityFullName, data)
{       

    var divCurrentWeather  = document.createElement('div');
    divCurrentWeather.setAttribute('class', 'p-2');

    var headerEl  = document.createElement('h2');
    headerEl.innerHTML = cityFullName;
    headerEl.innerHTML += ' (' + 
    moment.unix(data.current.dt).format('MM/DD/YYYY') + ')';
    headerEl.innerHTML += " <img src='http://openweathermap.org/img/w/" 
    + data.current.weather[0].icon + ".png' alt='" + data.current.weather[0].description + "'></img>";
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

    // uv color code reference: https://www.verywellhealth.com/know-your-uv-index-1069524
    if(data.current.uvi <= 2)    
    $uvColor = 'green';
    else if(data.current.uvi >= 3 && data.current.uvi <= 5)    
    $uvColor = 'yellow';
    else if(data.current.uvi >= 6 && data.current.uvi <= 7)    
    $uvColor = 'orange';
    else if(data.current.uvi >= 8 && data.current.uvi <= 10)    
    $uvColor = 'red';
    else
    $uvColor = 'violet';

    var pEl  = document.createElement('p');
    pEl.innerHTML = 'UV Index: ';

    var spanEl = document.createElement('span');
    spanEl.textContent = data.current.uvi;
    spanEl.setAttribute('class', 'rounded py-1 px-3 text-white');    
    spanEl.setAttribute('style', 'background-color: ' + $uvColor);    
    pEl.append(spanEl);    
    
    divCurrentWeather.append(pEl);    

    sectionCurrentWeather.append(divCurrentWeather);
}

// Step 4: display future weather data to page with dynamic elements
function displayFutureWeather(data)
{    
    if(data.daily)
    {
        console.log(data.daily[0]);
        var forDays = 6;
        if(data.daily.length < 6)
        forDays = data.daily.length;
        
        futureWeatherHeader.textContent = '';
        futureWeatherHeader.textContent = (forDays - 1) + "-Day Forecast:"

        for(let i = 1; i < forDays; i++)
        {
            var weatherDay = "weatherday" + i

            var weatherDayEl = document.getElementById(weatherDay);            
            weatherDayEl.setAttribute('style', 'background-color:#2d3e50');
            
            var pEl  = document.createElement('p');
            pEl.setAttribute('class', 'lead font-weight-bold');
            pEl.innerHTML = 
            moment.unix(data.daily[i].dt).format('MM/DD/YYYY');            
            weatherDayEl.append(pEl);

            var pEl  = document.createElement('p');
            pEl.innerHTML += " <img src='http://openweathermap.org/img/w/" 
            + data.daily[i].weather[0].icon + ".png' alt='" + data.current.weather[0].description + "'></img>";
            weatherDayEl.append(pEl);
         
            var pEl  = document.createElement('p');
            pEl.innerHTML = 'Temp: ' + data.daily[i].temp.day + "&deg;F";    
            weatherDayEl.append(pEl);
        
            var pEl  = document.createElement('p');
            pEl.textContent = 'Wind: ' + data.daily[i].wind_speed + " MPH";    
            weatherDayEl.append(pEl);
        
            var pEl  = document.createElement('p');
            pEl.textContent = 'Humidity: ' + data.daily[i].humidity + " %";    
            weatherDayEl.append(pEl);
        }
    }
}

// Step 5: Store history to local storages if new
function saveSearchHistory(cityName){
    
    let searchHistory = JSON.parse(localStorage.getItem("searchhistory"));                    
    let searchHistoryArray = [];
    if(searchHistory!=null)
    {
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
    else
    {
        let item = {city: cityName};
        searchHistoryArray.push(item);
        localStorage.setItem("searchhistory", JSON.stringify(searchHistoryArray));    
        displayCityInHistory(cityName);
    }



}

// Step 6: Append new search to search history list

function displayCityInHistory(cityName)
{
    var buttonEl  = document.createElement("button");
    buttonEl.textContent = cityName;
    buttonEl.setAttribute('class', 'btn btn-secondary btn-block');
    buttonEl.setAttribute('data-value', cityName);
    sectionSearchHistory.append(buttonEl);
}

// On page load display list of cities from history - local storage
function displaySearchHistory(){    
    let searchHistory = JSON.parse(localStorage.getItem("searchhistory"));                
    if(searchHistory!=null)
    {
        for(let i=0; i<searchHistory.length; i++)
        displayCityInHistory(searchHistory[i].city);    
    }   
}

// fires when the page is loaded 
function init()
{
    displaySearchHistory();
}

//  event listener for form submitted
formWeather.addEventListener('submit', function(e){            
    e.preventDefault();
    var cityName = txtCityName.value;           
    txtCityName.value = '';
    getCoOrdFromAPI(cityName);
})

//  event listener for city clicked from history list
sectionSearchHistory.addEventListener('click', function(event) {
    var element = event.target;  
    var cityName = element.getAttribute("data-value");
    getCoOrdFromAPI(cityName);
})

init();