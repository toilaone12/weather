let searchInput = document.querySelector(".weather_search");
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let description = document.querySelector(".weather_description");
let calendar = document.querySelector(".weather_calendar");
let humidity = document.querySelector(".humiditiy-value");
let wind = document.querySelector(".wind-value");
let pressure = document.querySelector(".pressure-value");
let feel = document.querySelector(".feel-value");
let image = document.querySelector(".weather_image");
let forecastBlock = document.querySelector(".weather_forecast");
let suggestions = document.querySelector("#suggestions");
let degree = document.querySelector(".current-temperature");
let templature = document.querySelector(".temperature");

let weatherCurrentAPIKey = "69f59d0621e668fb571e5dda73e6ab46"; // Change this to your own API key
let weatherAPIKey = "268b6bc41aacfdae11977beade7b8778"; // Change this to your own API key
//link weather
let weatherCurrentEndpoint = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + weatherCurrentAPIKey;
let weatherBaseEndpoint = "https://pro.openweathermap.org/data/2.5/forecast/hourly";
let forecastBaseEndpoint = "https://api.openweathermap.org/data/2.5/forecast/daily";


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

//  API Connection for current weather section (phan lay thong tin api thoi tiet ngay bh)
let getWeatherCurrentDay = async (cityString) => {
  let city;
  if (cityString.includes(",")) {
    city =
      cityString.substring(0, cityString.indexOf(",")) +
      cityString.substring(cityString.lastIndexOf(","));
  } else {
    city = cityString;
  }
  let endpoint = `${weatherCurrentEndpoint}&q=${city}`;
  let response = await fetch(endpoint);
  if (response.status !== 200) {
    alert("City not found!");
    return;
  }
  let weather = await response.json();
  updateCurrentWeather(weather);
  getForecastByCityID(weather.id);
}
// API get list hours weather (phan lay thong tin api thoi tiet tung gio)
let getHoursForestCast = async (cityString) => {
  let city;
  if (cityString.includes(",")) {
    city =
      cityString.substring(0, cityString.indexOf(",")) +
      cityString.substring(cityString.lastIndexOf(","));
  } else {
    city = cityString;
  }
  let endpoint = `${weatherBaseEndpoint}?q=${city}&appid=${weatherAPIKey}`;
  let response = await fetch(endpoint);
  if (response.status !== 200) {
    alert("City not found!");
    return;
  }
  let weather = await response.json();
  updateListHoursWeather(weather);
};

//  API Connection for forecast section (phan lay thong tin api thoi tiet tung ngay)
let getForecastByCityID = async (id) => {
  let endpoint = forecastBaseEndpoint + "?id=" + id + "&appid=" + weatherAPIKey;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let dailys = [];;
  forecastList.forEach((forecast) => {
    let date = new Date(forecast.dt * 1000);
    let day = date.getDate();
    let month = date.toLocaleDateString('en-US',{month: 'short'});
    dailys.push({
      canlendar: `${day} ${month}`,
      dt: forecast.dt * 1000,
      temp: {
        day: forecast.temp.day,
        eve: forecast.temp.eve,
      },
      id: forecast.weather[0].id
    });
  });
  updateForecast(dailys);
};
// phan lay thong tin toa do de tra ve thoi tiet
let weatherForCity = async (city) => { 
  getWeatherCurrentDay(city);
  getHoursForestCast(city);
};

// Set city weather info (phan tim kiem thoi tiet tung noi)
searchInput.addEventListener("keydown", async (e) => { 
  if (e.keyCode === 13) {
    weatherForCity(searchInput.value);
  }
});

// API Connection for search input containing suggestions
// searchInput.addEventListener("input", async () => {
//   let endpoint = cityBaseEndpoint + searchInput.value;
//   let result = await (await fetch(endpoint)).json();
//   suggestions.innerHTML = "";
//   let cities = result._embedded["city:search-results"];
//   let length = cities.length > 5 ? 5 : cities.length;
//   for (let i = 0; i < length; i++) {
//     let option = document.createElement("option");
//     option.value = cities[i].matching_full_name;
//     suggestions.appendChild(option);
//   }

  
// });

