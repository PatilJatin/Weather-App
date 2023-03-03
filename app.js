const userTab = document.querySelector("#data-userWeather")
const searchTab = document.querySelector("#data-searchWeather");
const userContainer = document.querySelector(".weatherInfo");
const grandAccess = document.querySelector(".grant-loc-container");
const searchForm = document.querySelector("#data-searchForm");
const searchInput = document.querySelector("#data-searchInput");
const grantAccessBtn = document.querySelector("#data-grantAccess");
const loadingScreen = document.querySelector(".loadingContainer")
const weatherInfo = document.querySelector(".weatherInfo");
const cityName = document.querySelector("#data-cityName");
const countryIcon = document.querySelector("#data-countryName");
const desc = document.querySelector("#data-weatherDescribe");
const weatherIcon = document.querySelector("#data-weatherIcon");
const temp = document.querySelector("#data-temp");
const windSpeed = document.querySelector("#data-windSpeed");
const Humidity = document.querySelector("#data-Humidity");
const Clouds = document.querySelector("#data-Clouds");

getFromSessionStorage();

let currTab = userTab;
const API_KEY = "3bd8c5b87a2decaa456994d798241c27";

currTab.classList.add("current-tab");

function getFromSessionStorage () {
    console.log("checking for internal storage") 
    const localCordinates = sessionStorage.getItem("user-coordinate");
    if(!localCordinates){
        grandAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCordinates);
        featchUserInfo(coordinates);
    }
}

async function featchUserInfo(coordinates){
    console.log("user loction fetch started") 
    const {lat , lon} = coordinates;
    console.log(lat,lon)
    grandAccess.classList.remove("active");
    loadingScreen.classList.add("active");
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3bd8c5b87a2decaa456994d798241c27&units=metric`);
      const  data = await response.json();
      console.log(data);
      loadingScreen.classList.remove("active");
      userContainer.classList.add("active");
    // 
    console.log("user loction fetched")  
    // 
      renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        featchUserInfo(coordinates);
    }
}

function renderWeatherInfo(weatherinfo) {

     cityName.innerText = weatherinfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherinfo?.weather?.[0]?.description;
     weatherIcon.src = `https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
     temp.innerText = weatherinfo?.main?.temp;
     windSpeed.innerText = weatherinfo?.wind?.speed;
     Humidity.innerText = weatherinfo?.main?.humidity;
     Clouds.innerText = weatherinfo?.clouds?.all;

}
function switchTab(clickedtab){
    if(currTab != clickedtab){
        currTab.classList.remove("current-tab");
        currTab = clickedtab;
        currTab.classList.add("current-tab"); 
        
        if(!searchForm.classList.contains('active')){
            userContainer.classList.remove("active");
            grandAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click',function(){
    switchTab(userTab);
})

searchTab.addEventListener('click',function(){
    switchTab(searchTab);
})

grantAccessBtn.addEventListener('click',function () {
    if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("not avaliable on your system");
    }
})
function showPosition(position) {
    const userCordinate = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    console.log("caught user location")
    sessionStorage.setItem("user-coordinate" , JSON.stringify(userCordinate));
    featchUserInfo(userCordinate);
}

searchForm.addEventListener('submit',function(ev) {
    ev.preventDefault();
    let city = searchInput.value;

    if(city === "") return ;
    else{
        fetchSearchWeatherInfo(city);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grandAccess.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3bd8c5b87a2decaa456994d798241c27&units=metric`);
        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        
    }
}