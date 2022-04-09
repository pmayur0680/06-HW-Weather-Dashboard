const APIKey = "08175fe76105d9a65224553b347bc45b";
var formWeather = document.querySelector("#form-weather");
var txtCityName = document.querySelector('#city-name');
var sectionCurrentWeather = document.querySelector('#current-weather');
var sectionFutureWeather = document.querySelector('#future-weather');
var sectionSearchHistory = document.querySelector('#searchhistory');
var txtErrorCode = document.querySelector('#error-code');

function showWeather(cityName){
    sectionCurrentWeather.setAttribute('class', 'border');
    let endpointURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + 
    APIKey + "&units=imperial";
    let data = getAPIData(endpointURL);    
    if(data)
    {
        console.log(data);
    }    
}

// Function to connect any endpointURL and return data or handle error
function getAPIData(endpointURL)
{
    fetch(endpointURL)
    .then(function (response) {
        console.log(response);
      if (response.ok) {
          response.json().then(function (data) {
          txtErrorCode.textContent = "";
          return data;
        });
      } else {
          txtErrorCode.textContent = "There was an error retrieving data: " + response.statusText;        
      }
    })
    .catch(function (error) {
          txtErrorCode.textContent = "There was an error connecting API";        
    });
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
    showWeather(cityName);
    saveSearchHistory(cityName);
})

init();