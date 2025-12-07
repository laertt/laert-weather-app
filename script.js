const API_KEY = "649fdf1cc248e37a83fb8ffd12de96dd";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherDiv = document.getElementById("weather");

  if (city === "") {
    weatherDiv.innerHTML = "<p>Ju lutem vendosni nje qytet.</p>";
    return;
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=al`);
    //ky API i ktyre se suporto shqipen
    const data = await res.json();
    const translations = {
  "clear sky": "qiell i kthjellet",
  "few clouds": "re te pakta",
  "scattered clouds": "re të shperndara",
  "broken clouds": "re te thyera",
  "overcast clouds": "re te dendura",
  "light rain": "shi i lehte",
  "moderate rain": "shi mesatar",
  "heavy intensity rain": "shi i dendur",
  "shower rain": "shi i rrepire",
  "rain": "shi",
  "thunderstorm": "stuhi me vetetima",
  "snow": "bore",
  "mist": "mjergull",
  "haze": "mjegull e holle",
  "fog": "mjergull e dendur"
};
let pershkrimi_motit = data.weather[0].description.toLowerCase();
let perkthim_shqip = translations[pershkrimi_motit] || pershkrimi_motit;
perkthim_shqip = perkthim_shqip.charAt(0).toUpperCase() + perkthim_shqip.slice(1);

    if (data.cod == "404") {
      weatherDiv.innerHTML = "<p>Qyteti nuk u gjet.</p>";
      document.body.style.background = "#1e1e1e";
      return;
    }

    const weatherMain = data.weather[0].main.toLowerCase();

    if (weatherMain.includes("cloud")) {
      document.body.className = "cloudy";
    } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
      document.body.className = "rainy";
    } else if (weatherMain.includes("snow")) {
      document.body.className = "snow";
    } else if (weatherMain.includes("clear")) {
      document.body.className = "sunny";
    } else {
      document.body.style.background = "#1e1e1e";
    }
addCityToWatchlist(data.name);

    weatherDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p>${perkthim_shqip}</p>
      <p>🌡 Temperatura: ${data.main.temp}°C</p>
      <p>💧 Lageshtia: ${data.main.humidity}%</p>
      <p>💨 Shpejtesia e eres: ${data.wind.speed} km/h</p>
    `;

  } catch (error) {
    weatherDiv.innerHTML = "<p>Error ne gjetjen e motit</p>";
    document.body.style.background = "#1e1e1e";
  }
}

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function updateWatchlistUI() {
  const watchlistDiv = document.getElementById("watchlist");

  if (watchlist.length === 0) {
    watchlistDiv.innerHTML = "<p>Asnje qytet nuk eshte shtuar ende.</p>";
    return;
  }

  watchlistDiv.innerHTML = "";

  watchlist.forEach(city => {
    const item = document.createElement("div");
    item.className = "watchlist-item";

    item.innerHTML = `
      <span onclick="loadCity('${city}')">${city}</span>
      <span class="remove-btn" onclick="removeCity(event, '${city}')">✖</span>
    `;

    watchlistDiv.appendChild(item);
  });
}

function addCityToWatchlist(city) {
  if (!watchlist.includes(city)) {
    watchlist.push(city);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    updateWatchlistUI();
  }
}

function removeCity(e, city) {
  e.stopPropagation(); 
  watchlist = watchlist.filter(c => c !== city);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  updateWatchlistUI();
}

function loadCity(city) {
  document.getElementById("cityInput").value = city;
  getWeather(); 
}
updateWatchlistUI();

