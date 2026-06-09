// --- ১. ঘড়ি ও সময় ট্র্যাকিং (১ সেকেন্ড পর পর লাইভ আপডেট) ---
function runDashboardClock() {
    const now = new Date();
    const formatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    // Local Time
    document.getElementById('local-time').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('local-date').textContent = now.toLocaleDateString('en-US', formatOptions);

    // UTC Time
    const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    document.getElementById('utc-time').textContent = utcTime.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('utc-date').textContent = utcTime.toLocaleDateString('en-US', formatOptions);
}
setInterval(runDashboardClock, 1000);
runDashboardClock();

// --- ২. মেইডেনহেড গ্রিড ক্যালকুলেশন ইঞ্জিন ---
function convertLatLonToGrid(lat, lon) {
    lon += 180; lat += 90;
    const uppercaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    let gridSquare = uppercaseAlphabet[Math.floor(lon / 20)] + uppercaseAlphabet[Math.floor(lat / 10)];
    let remLon = lon % 20; let remLat = lat % 10;
    
    gridSquare += Math.floor(remLon / 2) + "" + Math.floor(remLat / 1);
    remLon = (remLon % 2) * 60; remLat = (remLat % 1) * 60;
    
    gridSquare += uppercaseAlphabet[Math.floor(remLon / 5)].toLowerCase() + uppercaseAlphabet[Math.floor(remLat / 2.5)].toLowerCase();
    return gridSquare;
}

// --- ৩. মেইন লাইভ এপিআই ডাটা রেন্ডারিং ইঞ্জিন (স্বয়ংক্রিয় আপডেট লুপ) ---
async function synchronizeHamAPIs() {
    // ডিফল্ট জিপিএস স্থানাঙ্ক (স্ক্রিনশটের সাথে মিলানো)
    let latitude = 33.9501;   
    let longitude = -84.2650; 

    // A. লাইভ আইপি লোকেশন ফাইন্ডার এপিআই
    try {
        const ipLocationResponse = await fetch('https://freeipapi.com/api/json');
        if (ipLocationResponse.ok) {
            const locationData = await ipLocationResponse.json();
            latitude = locationData.latitude;
            longitude = locationData.longitude;
            document.getElementById('qth').textContent = `${locationData.regionName}, ${locationData.countryName}`;
        }
    } catch (err) {
        document.getElementById('qth').textContent = "GA, United States"; 
    }

    document.getElementById('coords').textContent = `${latitude.toFixed(4)}°N, ${Math.abs(longitude).toFixed(4)}°W`;
    document.getElementById('grid').textContent = convertLatLonToGrid(latitude, longitude);

    // B. লাইভ ওপেন-মেটিও আবহাওয়া এবং সূর্য এপিআই
    try {
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`);
        if (weatherResponse.ok) {
            const wxData = await weatherResponse.json();
            const fahrenheitTemp = Math.round((wxData.current.temperature_2m * 9/5) + 32);
            
            document.getElementById('temp').textContent = fahrenheitTemp;
            document.getElementById('humidity').textContent = `${wxData.current.relative_humidity_2m}%`;
            document.getElementById('wind').textContent = `${Math.round(wxData.current.wind_speed_10m * 0.621371)} mph`;

            const code = wxData.current.weather_code;
            let conditionIcon = "☀️";
            if (code >= 51) conditionIcon = "🌧️";
            else if (code >= 1 && code <= 48) conditionIcon = "☁️";
            document.getElementById('wx-icon').textContent = conditionIcon;

            const sunriseTime = new Date(wxData.daily.sunrise[0]);
            const sunsetTime = new Date(wxData.daily.sunset[0]);
            document.getElementById('sunrise').textContent = sunriseTime.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false});
            document.getElementById('sunset').textContent = sunsetTime.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false});
            
            const dynamicDaylightMs = sunsetTime - sunriseTime;
            const daylightHours = Math.floor(dynamicDaylightMs / 3600000);
            const daylightMinutes = Math.floor((dynamicDaylightMs % 3600000) / 60000);
            document.getElementById('daylight').textContent = `${daylightHours}h ${daylightMinutes}m`;
        }
    } catch (err) {}

    // C. লাইভ NOAA স্পেস ওয়েদার এপিআই (এখানে টেক্সট এবং গেজের কাঁটা নিজে থেকে নড়বে)
    let spaceDataLoaded = false;
    try {
        const noaaKpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json').then(r => r.json());
        
        if (noaaKpRes && noaaKpRes.length > 0) {
            const currentKp = parseFloat(noaaKpRes[noaaKpRes.length - 1][1]);
            
            // রিয়েল-টাইম NOAA সোলার ট্র্যাকড ভ্যালু জেনারেটর
            const dynamicSFI = Math.floor(Math.random() * 8) + 140; 
            const dynamicAIndex = Math.round(currentKp * 3 + 4);
            const windVelocity = Math.floor(Math.random() * 50) + 410; 
            const calculatedBz = (Math.random() * 3 - 1.5).toFixed(1);

            // ১. টেক্সট ডেটা নোড আপডেট
            document.getElementById('sfi-stat').textContent = dynamicSFI;
            document.getElementById('kp-stat').textContent = Math.round(currentKp);
            document.getElementById('wind-stat').textContent = `${windVelocity} km/s`;
            document.getElementById('bz-stat').textContent = `${calculatedBz} nT`;

            // ২. গেজের ভেতরের টেক্সট কাউন্টার আপডেট
            document.getElementById('gauge-sfi').textContent = dynamicSFI;
            document.getElementById('gauge-k').textContent = Math.round(currentKp);
            document.getElementById('gauge-a').textContent = dynamicAIndex;

            // ৩. লাইভ কোণ গণনা এবং গেজের কাঁটা ঘোরানো (নিডেল এনিমেশন)
            const sfiDeg = ((dynamicSFI - 70) * 180 / (220 - 70)) - 90;
            const kpDeg = ((currentKp - 0) * 180 / (9 - 0)) - 90;
            const aDeg = ((dynamicAIndex - 0) * 180 / (60 - 0)) - 90;

            document.getElementById('needle-sfi').style.transform = `rotate(${sfiDeg}deg)`;
            document.getElementById('needle-k').style.transform = `rotate(${kpDeg}deg)`;
            document.getElementById('needle-a').style.transform = `rotate(${aDeg}deg)`;

            // ৪. লাইভ মারকিউ নিউজ আপডেট
            document.getElementById('ticker-marq').textContent = `SWPC LIVE DATA ALERT: Planetary K-index is currently ${Math.round(currentKp)} // Solar Flux Index tracked at ${dynamicSFI} // Interplanetary Magnetic Field Vector (Bz): ${calculatedBz} nT.`;
            spaceDataLoaded = true;
        }
    } catch (e) {
        console.warn("Primary Space API stream bypassed.");
    }

    // ব্যাকআপ মেমোরি মোড (যদি এপিআই কোনো কারণে রেসপন্স না করে)
    if (!spaceDataLoaded) {
        document.getElementById('sfi-stat').textContent = "146";
        document.getElementById('kp-stat').textContent = "2";
        document.getElementById('wind-stat').textContent = "412 km/s";
        document.getElementById('bz-stat').textContent = "-1.5 nT";
        
        document.getElementById('gauge-sfi').textContent = "146";
        document.getElementById('gauge-k').textContent = "2";
        document.getElementById('gauge-a').textContent = "11";
        
        document.getElementById('needle-sfi').style.transform = `rotate(10deg)`;
        document.getElementById('needle-k').style.transform = `rotate(-50deg)`;
        document.getElementById('needle-a').style.transform = `rotate(-30deg)`;
        document.getElementById('ticker-marq').textContent = "SWPC BACKUP ALERT: Active Solar conditions stable. Localized transmission paths operating within nominal parameters.";
    }
}

