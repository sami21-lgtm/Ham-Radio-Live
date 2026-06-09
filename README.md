# 📡 Tactical Ham Radio Live Dashboard

A professional-grade, tactical ham radio dashboard boasting live telemetry, real-time spatial analytics, an interactive 3D globe interface, and an optimized hybrid dark/light theme switcher. 

---

## 🚀 Key Features

* **🌐 Interactive 3D Earth Globe:** Live map viewport loaded via WebGL rendering dynamic station spots, active signal nodes, and contact tracks color-mapped by frequency band.
* **🌍 Geolocation QTH Matrix:** Automatically tracks client IP routes to derive exact latitude, longitude coordinates, and regional QTH locators.
* **📐 Maidenhead Grid Engine:** Runs native algorithmic coordinate tracking to dynamically output localized Maidenhead grid sub-squares (e.g., EM73uw) directly in your browser.
* **☀️ NOAA Space Weather Integration:** Live data feed processing real-time Planetary K-Index (Kp), Solar Flux Index (SFI), Geomagnetic A-Index, Solar Wind Velocity, and Interplanetary Magnetic Field Vectors (Bz).
* **📸 NASA SDO Live Imagery:** Fetches direct high-resolution solar corona and atmospheric visuals (193 Å / 304 Å / 171 Å) straight from NASA's Solar Dynamics Observatory.
* **⛅ Real-time Weather Telemetry:** Connected via Open-Meteo API to stream dynamic temperature (°F/°C tracking), ambient humidity percentage, and wind velocities.
* **🌓 Persistent Theme Switcher:** Features a modern toggle engine modifying elements seamlessly between tactical dark mode and high-contrast light mode, utilizing browser cache storage.
* **📰 Active DX News Ticker:** Integrated bottom ticker rendering space weather warnings, active solar storm thresholds, and custom transmission alerts.

---

## 🛠️ Built With

* **HTML5** – Semantic element distribution and layout scaffolding.
* **CSS3** – Custom tactical interfaces, smooth CSS variables, and trigonometric gauge configurations.
* **JavaScript (ES6+)** – Asynchronous API fetch architectures, Maidenhead string formatting calculations, and UI event loops.
* **Globe.gl Lib** – High-performance WebGL asset layers used to map global communication links onto a 3D canvas object.

---

## 📂 File Architecture

```text
├── index.html       # Structural layout and remote API asset endpoints
├── style.css        # Core style frameworks and dark/light token overrides
└── script.js        # Core API processors, 3D Canvas initialization, and system loops