// Update current weather details (phan cap nhat thoi tiet ngay bh)
let updateCurrentWeather = (data) => { 
  degree.innerText = Math.round(data.main.temp);
  city.innerText = data.name + ', ' + data.sys.country;
  humidity.innerText = data.main.humidity;
  pressure.innerText = data.main.pressure;
  wind.innerText = data.wind.speed;
  feel.innerText = data.main.feels_like;
};

// Update current weather details (phan cap nhat thoi tiet theo gio trong ngay)
let updateListHoursWeather = (data) => {
  let html = ``;
  for(let i = 0; i <= 20; i++){
    let date = new Date(data.list[i].dt_txt);
    let hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
    let formattedTime = `${hours}:${minutes}`;
    let temp = Math.round(parseFloat(data.list[i].main.temp) - 273.15);
    let iconUrl = "";
    // console.log(data);
    weatherImages.forEach((obj) => {
      if (obj.ids.includes(data.list[i].weather[0].id)) {
        iconUrl = obj.url;
      }
    });
    html += `<div class=" item item_1">
        <h6> ${formattedTime} </h6>
        <img src="${iconUrl}" alt="rainny" class="weather_forecast_icon">
        <h6> <span class="value">${temp}</span>°C </h6>
    </div>`;
  }
  templature.innerHTML = html;
};

// Update forecast weather details (phan cap nhat thoi tiet cac ngay)
let updateForecast = (dailys) => {
  let html = ``;
  dailys.forEach((day) => {
    let iconUrl = "";
    let dayName = dayOfWeek(day.dt);
    let temp = Math.round(day.temp.day - 273.15);
    let calendar = day.canlendar;
    weatherImages.forEach((obj) => {
      if (obj.ids.includes(day.id)) {
        iconUrl = obj.url;
      }
    });
    html += `
        <div class="weather_forecast_item item item_1 align-items-center">
        <div class="col-4">
          <div class="text3 py-1" >
              <h6 class="weather_forecast_day"> ${dayName} </h6>
              <h7> ${calendar} </h7>
          </div>
        </div>
        <div class="col-4">
          <h5 class="weather_forecast_temperature d-flex justify-content-center"> &emsp;${temp}</h5>
        </div>
        <div class="col-4 d-flex justify-content-center">
          <img src="${iconUrl}" alt="${iconUrl}" class="weather_forecast_icon">
        </div>
        </div>
    `;
  });
  forecastBlock.innerHTML = html;
};


// Get day info - from Monday to Sunday
let dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};

// // Get calendar info in format dd/MM/YYYY
// let calendarInfo = () => {
//   return new Date().toLocaleDateString("en-US", { calendar: "long" });
// };

// Get wind info - from degree to direction
// phan lay toa do khi bat dinh vi (y/c phai bat dinh vi)
// let getGeolocationCurrent = () => { 
//   return new Promise((resolve, reject) => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
//           resolve([lat, lng]);
//         },
//         (error) => {
//           reject("Error getting geolocation: " + error.message);
//         }
//       );
//     } else {
//       reject("Geolocation is not supported by this browser.");
//     }
//   });
// }

// Default city when start the page
let init = () => {
  //lay list thoi tiet trong ngay
  getHoursForestCast("HaNoi");
  getWeatherCurrentDay("HaNoi");
  //lay thoi tiet ngay hom nay
  let date = new Date();
  let dayOfWeek = date.getDate();
  let month = date.getMonth() + 1;
  let nameMonth = date.toLocaleString('en-US', { month: 'long' });
  let year = date.getFullYear();
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
  calendar.innerText = dayOfWeek + '/' + month + '/' + year;
  day.innerHTML = hours + ':' + minutes + '&emsp;' + nameMonth + ' ' + dayOfWeek;
  // // console.log(nameMonth);

};

init();