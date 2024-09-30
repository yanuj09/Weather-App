const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variable name

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

// ek kaam aur pending hai
getfromSessionStorage();



function switchTab(clickedTab){
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // maine phle search wale tab pr tha , ab your weather wale tab pr ana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather main agaya hu, tho phir weather bhe display karna padega , so let first check out local storage have our coordinate or not
            getfromSessionStorage();

        }
    }
}

   

userTab.addEventListener("click" , ()=>{
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click" , ()=>{
    //pass clicked tab as input paramter
    switchTab(searchTab);
});


// check if the coordinate are already present in the 
function getfromSessionStorage(){
    const localCoordinate = sessionStorage.getItem("user-coordinates");
    if(!localCoordinate){
        // agar coordinate nahi mile tho
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates);
    }
}


// uses current location

async function fetchUserWeatherInfo(coordinate){
    const {lat,lon} = coordinate;
    // make grant location invisivle
    grantAccessContainer.classList.remove("active");
    // looder add kar do
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const  data = await response.json();
        //removing loader
        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);




    }
    catch(err){
        loadingScreen.classList.remove("active");
        // hw
        console.log(err);
    }
}

function renderWeatherInfo(weatherInfo){
    // fetching all the component

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countyIcon]");
    const desc = document.querySelector("[data-weatherDesc]"); 
    const weatherIcon= document.querySelector("[ data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherinfo object and put in UI element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %` ;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %` ;

    
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show an alert for no geolocation support available
    }
}

function showPosition(Position){
    const userCoordinates={
        lat: Position.coords.latitude,
        lon: Position.coords.longitude,
    }

    sessionStorage.setItem("User-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName);

    }
});


// searched location weather
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await result.json();

        loadingScreen.classList.remove("active");
        
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(err){
        // hw how to handle error
        loadingScreen.classList.remove("active");
        // hw
        console.log(err);
    }

}
