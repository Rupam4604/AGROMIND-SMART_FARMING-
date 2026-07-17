/* ═══════════════════════════════════════════════════
   charts.js — CHART.JS INITIALIZATION & DATA
   Outdoor weather charts + Indoor Firebase sensor charts
═══════════════════════════════════════════════════ */

let charts = {};

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridC  = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)';
  const textC  = isDark ? '#A5D6A7' : '#6B896C';

  const baseOptions = {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridC }, ticks: { color: textC, font: { size: 10 }, maxTicksLimit: 6 } },
        y: { grid: { color: gridC }, ticks: { color: textC, font: { size: 10 } } },
      },
      elements: {
        line:  { tension: .4, borderWidth: 2 },
        point: { radius: 3, hoverRadius: 5 },
      },
    },
  };

  const makeChart = (canvasId, label, color, bg) => {
    const el = document.getElementById(canvasId);
    if (!el) return null; // canvas not present in this page, skip safely
    return new Chart(el, {
      ...baseOptions,
      data: { labels: [], datasets: [{ label, data: [], borderColor: color, backgroundColor: bg, fill: true }] },
    });
  };

  // ── Outdoor Weather charts ──
  charts.temp = makeChart('chart-temp', '°C', '#FF6B35', 'rgba(255,107,53,.08)');
  charts.hum  = makeChart('chart-hum',  '%',  '#0288D1', 'rgba(2,136,209,.08)');

  // ── Indoor Firebase Sensor charts ──
  charts.indoorMoist = makeChart('chart-indoor-moist', '%',  '#52B788', 'rgba(82,183,136,.08)');
  charts.indoorTemp  = makeChart('chart-indoor-temp',  '°C', '#EF5350', 'rgba(239,83,80,.08)');
  charts.indoorHum   = makeChart('chart-indoor-hum',   '%',  '#26C6DA', 'rgba(38,198,218,.08)');
}

/* Generic push helper */
function pushToChart(chart, val, label) {
  if (!chart || val === null || val === undefined || isNaN(val)) return;
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(val);
  if (chart.data.labels.length > CHART_MAX_POINTS) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update('none');
}

/* ── Outdoor weather data (called from weather.js) ── */
function pushChart(temp, hum, moist, label) {
  pushToChart(charts.temp, temp, label);
  pushToChart(charts.hum,  hum,  label);
  // moist kept for backward compatibility, unused for outdoor
}

/* ── Indoor Firebase sensor data (called from sensors.js) ── */
function pushIndoorChart(moist, temp, hum, label) {
  pushToChart(charts.indoorMoist, moist, label);
  pushToChart(charts.indoorTemp,  temp,  label);
  pushToChart(charts.indoorHum,   hum,   label);
}