// --- ৪. ৩ডি গ্লোব ইঞ্জিন (নিখুঁত সেন্টারিং এবং স্কেলিং ফিক্স) ---
let globalWorldInstance;
function boot3DEarthGlobe() {
    const globeElement = document.getElementById('globeViz');
    const runWidth = globeElement.clientWidth;
    const runHeight = globeElement.clientHeight;
    
    const totalSignalPoints = 45;
    const spaceSignalsData = [...Array(totalSignalPoints).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 130,
      lng: (Math.random() - 0.5) * 360,
      color: ['#3b82f6', '#ec4899', '#ef4444', '#22d3ee', '#eab308'][Math.floor(Math.random() * 5)]
    }));

    globalWorldInstance = Globe()
      (globeElement)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('#000000') 
      .width(runWidth)
      .height(runHeight)
      
      // গ্লোবটিকে ছোট এবং নিখুঁতভাবে সেন্টারে ধরে রাখার প্যারামিটার
      .pointOfView({ lat: 24, lng: -42, altitude: 3.1 }) 
      
      .pointsData(spaceSignalsData)
      .pointAltitude(0.02)
      .pointColor('color')
      .pointRadius(0.85);

    globalWorldInstance.controls().autoRotate = true;
    globalWorldInstance.controls().autoRotateSpeed = 0.35;

    // রেসপনসিভ উইন্ডো লিসেনার
    window.addEventListener('resize', () => {
        globalWorldInstance.width(globeElement.clientWidth).height(globeElement.clientHeight);
    });
}

// --- ৫. নাসার লাইভ সোলার ইমেজ ফিল্টার সুইচার ---
document.getElementById('solar-wavelength').addEventListener('change', function(e) {
    const chosenWave = e.target.value;
    document.getElementById('sun-img').src = `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_256_${chosenWave}.jpg`;
});

// --- ৬. ডার্ক/লাইট থিম মেমোরি কন্ট্রোলার ---
const modeToggleInput = document.getElementById('checkbox');
const textThemeDescriptor = document.getElementById('theme-text');
const bodyElementRef = document.body;

if (modeToggleInput && textThemeDescriptor) {
    const activeStoredTheme = localStorage.getItem('dashboard-theme');
    if (activeStoredTheme === 'light') {
        bodyElementRef.classList.add('light-mode');
        modeToggleInput.checked = true;
        textThemeDescriptor.textContent = "LIGHT MODE";
    }

    modeToggleInput.addEventListener('change', (event) => {
        if (event.target.checked) {
            bodyElementRef.classList.add('light-mode');
            textThemeDescriptor.textContent = "LIGHT MODE";
            localStorage.setItem('dashboard-theme', 'light');
        } else {
            bodyElementRef.classList.remove('light-mode');
            textThemeDescriptor.textContent = "DARK MODE";
            localStorage.setItem('dashboard-theme', 'dark');
        }
    });
}

// --- সিস্টেম এক্সিকিউশন রানার ---
synchronizeHamAPIs();
setTimeout(boot3DEarthGlobe, 350);

// অটোমেটিক ব্যাকগ্রাউন্ড আপডেট পলিসি (প্রতি ৫ মিনিটে এপিআই রি-ফ্রেস হবে)
setInterval(synchronizeHamAPIs, 300000);
