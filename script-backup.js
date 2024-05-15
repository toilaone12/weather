let searchInput = document.querySelector(".weather_search");
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let description = document.querySelector(".weather_description");
let calendar = document.querySelector(".weather_calendar");
let humidity = document.querySelector(".humiditiy-value");
let wind = document.querySelector(".wind-value");
let pressure = document.querySelector(".pressure-value");
let feel = document.querySelector(".feel-value");
let imageWeather = document.querySelector(".weather_image");
let forecastBlock = document.querySelector(".weather_forecast");
let suggestions = document.querySelector("#suggestions");
let degree = document.querySelector(".current-temperature");
let templature = document.querySelector(".temperature");

let weatherAPIKey = "d57acae4e650458c3de26484f2c5b765"; // Change this to your own API key

let weatherBaseEndpoint =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" +
  weatherAPIKey; // current Weather
let forecastBaseEndpoint =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" +
  weatherAPIKey; // 5days/3hours
// Array for weather images
let weatherImages = [
  {
    url: "assets/images/sunny.png",
    ids: [800],
  },
  {
    url: "assets/images/suncloud.png",
    ids: [801],
  },
  {
    url: "assets/images/rainny.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "assets/images/sunny.png",
    ids: [802],
  },
  {
    url: "assets/images/rainny.png",
    ids: [803, 804],
  },
  {
    url: "assets/images/rainny.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "assets/images/rainny.png",
    ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "assets/images/rainny.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "assets/images/rainny.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];

//  API Connection for current weather section
let getWeatherByCityName = async (cityString) => {
  let city;
  if (cityString.includes(",")) {
    city =
      cityString.substring(0, cityString.indexOf(",")) +
      cityString.substring(cityString.lastIndexOf(","));
  } else {
    city = cityString;
  }
  let endpoint = weatherBaseEndpoint + "&q=" + city;
  let response = await fetch(endpoint);
  if (response.status !== 200) {
    alert("City not found!");
    return;
  }
  let weather = await response.json();
  return weather;
};


//  API Connection for forecast section
let getForecastByCityID = async (id) => {
  let endpoint = forecastBaseEndpoint + "&id=" + id;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let daily = [];
  let arrHours = [];
  forecastList.forEach((day) => {
    let date = new Date(day.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    arrHours.push(day);
    if (hours === 12) {
      daily.push(day);
    }
  });
  return {daily: daily, arrHours: arrHours};
};

let weatherForCity = async (city) => {
  let weather = await getWeatherByCityName(city);
  if (!weather) {
    return;
  }
  let cityID = weather.id;
  let forecast = await getForecastByCityID(cityID);
  updateForecast(forecast.daily);
  updateCurrentWeather(weather);
  updateHourlyWeather(forecast.arrHours);
};

// Set city weather info
searchInput.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    weatherForCity(searchInput.value);
  }
});

// API Connection for search input containing suggestions
searchInput.addEventListener("input", async () => {
  let endpoint = cityBaseEndpoint + searchInput.value;
  let result = await (await fetch(endpoint)).json();
  suggestions.innerHTML = "";
  let cities = result._embedded["city:search-results"];
  let length = cities.length > 5 ? 5 : cities.length;
  for (let i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.value = cities[i].matching_full_name;
    suggestions.appendChild(option);
  }

  
});

// Update current weather details
let updateCurrentWeather = (data) => {
    city.textContent = data.name + ", " + data.sys.country;
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    wind.textContent = data.wind.speed;
    feel.textContent = data.main.feels_like;
    degree.textContent = Math.round(data.main.temp);
    // let imgID = data.weather[0].id;
    // weatherImages.forEach((obj) => {
    //     if (obj.ids.includes(imgID)) {
    //         imageWeather.setAttribute('src',obj.url);
    //     }
    // });
};

// Update hourly forecast weather details
let updateHourlyWeather = (forecase) => {
    let html = ``;
    for(let i = 0; i <= 21; i++){
        let date = new Date(forecase[i].dt_txt);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        let formattedTime = `${hours}:${minutes} (${day}/${month})`;
        let temp = Math.round((forecase[i].main.temp));
        let icon = forecase[i].weather[0].id;
        let imageUrl = '';
        weatherImages.forEach((obj) => {
            if (obj.ids.includes(icon)) {
                imageUrl = obj.url;
            }
        });
        html += `<div class=" item item_1">
            <h6> ${formattedTime} </h6>
            <img src="${imageUrl}" alt="rainny" class="weather_forecast_icon">
            <h6> <span class="value">${temp}</span>°C </h6>
        </div>`;
    }
    templature.innerHTML = html;
}

// Update forecast weather details
let updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";
  forecast.forEach((day) => {
    let iconId = day.weather[0].id;
    let iconUrl = "";
    weatherImages.forEach((obj) => {
        if (obj.ids.includes(iconId)) {
            iconUrl = obj.url;
        }
    });
    let dayName = dayOfWeek(day.dt * 1000);
    let date = new Date(day.dt * 1000);
    let days = date.getDate();
    let month = date.toLocaleDateString('en-US',{month: 'short'});
    let formatDate = `${days} ${month}`; 
    let degree = Math.round(day.main.temp);
    let forecastItem = `
            <div class="weather_forecast_item item item_1 ">
            <div class=" text3 py-1" >
                <h6 class="weather_forecast_day"> ${dayName} </h6>
                <h7> ${formatDate} </h7>
            </div>
            <h5 class="weather_forecast_temperature"> &emsp;${degree}</h5>
            <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather_forecast_icon">
            </div>
        `;
    forecastBlock.insertAdjacentHTML("beforeend", forecastItem);
  });
};


// Get day info - from Monday to Sunday
let dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};

// Get calendar info in format dd/MM/YYYY
// let calendarInfo = () => {
//   return new Date().toLocaleDateString("en-US", { calendar: "long" });
// };

// Get wind info - from degree to direction

// Default city when start the page
let init = () => {
    weatherForCity("Hanoi");
    let date = new Date();
    let dayOfWeek = date.getDate();
    let month = date.getMonth() + 1;
    let nameMonth = date.toLocaleString('en-US', { month: 'long' });
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
    calendar.innerText = dayOfWeek + '/' + month + '/' + year;
    day.innerHTML = hours + ':' + minutes + '&emsp;' + nameMonth + ' ' + dayOfWeek;
};

init();