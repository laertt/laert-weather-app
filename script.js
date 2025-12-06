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
  "clear sky": "qiell i kthjellët",
  "few clouds": "re të pakta",
  "scattered clouds": "re të shpërndara",
  "broken clouds": "re të thyera",
  "overcast clouds": "re të dendura",
  "light rain": "shi i lehtë",
  "moderate rain": "shi mesatar",
  "heavy intensity rain": "shi i dendur",
  "shower rain": "shi i rrëpirë",
  "rain": "shi",
  "thunderstorm": "stuhi me vetëtima",
  "snow": "borë",
  "mist": "mjergull",
  "haze": "mjegull e hollë",
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
