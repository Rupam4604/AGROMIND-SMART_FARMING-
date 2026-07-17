/* ═══════════════════════════════════════════════════
   config.js — APP CONFIGURATION
   Edit API keys, crop thresholds, sensor ranges here.
═══════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyDE7uaZvDKZssxz31cMHkaEExuXNny-Wcc",
  authDomain: "agromind-2bd7f.firebaseapp.com",
  databaseURL: "https://agromind-2bd7f-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "agromind-2bd7f",
  storageBucket: "agromind-2bd7f.firebasestorage.app",
  messagingSenderId: "544430258565",
  appId: "1:544430258565:web:9e2498c050faa9dca7ecec"
};

// ── Initialize Firebase ──
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ── Weather API key (OpenWeatherMap) ──
// Get a free key at: https://openweathermap.org/api
const WEATHER_KEY = '9ebc2ee872e295698c6419880044ea54';

// ── Sensor simulation ranges ──
// Edit these to change the mock sensor data behavior
const SENSOR_CONFIG = {
  moisture: { min: 40, max: 75 },  // % range for random simulation
  water:    { min: 50, max: 95 },  // % range for water tank level
};

// ── Sensor update interval (milliseconds) ──
const SENSOR_INTERVAL = 5000; // 5 seconds

// ── Crop configurations ──
// Add new crops here: key, min/opt/max moisture %, emoji, label
const cropConfig = {
  tomato:     { min:60, opt:70, max:80, emoji:'🍅', label:'Tomato'     },
  potato:     { min:65, opt:75, max:85, emoji:'🥔', label:'Potato'     },
  pepper:     { min:55, opt:65, max:75, emoji:'🫑', label:'Pepper'     },
  corn:       { min:60, opt:70, max:80, emoji:'🌽', label:'Corn'       },
  apple:      { min:50, opt:62, max:75, emoji:'🍎', label:'Apple'      },
  grape:      { min:40, opt:52, max:65, emoji:'🍇', label:'Grape'      },
  strawberry: { min:65, opt:75, max:85, emoji:'🍓', label:'Strawberry' },
  orange:     { min:50, opt:62, max:75, emoji:'🍊', label:'Orange'     },
  peach:      { min:55, opt:65, max:75, emoji:'🍑', label:'Peach'      },
  blueberry:  { min:60, opt:70, max:80, emoji:'🫐', label:'Blueberry'  },
  cherry:     { min:55, opt:65, max:75, emoji:'🍒', label:'Cherry'     },
  squash:     { min:65, opt:75, max:85, emoji:'🎃', label:'Squash'     },
  soybean:    { min:55, opt:65, max:75, emoji:'🫘', label:'Soybean'    },
  raspberry:  { min:60, opt:70, max:80, emoji:'🍓', label:'Raspberry'  },
};

// ── Weather icon map (OWM icon code → emoji) ──
const ICON_MAP = {
  '01d': '☀️',  '01n': '🌙',
  '02d': '⛅',  '02n': '☁️',
  '03d': '☁️',  '03n': '☁️',
  '04d': '☁️',  '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️',  '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

// ── Max chart data points ──
const CHART_MAX_POINTS = 20;