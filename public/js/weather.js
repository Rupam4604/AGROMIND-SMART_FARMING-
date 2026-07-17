/* ═══════════════════════════════════════════════════
   weather.js — WEATHER FETCHING & DISPLAY
   Uses OpenWeatherMap API. Edit WEATHER_KEY in config.js
═══════════════════════════════════════════════════ */

async function getWeather() {
  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
    );
    await fetchWeather(pos.coords.latitude, pos.coords.longitude);
  } catch (e) {
    console.warn('Geolocation failed, using fallback:', e.message);
    useFallback();
  }
}

async function refreshWeather() {
  await getWeather();
  toast('Weather refreshed', 'info');
}

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Weather API error');
  weatherData = await r.json();

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_KEY}`;
    const geoR = await fetch(geoUrl);
    const geoData = await geoR.json();
    if (geoData && geoData[0]) {
      locationData = {
        city: geoData[0].name,
        country: geoData[0].country,
        lat, lon,
      };
    } else {
      locationData = { city: weatherData.name, country: weatherData.sys.country, lat, lon };
    }
  } catch (e) {
    locationData = { city: weatherData.name, country: weatherData.sys.country, lat, lon };
  }

  applyWeather();
  setTimeout(() => fetchWeather(lat, lon), 600000);
}

// Fallback if geolocation fails — edit city/data here
function useFallback() {
  weatherData = {
    main: { temp: 28.5, humidity: 65, feels_like: 30 },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    wind: { speed: 3.5 },
    name: 'Kolkata',
    sys: { country: 'IN' },
  };
  locationData = { city: 'Kolkata', country: 'IN' };
  applyWeather();
}

function applyWeather() {
  const d = weatherData;
  const icon    = ICON_MAP[d.weather[0].icon] || '☁️';
  const desc    = d.weather[0].description;
  const windKmh = (d.wind.speed * 3.6).toFixed(1);

  // Dashboard sensor cards (Outdoor)
  setEl('val-temp',          d.main.temp.toFixed(1));
  setEl('val-humidity',      d.main.humidity.toFixed(0));
  setEl('weather-icon-dash', icon);
  setEl('weather-desc-dash', desc.charAt(0).toUpperCase() + desc.slice(1));
  setEl('val-wind',          windKmh);
  setEl('val-feels',         d.main.feels_like.toFixed(1));
  setEl('val-feels2',        d.main.feels_like.toFixed(1)); // humidity card's feels-like

  // Weather widget
  setEl('ww-city',   `${locationData.city}, ${locationData.country}`);
  setEl('ww-icon',   icon);
  setEl('ww-temp',   d.main.temp.toFixed(1));
  setEl('ww-desc',   desc.charAt(0).toUpperCase() + desc.slice(1));
  setEl('ww-hum',    d.main.humidity + '%');
  setEl('ww-wind',   windKmh + ' km/h');
  setEl('ww-feels',  d.main.feels_like.toFixed(1) + '°');

  // Header
  setEl('hdr-loc',       `${locationData.city}, ${locationData.country}`);
  setEl('hdr-weather-icon', icon);
  setEl('settings-loc',  `${locationData.city}, ${locationData.country}`);

  // Push to charts (outdoor temp/humidity only — moisture comes from Firebase sensors.js)
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  pushChart(d.main.temp, d.main.humidity, null, now);

  // Badge warning if out of range
  const t = d.main.temp;
  const tempBadge = document.getElementById('temp-badge');
  if (tempBadge) tempBadge.className = 'sc-badge ' + (t < 20 || t > 30 ? 'warn' : 'live');

  checkWeatherAlerts(d);
}

function checkWeatherAlerts(d) {
  if (d.main.temp > 35) addNotif('🌡️', 'High Temperature Alert', `Temperature is ${d.main.temp.toFixed(1)}°C — plants may be stressed.`, 'warn');
  if (d.main.temp < 15) addNotif('❄️', 'Low Temperature Alert',  `Temperature is ${d.main.temp.toFixed(1)}°C — consider frost protection.`, 'info');
}